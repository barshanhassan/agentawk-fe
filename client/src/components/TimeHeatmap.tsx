import React, { useState, useMemo } from "react";

export interface TimeHeatmapData {
  time: string;
  [day: string]: string | number;
}

export interface TimeHeatmapProps {
  data: TimeHeatmapData[];
  days?: string[];
  rowsPerTimeSlot?: number;
  cellHeight?: number;
  startDay?: number; // 0 = Sunday, 1 = Monday, etc.
  valueLabel?: string; // Label for the value (e.g., "Messages")
}

// Interpolate between two colors
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 255;
  const g1 = (c1 >> 8) & 255;
  const b1 = c1 & 255;

  const r2 = (c2 >> 16) & 255;
  const g2 = (c2 >> 8) & 255;
  const b2 = c2 & 255;

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const TimeHeatmap: React.FC<TimeHeatmapProps> = ({
  data,
  days = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"],
  rowsPerTimeSlot = 2,
  cellHeight = 3,
  startDay = 4, // Thursday by default
  valueLabel = "Value",
}) => {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    day: string;
    time: string;
    value: number;
  } | null>(null);

  // Calculate min and max values from data
  const { minValue, maxValue, getColor, legendValues } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    data.forEach((row) => {
      days.forEach((day) => {
        const value = (row as any)[day];
        if (typeof value === "number") {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      });
    });

    const lightBlue = "#dbeafe";
    const darkBlue = "#1e40af";

    const colorFn = (value: number) => {
      if (min === max) return lightBlue;
      const factor = (value - min) / (max - min);
      return interpolateColor(lightBlue, darkBlue, factor);
    };

    // Generate 8 legend values
    const legendVals = [];
    for (let i = 0; i < 8; i++) {
      legendVals.push(min + (max - min) * (i / 7));
    }

    return {
      minValue: min,
      maxValue: max,
      getColor: colorFn,
      legendValues: legendVals,
    };
  }, [data, days]);
  // Get day names starting from startDay
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const orderedDays = [];
  for (let i = 0; i < 7; i++) {
    orderedDays.push(dayNames[(startDay + i) % 7]);
  }

  // Create rows with duplicates for each time slot
  const expandedData = data.flatMap((row) =>
    Array(rowsPerTimeSlot)
      .fill(null)
      .map((_, idx) => ({
        ...row,
        _rowIndex: idx,
      }))
  );

  return (
    <div className="w-full">
      {/* Header with day names */}
      <div className="flex items-start gap-2">
        <div style={{ width: "48px" }} /> {/* Space for time labels */}
        <div className="flex gap-1 flex-1">
          {days.map((day, idx) => (
            <div
              key={day}
              className="flex-1 text-center text-xs font-medium text-muted-foreground"
              style={{ minWidth: 0 }}
            >
              {orderedDays[idx]}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto mt-2">
        <div className="space-y-0">
          {expandedData.map((row, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {/* Time label - only show on first row of each time slot */}
              <div
                className="text-xs font-medium text-muted-foreground flex-shrink-0"
                style={{ width: "48px" }}
              >
                {row._rowIndex === 0 ? row.time : ""}
              </div>

              {/* Heatmap cells */}
              <div className="flex gap-1 flex-1">
                {days.map((day, dayIdx) => (
                  <div
                    key={`${idx}-${day}`}
                    className="flex-1 rounded cursor-pointer relative"
                    style={{
                      backgroundColor: getColor((row as any)[day]),
                      height: `${cellHeight}px`,
                      minWidth: 0,
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                        day: orderedDays[dayIdx],
                        time: row.time,
                        value: Math.round((row as any)[day]),
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4">
          <div
            className="h-6 rounded"
            style={{
              background: `linear-gradient(to right, #dbeafe, #93c5fd, #60a5fa, #3b82f6, #1e40af)`,
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            {legendValues.map((value, idx) => (
              <span key={idx}>{Math.round(value)}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed bg-background border border-border rounded-md p-2 shadow-md z-50 pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 60}px`,
            transform: "translateX(-50%)",
          }}
        >
          <p className="text-sm font-medium">{tooltip.day}, {tooltip.time}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm">{valueLabel}:</span>
            <span className="text-sm font-medium text-blue-500">{tooltip.value}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeHeatmap;

