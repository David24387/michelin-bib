export const dynamic = "force-dynamic";

const SYMBOL = "ML.PA";

export async function GET() {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${SYMBOL}?interval=1m&range=1d`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return Response.json(
        { error: "Yahoo Finance konnte nicht geladen werden" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const result = data.chart.result?.[0];

    if (!result) {
      return Response.json(
        { error: "Keine Kursdaten für Michelin gefunden" },
        { status: 404 }
      );
    }

    const meta = result.meta;

    return Response.json({
      symbol: SYMBOL,
      name: "Michelin",
      price: meta.regularMarketPrice,
      change: meta.regularMarketPrice - meta.previousClose,
      changePercent:
        ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) *
        100,
      high: meta.regularMarketDayHigh,
      low: meta.regularMarketDayLow,
      open: meta.regularMarketOpen,
      previousClose: meta.previousClose,
      updatedAt: new Date(meta.regularMarketTime * 1000).toISOString(),
    });
  } catch (error) {
    return Response.json(
      { error: "Serverfehler beim Abrufen des Michelin-Kurses" },
      { status: 500 }
    );
  }
}
