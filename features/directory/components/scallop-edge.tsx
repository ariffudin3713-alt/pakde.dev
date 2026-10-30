"use client";

import { useId } from "react";

type Side = "top" | "bottom" | "left";

interface ScallopEdgeProps {
  side?: Side;
  /** Height (or width, for the left edge) of the scallop band in pixels. */
  size?: number;
  className?: string;
}

/**
 * The one motif: the scalloped valance of a market awning.
 * A repeating half-circle cut from a flat colour, never a gradient.
 */
export function ScallopEdge({ side = "bottom", size = 16, className = "" }: ScallopEdgeProps) {
  const rawId = useId();
  const id = `scallop-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const horizontal = side !== "left";
  const tileWidth = horizontal ? size * 2 : size;
  const tileHeight = horizontal ? size : size * 2;
  const cx = horizontal ? size : size;
  const cy = side === "top" ? size : side === "bottom" ? 0 : size;

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={id} width={tileWidth} height={tileHeight} patternUnits="userSpaceOnUse">
          <circle cx={cx} cy={cy} r={size} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
