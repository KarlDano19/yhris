"use client";

import React, { useMemo, useRef, useState } from "react";

export type TrendPoint = { x: number; y: number };

type Props = {
  points: TrendPoint[];
  yMax?: number;
};

export default function TrendChart({ points, yMax }: Props) {
  if (!points?.length) return null;

  // Chronological order
  const data = useMemo(() => [...points].sort((a, b) => a.x - b.x), [points]);

  const width = 620;
  const height = 260;

  // Padding
  const padL = 56;
  const padR = 18;
  const padT = 20;
  const padB = 38;

  // X domain (first/last + 10% padding)
  const leftX = data[0].x;
  const rightX = data[data.length - 1].x;
  const span = Math.max(1, rightX - leftX);
  const xPad = span * 0.1;
  const xMin = leftX - xPad;
  const xMax = rightX + xPad;

  // Y domain
  const ys = data.map((p) => p.y);
  const niceStep = 10_000;
  const maxY =
    typeof yMax === "number"
      ? yMax
      : Math.max(niceStep, Math.ceil(Math.max(...ys) / niceStep) * niceStep);
  const minY = 0;

  // Scales
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const nx = (x: number) => padL + ((x - xMin) / (xMax - xMin || 1)) * plotW;
  const ny = (y: number) =>
    height - padB - ((y - minY) / (maxY - minY || 1)) * plotH;

  // Paths
  const linePath = data
    .map((p, i) => `${i ? "L" : "M"} ${nx(p.x)},${ny(p.y)}`)
    .join(" ");

  // Fill entire bottom (left padded edge → first x → line → last x → right padded edge)
  let areaPath = `M ${nx(xMin)},${height - padB}`;
  areaPath += ` L ${nx(data[0].x)},${height - padB}`;
  areaPath += ` L ${nx(data[0].x)},${ny(data[0].y)}`;
  for (let i = 1; i < data.length; i++) {
    areaPath += ` L ${nx(data[i].x)},${ny(data[i].y)}`;
  }
  areaPath += ` L ${nx(data[data.length - 1].x)},${height - padB}`;
  areaPath += ` L ${nx(xMax)},${height - padB} Z`;

  // Grid ticks
  const yTicks = 5;
  const yStep = (maxY - minY) / yTicks;

  const vCols = 3;
  const vStep = (rightX - leftX) / vCols;

  // Colors
  const line = "#6F7DFF";
  const grid = "#E5E7EB";
  const axis = "#D1D5DB";
  const label = "#4B5563";

  // Clip ID
  const clipId = `plot-clip-${Math.round(leftX)}-${Math.round(rightX)}`;

  // End labels
  const leftLabel = new Date(leftX).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const rightLabel = new Date(rightX).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Tooltip (hover anywhere)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const hovered = hoverIdx != null ? data[hoverIdx] : null;
  const tipX = hovered ? nx(hovered.x) : 0;
  const tipY = hovered ? ny(hovered.y) : 0;

  const tipWidth = 170;
  const tipHeight = 32;
  const tipOffset = 8;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const onMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    // Only react inside plot area
    if (mouseX < padL || mouseX > width - padR) {
      setHoverIdx(null);
      return;
    }
    // Find nearest point by X position
    let nearest = 0;
    let best = Number.POSITIVE_INFINITY;
    for (let i = 0; i < data.length; i++) {
      const dx = Math.abs(nx(data[i].x) - mouseX);
      if (dx < best) {
        best = dx;
        nearest = i;
      }
    }
    setHoverIdx(nearest);
  };
  const onLeave = () => setHoverIdx(null);

  const anchorLeft = tipX + tipWidth / 2 > width - padR;
  const bubbleX = anchorLeft ? tipX - tipWidth + 6 : tipX - 6;
  const bubbleY = Math.max(padT, tipY - tipHeight - 14);

  return (
    <svg
      ref={svgRef}
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      aria-label="Salary Trend"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={padL} y={padT} width={plotW} height={plotH} />
        </clipPath>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(111,125,255,0.22)" />
          <stop offset="100%" stopColor="rgba(111,125,255,0.10)" />
        </linearGradient>
      </defs>

      {/* Horizontal dashed grid + Y labels */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const yVal = minY + yStep * i;
        const yPos = ny(yVal);
        return (
          <g key={`gy-${i}`}>
            <line
              x1={padL}
              y1={yPos}
              x2={width - padR}
              y2={yPos}
              stroke={grid}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text
              x={padL - 8}
              y={yPos + 4}
              textAnchor="end"
              fontSize={11}
              fill={label}
            >
              {yVal.toLocaleString()}
            </text>
          </g>
        );
      })}

      {/* Vertical dashed grid between first/last */}
      {Array.from({ length: vCols - 1 }).map((_, i) => {
        const xVal = leftX + vStep * (i + 1);
        const xPos = nx(xVal);
        return (
          <line
            key={`vx-${i}`}
            x1={xPos}
            y1={padT}
            x2={xPos}
            y2={height - padB}
            stroke={grid}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        );
      })}

      {/* X-axis */}
      <line
        x1={padL}
        y1={height - padB}
        x2={width - padR}
        y2={height - padB}
        stroke={axis}
        strokeWidth={1}
      />

      {/* Area + line */}
      <g clipPath={`url(#${clipId})`}>
        <path d={areaPath} fill="url(#trendFill)" />
        <path d={linePath} stroke={line} strokeWidth={2} fill="none" />
      </g>

      {/* Dots (kept for focus/hover target, but tooltip comes from overlay) */}
      {data.map((p, i) => (
        <circle
          key={`pt-${i}`}
          cx={nx(p.x)}
          cy={ny(p.y)}
          r={hoverIdx === i ? 5 : 4}
          fill="white"
          stroke={line}
          strokeWidth={2}
        />
      ))}

      {/* Transparent overlay to capture hover ANYWHERE within plot */}
      <rect
        x={padL}
        y={padT}
        width={plotW}
        height={plotH}
        fill="transparent"
        pointerEvents="all"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      />

      {/* Tooltip */}
      {hovered && (
        <g>
          {/* pointer */}
          <path
            d={
              anchorLeft
                ? `M ${tipX - 6} ${tipY - 8} l 6 6 l -12 0 Z`
                : `M ${tipX + 6} ${tipY - 8} l -6 6 l 12 0 Z`
            }
            fill="white"
            stroke="#CBD5E1"
          />
          {/* bubble */}
          <rect
            x={bubbleX}
            y={bubbleY}
            width={tipWidth}
            height={tipHeight}
            rx={6}
            fill="white"
            stroke="#CBD5E1"
          />
          <text
            x={bubbleX + tipWidth / 2}
            y={bubbleY + tipHeight / 2 + 4}
            textAnchor="middle"
            fontSize={11}
            fill="#111827"
          >
            ₱{" "}
            {hovered.y.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            •{" "}
            {new Date(hovered.x).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </text>
        </g>
      )}

      {/* End date labels */}
      <text
        x={padL + 4}
        y={height - padB + 18}
        textAnchor="start"
        fontSize={11}
        fill={label}
      >
        {leftLabel}
      </text>
      <text
        x={width - padR - 4}
        y={height - padB + 18}
        textAnchor="end"
        fontSize={11}
        fill={label}
      >
        {rightLabel}
      </text>

      {/* Legend */}
      <g transform={`translate(${(padL + width - padR) / 2}, ${height - 10})`}>
        <circle r={5} fill="white" stroke={line} strokeWidth={2} />
        <text x={10} y={4} fontSize={12} fill={label} textAnchor="start">
          Salary
        </text>
      </g>
    </svg>
  );
}
