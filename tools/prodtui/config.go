package main

import (
	"bufio"
	"os"
	"path/filepath"
	"strings"
)

// Config holds all tunnel + DB settings. Secrets (DB_URL with password) live in
// .env.prod, which is gitignored — nothing sensitive is baked into the binary.
type Config struct {
	SSHKey     string // path to ssh private key
	SSHHost    string // user@host
	DBContainer string // docker container/service name of prod postgres
	LocalPort  string // local forwarded port
	RemotePort string // socat listen port on server
	DBPort     string // postgres port inside container
	Network    string // docker network the DB sits on
	ProjectDir string // burdych.net repo root (for drizzle-kit)
	DBURL      string // full prod connection string via tunnel (127.0.0.1:LocalPort)
}

func defaultConfig() Config {
	home, _ := os.UserHomeDir()
	return Config{
		SSHKey:      filepath.Join(home, ".ssh", "id_ed25519_hetzner"),
		SSHHost:     "root@dokploy.burdych.net",
		DBContainer: "dbs-main-db-tpfd4c",
		LocalPort:   "15432",
		RemotePort:  "15432",
		DBPort:      "5432",
		Network:     "dokploy-network",
		ProjectDir:  "/Users/jirkab/code/burdych.net",
		DBURL:       "", // must come from .env.prod or env
	}
}

// loadConfig applies defaults, then overrides from .env.prod (next to the binary
// or in the working dir), then from real environment variables.
func loadConfig() Config {
	c := defaultConfig()
	for _, p := range envFileCandidates() {
		applyEnvFile(&c, p)
	}
	applyEnv(&c)
	c.SSHKey = expandHome(c.SSHKey)
	return c
}

func envFileCandidates() []string {
	var out []string
	if exe, err := os.Executable(); err == nil {
		out = append(out, filepath.Join(filepath.Dir(exe), ".env.prod"))
	}
	if wd, err := os.Getwd(); err == nil {
		out = append(out, filepath.Join(wd, ".env.prod"))
	}
	return out
}

func applyEnvFile(c *Config, path string) {
	f, err := os.Open(path)
	if err != nil {
		return
	}
	defer f.Close()
	s := bufio.NewScanner(f)
	for s.Scan() {
		line := strings.TrimSpace(s.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		k, v, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		setKey(c, strings.TrimSpace(k), strings.Trim(strings.TrimSpace(v), `"'`))
	}
}

func applyEnv(c *Config) {
	for _, k := range []string{"SSH_KEY", "SSH_HOST", "DB_CONTAINER", "LOCAL_PORT", "REMOTE_PORT", "DB_PORT", "NETWORK", "PROJECT_DIR", "DB_URL"} {
		if v, ok := os.LookupEnv(k); ok && v != "" {
			setKey(c, k, v)
		}
	}
}

func setKey(c *Config, k, v string) {
	switch k {
	case "SSH_KEY":
		c.SSHKey = v
	case "SSH_HOST":
		c.SSHHost = v
	case "DB_CONTAINER":
		c.DBContainer = v
	case "LOCAL_PORT":
		c.LocalPort = v
	case "REMOTE_PORT":
		c.RemotePort = v
	case "DB_PORT":
		c.DBPort = v
	case "NETWORK":
		c.Network = v
	case "PROJECT_DIR":
		c.ProjectDir = v
	case "DB_URL":
		c.DBURL = v
	}
}

func expandHome(p string) string {
	if strings.HasPrefix(p, "~/") {
		if home, err := os.UserHomeDir(); err == nil {
			return filepath.Join(home, p[2:])
		}
	}
	return p
}
