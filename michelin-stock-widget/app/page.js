import MichelinStockWidget from "./components/MichelinStockWidget";

export default function Page() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#f3f6fb",
      padding: 24
    }}>
      <MichelinStockWidget />
    </main>
  );
}
