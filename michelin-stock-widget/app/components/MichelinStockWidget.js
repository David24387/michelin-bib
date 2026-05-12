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

  return `${value > 0 ? "+" : ""}${value.toFixed(2).replace(".", ",")} %`;
}

function formatTime(value) {
  if (!value) return "–";

  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
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
        height: 205,
        maxWidth: "100%",
        overflow: "hidden",
        background: "linear-gradient(90deg, #144c9f 0%, #0c7ac5 100%)",
        color: "white",
        borderRadius: 0,
        padding: "16px 24px",
        boxSizing: "border-box",
        boxShadow: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              opacity: 0.78,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Aktienkurs
          </p>

          <h2
            style={{
              margin: "4px 0 0",
              fontSize: 30,
              lineHeight: 1,
              fontWeight: 800,
            }}
          >
            Michelin
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              opacity: 0.75,
              fontSize: 12,
            }}
          >
            Symbol: ML.PA
          </p>
        </div>

        <button
          onClick={loadStock}
          aria-label="Aktualisieren"
          style={{
            height: 40,
            width: 40,
            minWidth: 40,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.35)",
            background: "rgba(255,255,255,0.12)",
            color: "white",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={17} />
        </button>
      </div>

      {loading && (
        <p
          style={{
            marginTop: 24,
            fontSize: 15,
          }}
        >
          Lädt Kursdaten …
        </p>
      )}

      {error && (
        <p
          style={{
            marginTop: 18,
            background: "rgba(255,255,255,0.12)",
            padding: 12,
            borderRadius: 12,
            fontSize: 13,
          }}
        >
          {error}
        </p>
      )}

      {stock && !error && (
        <>
          <div style={{ marginTop: 22 }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: "-1.5px",
                lineHeight: 1,
              }}
            >
              {formatPrice(stock.price)}
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 10,
                padding: "7px 11px",
                borderRadius: 999,
                background: isPositive
                  ? "rgba(22, 163, 74, 0.28)"
                  : "rgba(220, 38, 38, 0.28)",
                color: "white",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {isPositive ? <TrendingUp size={15} /> : <TrendingDown size={15} />}

              <span>
                {stock.change > 0 ? "+" : ""}
                {stock.change?.toFixed(2).replace(".", ",")} EUR ·{" "}
                {formatPercent(stock.changePercent)}
              </span>
            </div>
          </div>

          <p
            style={{
              margin: "14px 0 0",
              opacity: 0.68,
              fontSize: 10,
            }}
          >
            Stand: {formatTime(stock.updatedAt)}
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
        border: "1px solid rgba(255,255,255,0.13)",
        borderRadius: 12,
        padding: "8px 8px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 9,
          opacity: 0.72,
          marginBottom: 3,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight: 800,
          fontSize: 11,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}
