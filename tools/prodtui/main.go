package main

import (
	"fmt"
	"os"
	"os/exec"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type action int

const (
	actStart action = iota
	actStop
	actRemoveProxy
	actRefresh
	actCheck
	actStudio
	actPsql
	actQuit
)

type item struct {
	label string
	desc  string
	act   action
}

var items = []item{
	{"Start tunnel", "zajistí proxy (trvalá) + ssh forward", actStart},
	{"Stop tunnel", "zavře jen ssh forward, proxy běží dál", actStop},
	{"Remove proxy", "úplně smaže proxy kontejner na serveru", actRemoveProxy},
	{"Refresh status", "znovu zkontroluje port", actRefresh},
	{"drizzle-kit check", "ověří konzistenci migrací", actCheck},
	{"Drizzle Studio", "GUI nad prod DB (přes tunel)", actStudio},
	{"psql shell", "interaktivní psql do prod DB", actPsql},
	{"Quit", "konec", actQuit},
}

// messages
type statusMsg bool
type resultMsg struct {
	out string
	err error
}

var (
	titleStyle  = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("212"))
	selStyle    = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("212"))
	dimStyle    = lipgloss.NewStyle().Foreground(lipgloss.Color("244"))
	okStyle     = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("42"))
	downStyle   = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("196"))
	boxStyle    = lipgloss.NewStyle().Border(lipgloss.RoundedBorder()).Padding(0, 1).Foreground(lipgloss.Color("250"))
	errStyle    = lipgloss.NewStyle().Foreground(lipgloss.Color("196"))
)

type model struct {
	cfg     Config
	cursor  int
	up      bool
	busy    bool
	output  string
}

func initialModel() model {
	return model{cfg: loadConfig()}
}

func (m model) Init() tea.Cmd {
	return checkStatus(m.cfg)
}

func checkStatus(c Config) tea.Cmd {
	return func() tea.Msg { return statusMsg(c.tunnelUp()) }
}

func runFn(fn func() (string, error)) tea.Cmd {
	return func() tea.Msg {
		out, err := fn()
		return resultMsg{out: out, err: err}
	}
}

// drizzleCheck runs `pnpm exec drizzle-kit check` in the project with prod DATABASE_URL.
func (c Config) drizzleCheck() (string, error) {
	if c.DBURL == "" {
		return "", fmt.Errorf("DB_URL není nastaven (.env.prod)")
	}
	cmd := exec.Command("pnpm", "exec", "drizzle-kit", "check")
	cmd.Dir = c.ProjectDir
	cmd.Env = append(os.Environ(), "DATABASE_URL="+c.DBURL)
	out, err := cmd.CombinedOutput()
	return string(out), err
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case statusMsg:
		m.up = bool(msg)
		m.busy = false
		return m, nil
	case resultMsg:
		m.busy = false
		if msg.err != nil {
			m.output = errStyle.Render("ERR: "+msg.err.Error()) + "\n" + msg.out
		} else {
			m.output = msg.out
		}
		return m, checkStatus(m.cfg)
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q":
			return m, tea.Quit
		case "up", "k":
			if m.cursor > 0 {
				m.cursor--
			}
		case "down", "j":
			if m.cursor < len(items)-1 {
				m.cursor++
			}
		case "enter", " ":
			return m.run(items[m.cursor].act)
		}
	}
	return m, nil
}

func (m model) run(a action) (tea.Model, tea.Cmd) {
	switch a {
	case actQuit:
		return m, tea.Quit
	case actRefresh:
		m.busy = true
		return m, checkStatus(m.cfg)
	case actStart:
		m.busy = true
		m.output = "spouštím tunel…"
		return m, runFn(m.cfg.start)
	case actStop:
		m.busy = true
		m.output = "zavírám forward…"
		return m, runFn(m.cfg.stop)
	case actRemoveProxy:
		m.busy = true
		m.output = "odstraňuji proxy…"
		return m, runFn(m.cfg.removeProxy)
	case actCheck:
		m.busy = true
		m.output = "drizzle-kit check…"
		return m, runFn(m.cfg.drizzleCheck)
	case actStudio:
		if !m.up {
			m.output = errStyle.Render("tunel není nahoře — nejdřív Start")
			return m, nil
		}
		c := exec.Command("pnpm", "exec", "drizzle-kit", "studio")
		c.Dir = m.cfg.ProjectDir
		c.Env = append(os.Environ(), "DATABASE_URL="+m.cfg.DBURL)
		return m, tea.ExecProcess(c, func(err error) tea.Msg {
			if err != nil {
				return resultMsg{out: "", err: err}
			}
			return resultMsg{out: "studio ukončeno"}
		})
	case actPsql:
		if !m.up {
			m.output = errStyle.Render("tunel není nahoře — nejdřív Start")
			return m, nil
		}
		c := exec.Command("psql", m.cfg.DBURL)
		return m, tea.ExecProcess(c, func(err error) tea.Msg {
			if err != nil {
				return resultMsg{out: "psql nedostupné? brew install libpq", err: err}
			}
			return resultMsg{out: "psql ukončeno"}
		})
	}
	return m, nil
}

func (m model) View() string {
	var b strings.Builder
	b.WriteString(titleStyle.Render("  prod-tui · burdych.net DB tunnel") + "\n\n")

	status := downStyle.Render("● DOWN")
	if m.up {
		status = okStyle.Render("● UP")
	}
	b.WriteString(fmt.Sprintf("  tunel: %s   %s\n",
		status, dimStyle.Render("127.0.0.1:"+m.cfg.LocalPort+" → "+m.cfg.DBContainer+":"+m.cfg.DBPort)))
	if m.cfg.DBURL == "" {
		b.WriteString("  " + errStyle.Render("⚠ DB_URL chybí — vytvoř .env.prod (viz .env.prod.example)") + "\n")
	}
	b.WriteString("\n")

	for i, it := range items {
		cursor := "  "
		label := it.label
		if i == m.cursor {
			cursor = selStyle.Render("▸ ")
			label = selStyle.Render(label)
		}
		b.WriteString(fmt.Sprintf("%s%s  %s\n", cursor, label, dimStyle.Render(it.desc)))
	}
	b.WriteString("\n")

	out := m.output
	if m.busy {
		out = "… pracuji"
	}
	if out != "" {
		b.WriteString(boxStyle.Width(70).Render(out) + "\n")
	}
	b.WriteString("\n" + dimStyle.Render("  ↑/↓ pohyb · enter spustit · q konec"))
	return b.String()
}

func main() {
	if _, err := tea.NewProgram(initialModel()).Run(); err != nil {
		fmt.Println("error:", err)
		os.Exit(1)
	}
}
