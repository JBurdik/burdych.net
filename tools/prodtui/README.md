# prod-tui

TUI pro správu SSH tunelu k prod postgres (burdych.net) + drizzle akce.

## Build

```bash
cd tools/prodtui
go build -o prodtui .
```

## Setup

```bash
cp .env.prod.example .env.prod   # vyplň DB_URL (heslo). .env.prod je gitignored.
```

## Spuštění

```bash
./prodtui
```

Ovládání: `↑/↓` pohyb, `enter` spustit, `q` konec.

## Akce

- **Start tunnel** — socat proxy kontejner na serveru (`dokploy-network` → DB kontejner) + `ssh -L` forward na `127.0.0.1:15432`.
- **Stop tunnel** — zruší forward i proxy kontejner.
- **Refresh status** — dial portu, ukáže UP/DOWN.
- **drizzle-kit check** — ověří konzistenci migrací.
- **Drizzle Studio** — GUI nad prod DB přes tunel (vyžaduje běžící tunel).
- **psql shell** — interaktivní psql (potřeba `psql` lokálně: `brew install libpq`).

## Pozor

- `DB_URL` míří na **lokální** port tunelu (`127.0.0.1:15432`), ne na server.
- Tunel je jen pro **diagnostiku/čtení**. Schema měň přes `db:generate` → commit → deploy (migrace), ne ručním `push` na prod.
