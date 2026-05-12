# Michelin Aktienkurs Widget

Next.js Widget für den Michelin Aktienkurs im Intranet.

## Setup

1. Abhängigkeiten installieren:

```bash
npm install
```

2. `.env.local.example` kopieren und in `.env.local` umbenennen:

```bash
cp .env.local.example .env.local
```

3. In `.env.local` deinen Finnhub API-Key eintragen:

```env
FINNHUB_API_KEY=dein_key
```

4. Lokal starten:

```bash
npm run dev
```

Dann öffnen:

```text
http://localhost:3000
```

## API Endpoint

Das Frontend ruft nur diesen internen Endpoint auf:

```text
/api/michelin-stock
```

Der Finnhub API-Key liegt ausschließlich serverseitig in `.env.local`.
