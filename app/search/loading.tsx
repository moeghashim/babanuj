export default function Loading() {
  return (
    <div style={{ padding: "32px 56px 56px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="market-card"
            style={{
              aspectRatio: "1",
              background: "var(--paper)",
              animation: "pulse 1.6s ease-in-out infinite",
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
