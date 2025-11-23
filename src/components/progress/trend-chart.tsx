"use client";

export function TrendChart({ data }: { data: number[] }) {
  const height = 40;
  const width = 100;

  if (data.length < 2) return null;

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width="100%"
      height="40"
      viewBox={`0 0 ${width} ${height}`}
      className="opacity-70"
    >
      <defs>
        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
          <stop offset="100%" stopColor="rgba(99, 102, 241, 0.05)" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="rgba(99, 102, 241, 0.8)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill="url(#trendGradient)"
      />
    </svg>
  );
}
