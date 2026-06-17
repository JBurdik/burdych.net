package main

import (
	"fmt"
	"net"
	"os/exec"
	"time"
)

// tunnelUp reports whether the local forwarded port accepts connections.
func (c Config) tunnelUp() bool {
	conn, err := net.DialTimeout("tcp", "127.0.0.1:"+c.LocalPort, 800*time.Millisecond)
	if err != nil {
		return false
	}
	_ = conn.Close()
	return true
}

// sshArgs returns the common ssh flags (key + host appended by caller).
func (c Config) sshBase() []string {
	return []string{"-i", c.SSHKey, "-o", "ConnectTimeout=15", "-o", "StrictHostKeyChecking=accept-new"}
}

// startProxy launches the socat proxy container on the server (idempotent).
func (c Config) startProxy() (string, error) {
	// Persistent proxy: survives reboots / docker restarts via restart policy.
	// Bound to 127.0.0.1 only — reachable from the server's localhost (i.e. via
	// ssh), never from the internet. DB password is still required.
	remote := fmt.Sprintf(
		"docker rm -f pg-tunnel >/dev/null 2>&1; docker run -d --restart=unless-stopped --name pg-tunnel "+
			"--network %s -p 127.0.0.1:%s:%s alpine/socat "+
			"tcp-listen:%s,fork,reuseaddr tcp-connect:%s:%s",
		c.Network, c.RemotePort, c.RemotePort, c.RemotePort, c.DBContainer, c.DBPort,
	)
	args := append(c.sshBase(), c.SSHHost, remote)
	out, err := exec.Command("ssh", args...).CombinedOutput()
	return string(out), err
}

// startLocalForward opens the background ssh -L tunnel.
func (c Config) startLocalForward() (string, error) {
	args := append(c.sshBase(),
		"-f", "-N",
		"-o", "ExitOnForwardFailure=yes",
		"-o", "ServerAliveInterval=30",
		"-L", fmt.Sprintf("%s:localhost:%s", c.LocalPort, c.RemotePort),
		c.SSHHost,
	)
	out, err := exec.Command("ssh", args...).CombinedOutput()
	return string(out), err
}

// start brings up proxy + forward, then waits for the port to open.
func (c Config) start() (string, error) {
	log := ""
	if out, err := c.startProxy(); err != nil {
		return log + out, fmt.Errorf("proxy: %w", err)
	}
	log += "proxy container started\n"
	if out, err := c.startLocalForward(); err != nil {
		return log + out, fmt.Errorf("forward: %w", err)
	}
	log += "ssh forward started\n"
	for i := 0; i < 10; i++ {
		if c.tunnelUp() {
			return log + "tunnel up ✓", nil
		}
		time.Sleep(300 * time.Millisecond)
	}
	return log + "started but port not reachable yet", nil
}

// stop closes only the local ssh forward. The proxy container is persistent
// (restart=unless-stopped) and stays running so it's always ready.
func (c Config) stop() (string, error) {
	spec := fmt.Sprintf("%s:localhost:%s", c.LocalPort, c.RemotePort)
	_ = exec.Command("pkill", "-f", spec).Run()
	return "ssh forward zavřen (proxy běží dál)", nil
}

// removeProxy fully tears down the persistent proxy container on the server.
func (c Config) removeProxy() (string, error) {
	spec := fmt.Sprintf("%s:localhost:%s", c.LocalPort, c.RemotePort)
	_ = exec.Command("pkill", "-f", spec).Run()
	args := append(c.sshBase(), c.SSHHost, "docker rm -f pg-tunnel")
	out, err := exec.Command("ssh", args...).CombinedOutput()
	if err != nil {
		return string(out), fmt.Errorf("remove proxy: %w", err)
	}
	return "proxy kontejner odstraněn + forward zavřen", nil
}
