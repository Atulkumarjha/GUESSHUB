type Point = { t: string | Date; p: number };

export default function Sparkline({
  data,
  width = 140,
  height = 36,
}: {
  data: Point[];
  width?: number;
  height?: number;
}) {
  if (!data || data.length < 2) {
    return <svg width={width} height={height} />;
  }

  const ys = data.map((d) => d.p);

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeY = maxY - minY || 1;

  const stepX = width / (data.length - 1);

  const path = ys
    .map((y, i) => {
      const x = i * stepX;
      const yy = height - ((y - minY) / rangeY) * (height - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${yy.toFixed(2)}`;
    })
    .join(" ");

  const rising = ys[ys.length - 1] >= ys[0];
  const color = rising ? "#22c55e" : "#ef4444";

  return (
    <svg width={width} height={height} aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <circle
        cx={(data.length - 1) * stepX}
        cy={height - ((ys[ys.length - 1] - minY) / rangeY) * (height - 4) - 2}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}
