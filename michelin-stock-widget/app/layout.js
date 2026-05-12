export const metadata = {
  title: "Michelin Aktienkurs Widget",
  description: "Intranet Widget für den Michelin Aktienkurs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, fontFamily: "Arial, Helvetica, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
