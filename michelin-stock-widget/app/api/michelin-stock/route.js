export const dynamic = "force-dynamic";

const FINNHUB_URL = "https://finnhub.io/api/v1/quote";
const SYMBOL = "ML.PA"; // Michelin an der Euronext Paris

export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "FINNHUB_API_KEY fehlt in .env.local" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${FINNHUB_URL}?symbol=${SYMBOL}&token=${apiKey}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json(
        { error: "Finnhub API konnte nicht geladen werden" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return Response.json({
      symbol: SYMBOL,
      name: "Michelin",
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      { error: "Serverfehler beim Abrufen des Aktienkurses" },
      { status: 500 }
    );
  }
}
