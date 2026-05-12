"use client";

import { useEffect, useState } from "react";
import { Montserrat } from "next/font/google";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
});

function formatPrice(value) {
  if (typeof value !== "number") return "–";

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value) {
  if (typeof value !== "number") return "–";

  return `${value > 0 ? "+" : ""}${value
    .toFixed(2)
    .replace(".", ",")} %`;
}

function formatTime(value) {
  if (!value) return "–";

  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

export default function MichelinStockWidget() {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStock() {
    try {
      setError("");

      const res = await fetch("/api/michelin-stock", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Fehler beim Laden");
      }

      setStock(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStock();

    const interval = setInterval(loadStock, 60000);

    return () => clearInterval(interval);
  }, []);

  const isPositive = stock?.change >= 0;

  return (
    <section
      className={montserrat.className}
      style={{
        width: "100%",
        maxWidth: 420,
        background:
          "linear-gradient(90deg, #144c9f 0%, #0c7ac5 100%)",
        color: "white",
        borderRadius: 28,
        padding: 24,
        boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              opacity: 0.8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Aktienkurs
          </p>

          <h2
            style={{
              margin: "6px 0 0",
              fontSize: 36,
              lineHeight: 1.1,
              fontWeight: 700,
            }}
          >
            Michelin
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              opacity: 0.75,
              fontSize: 14,
            }}
          >
            Symbol: ML.PA
          </p>
        </div>

        <button
          onClick={loadStock}
          aria-label="Aktualisieren"
          style={{
            height: 48,
            width: 48,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.25)",
            background: "rgba(255,255,255,0.12)",
            color: "white",
            cursor: "pointer",
            transition: "0.2s ease",
          }}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {loading && (
        <p
          style={{
            marginTop: 28,
            fontSize: 18,
          }}
        >
          Lädt Kursdaten …
        </p>
      )}

      {error && (
        <p
          style={{
            marginTop: 28,
            background: "rgba(255,255,255,0.12)",
            padding: 14,
            borderRadius: 14,
            fontSize: 14,
          }}
        >
          {error}
        </p>
      )}

      {stock && !error && (
        <>
          <div style={{ marginTop: 28 }}>
            <div
              style={{
                fontSize: 54,
                fontWeight: 800,
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              {formatPrice(stock.price)}
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 14,
                padding: "10px 14px",
                borderRadius: 999,
                background: isPositive
                  ? "rgba(22, 163, 74, 0.25)"
                  : "rgba(220, 38, 38, 0.25)",
                color: "white",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {isPositive ? (
                <TrendingUp size={18} />
              ) : (
                <TrendingDown size={18} />
              )}

              <span>
                {stock.change > 0 ? "+" : ""}
                {stock.change?.toFixed(2).replace(".", ",")} EUR ·{" "}
                {formatPercent(stock.changePercent)}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginTop: 28,
            }}
          >
            <SmallStat
              label="Tageshoch"
              value={formatPrice(stock.high)}
            />

            <SmallStat
              label="Tagestief"
              value={formatPrice(stock.low)}
            />

            <SmallStat
              label="Eröffnung"
              value={formatPrice(stock.open)}
            />

            <SmallStat
              label="Vortag"
              value={formatPrice(stock.previousClose)}
            />
          </div>

          <p
            style={{
              margin: "22px 0 0",
              opacity: 0.7,
              fontSize: 12,
            }}
          >
            Zuletzt aktualisiert:{" "}
            {formatTime(stock.updatedAt)}
          </p>
        </>
      )}
    </section>
  );
}

function SmallStat({ label, value }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 18,
        padding: 14,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          opacity: 0.75,
          marginBottom: 4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        {value}
      </div>
    </div>
  );
}
