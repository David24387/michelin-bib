"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

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
      const res = await fetch("/api/michelin-stock", { cache: "no-store" });
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
    const interval = setInterval(loadStock, 60_000);
    return () => clearInterval(interval);
  }, []);

  const isPositive = stock?.change >= 0;

  return (
    <section style={{
      width: "100%",
      maxWidth: 420,
      background: "linear-gradient(135deg, #082b57 0%, #004b93 100%)",
      color: "white",
      borderRadius: 24,
      padding: 24,
      boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
      boxSizing: "border-box"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div>
          <p style={{ margin: 0, opacity: 0.75, fontSize: 14 }}>Aktienkurs</p>
          <h2 style={{ margin: "6px 0 0", fontSize: 28, lineHeight: 1.1 }}>
            Michelin
          </h2>
          <p style={{ margin: "6px 0 0", opacity: 0.75, fontSize: 13 }}>
            Symbol: ML.PA
          </p>
        </div>

        <button
          onClick={loadStock}
          aria-label="Aktualisieren"
          style={{
            height: 44,
            width: 44,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.25)",
            background: "rgba(255,255,255,0.12)",
            color: "white",
            cursor: "pointer"
          }}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {loading && (
        <p style={{ marginTop: 28, fontSize: 18 }}>Lädt Kursdaten …</p>
      )}

      {error && (
        <p style={{
          marginTop: 28,
          background: "rgba(255,255,255,0.12)",
          padding: 14,
          borderRadius: 14
        }}>
          {error}
        </p>
      )}

      {stock && !error && (
        <>
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-1px" }}>
              {formatPrice(stock.price)}
            </div>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 10,
              padding: "8px 12px",
              borderRadius: 999,
              background: isPositive ? "rgba(22, 163, 74, 0.25)" : "rgba(220, 38, 38, 0.25)",
              color: "white",
              fontWeight: 700
            }}>
              {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              <span>
                {stock.change > 0 ? "+" : ""}
                {stock.change?.toFixed(2).replace(".", ",")} EUR · {formatPercent(stock.changePercent)}
              </span>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 24
          }}>
            <SmallStat label="Tageshoch" value={formatPrice(stock.high)} />
            <SmallStat label="Tagestief" value={formatPrice(stock.low)} />
            <SmallStat label="Eröffnung" value={formatPrice(stock.open)} />
            <SmallStat label="Vortag" value={formatPrice(stock.previousClose)} />
          </div>

          <p style={{ margin: "22px 0 0", opacity: 0.7, fontSize: 12 }}>
            Zuletzt aktualisiert: {formatTime(stock.updatedAt)}
          </p>
        </>
      )}
    </section>
  );
}

function SmallStat({ label, value }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 16,
      padding: 12
    }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
      <div style={{ marginTop: 4, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
