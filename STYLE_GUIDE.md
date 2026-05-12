# Dashboard Style Guide

This document outlines the stylistic choices and design patterns used across the Overview, Agent Performance Main, and Agent Conversion tabs.

---

## 1. Card Styling

### Shadow & Border
All cards use a consistent shadow pattern with no border:
```
className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0"
```

**Components:**
- `CardHeader` with `pb-2` (padding-bottom) or `pb-4` for charts
- `CardTitle` with `text-sm` (14px)
- `CardContent` with `space-y-1` or `space-y-2` (vertical spacing)

### Card Title Rules
- **No dots or emojis** - Card titles must be plain text without decorative elements
- **Plain text only** - Use descriptive names without special characters

---

## 2. Typography

### Font Sizes
- **Card Titles**: `text-sm` (14px)
- **Labels**: `text-xs` (12px) with `text-muted-foreground`
- **Values**: `text-sm font-semibold` (14px, bold)
- **Chart Axis Labels**: `fontSize: "12px"`
- **Chart Legend**: `fontSize: "12px"` with `paddingTop: "16px"`

### Font Weights
- **Labels**: Regular weight
- **Values**: `font-semibold` (600)
- **Card Titles**: Default weight

---

## 3. KPI Card Layout

### Structure
```
Label (text-xs, muted-foreground) | Value (text-sm, font-semibold)
```

### Spacing
- Between rows: `space-y-1` (4px) or `space-y-2` (8px)
- Between label and value: `justify-between items-center`

### Special Cases
- **New Users Cards**: Use `justify-between` with percentage change in green (`text-green-600`) and value aligned right
- **Progress Bars**: Use `space-y-1` with label/value above and progress bar below

---

## 4. Progress Bars

### Styling
- **Container**: `w-full bg-muted rounded-full h-2`
- **Fill**: `bg-green-500`, `bg-orange-500`, `bg-yellow-500`, or `bg-gray-400` with `h-2 rounded-full`
- **Status Colors**:
  - Online: `bg-green-500`
  - Busy: `bg-orange-500`
  - Away: `bg-yellow-500`
  - Offline: `bg-gray-400`

---

## 5. Charts

### Chart Container
- **Height**: 220px (line charts) or 300px (bar charts)
- **Responsive**: `ResponsiveContainer width="100%" height={height}`
- **Margin**: `margin={{ top: 20, right: 0, left: 0, bottom: 0 }}`

### Grid & Axes
- **CartesianGrid**: `strokeDasharray="3 3"` with `stroke="hsl(var(--border))"` or `hsl(var(--muted-foreground))"`
- **Opacity**: `opacity={0.2}` for subtle appearance
- **Axis Stroke**: `hsl(var(--muted-foreground))`
- **Axis Font Size**: `fontSize: "12px"`

### Line Charts
- **Line Stroke**: `hsl(var(--primary))` or custom colors (e.g., `#22c55e`, `#f97316`, `#ef4444`)
- **Line Width**: `strokeWidth={2}`
- **Dots**: `dot={false}` (no dots on line)
- **Cursor**: `cursor={{ strokeDasharray: '3 3' }}` (dashed line on hover)
- **Legend**: `wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}` with `iconType="circle"`
- **Height**: 300px for multi-line charts, 220px for single-line charts
- **Example**: Bot vs Human Performance chart, Sentiment Trend Analysis chart

### Bar Charts (Agent Performance)
- **Type**: Stacked bar charts
- **Stack ID**: `stackId="a"` for all bars in same chart
- **Legend Icons**: `iconType="circle"` (circular indicators)
- **Bar Colors**:
  - Red: `#f87171` (red-400)
  - Orange: `#fb923c` (orange-300)
  - Purple: `#c084fc` (purple-300)
  - Blue: `#60a5fa` (blue-300)

---

## 6. Tooltips

### Styling
```
bg-background border border-border rounded-md p-2 shadow-md
```

### Content Structure
- **Label**: `text-sm font-medium` (chart date/label)
- **Items**: Each item on new line with name and value
- **Value Color**: Matches the bar/line color

### Tooltip Behavior
- **Line Charts**: `cursor={{ strokeDasharray: '3 3' }}` (dashed cursor line)
- **Bar Charts**: `cursor={false}` (no cursor background)

### Tooltip Implementation
```typescript
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-md p-2 shadow-md">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs">{entry.name}:</span>
            <span className="text-xs font-medium" style={{ color: entry.color }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
```

### Custom Tooltip Components
- **OverviewTab**: `CustomTooltip` - Shows label and single value (Users or Stickiness)
- **AgentConversion**: `ConversionVolumeTooltip` & `CallEngagementTooltip` - Shows label and all stacked values with color coding
- **VoiceOfCustomer**: `CustomTooltip` - Shows label and all sentiment values with color coding

---

## 7. Tables

### Header Styling
- **Row**: `border-b`
- **Cell**: `text-left py-2 px-3 font-medium text-muted-foreground`
- **Font Size**: `text-xs`

### Body Styling
- **Row**: `border-b hover:bg-muted/50`
- **Cell**: `py-2 px-3`
- **Font Size**: `text-xs`

### Status Indicators
- **Dot**: `w-2 h-2 rounded-full` with status color
- **Layout**: `flex items-center gap-2`

---

## 8. Grid Layouts

### Responsive Breakpoints
- **1 Column**: Mobile (default)
- **2 Columns**: `md:grid-cols-2`
- **3 Columns**: `lg:grid-cols-3`
- **4 Columns**: `lg:grid-cols-4`
- **Gap**: `gap-4` (16px)

### Special Layouts
- **Agent Availability Board**: `grid-cols-1 lg:grid-cols-3 gap-6` (left: 1 col, right: 2 cols)
- **Call Engagement + Tags**: `grid-cols-1 lg:grid-cols-4 gap-4` (chart: 3 cols, tags: 1 col)

---

## 9. Tags/Badges

### Styling
- **Container**: `px-2 py-1 rounded text-xs font-medium`
- **Colors**: 
  - Urgent: `bg-red-100 text-red-700`
  - Follow-up: `bg-blue-100 text-blue-700`
  - Resolved: `bg-green-100 text-green-700`
  - Pending: `bg-yellow-100 text-yellow-700`

### Layout
- **Container**: `flex flex-col gap-2`
- **Format**: `{name} ({count})`

---

## 10. Search Input

### Styling
- **Container**: `relative w-48` or `w-72`
- **Icon**: `absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`
- **Input**: `pl-10 h-8 text-xs`
- **Placeholder**: "Search agents..." or "Search by agent or channel..."

---

## 11. Utility Functions

### Number Abbreviation
```typescript
const abbreviateNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};
```

### Percentage Formatting
```typescript
const formatPercentage = (num: number): string => {
  return num.toFixed(1) + "%";
};
```

---

## 12. Color Palette

### Status Colors
- **Online/Success**: `#22c55e` (green-500)
- **Busy/Warning**: `#f97316` (orange-500)
- **Away/Caution**: `#eab308` (yellow-500)
- **Offline/Inactive**: `#9ca3af` (gray-400)

### Chart Colors
- **Primary**: `hsl(var(--primary))`
- **Red**: `#f87171` (red-400)
- **Orange**: `#fb923c` (orange-300)
- **Purple**: `#c084fc` (purple-300)
- **Blue**: `#60a5fa` (blue-300)

### Text Colors
- **Foreground**: `hsl(var(--foreground))`
- **Muted Foreground**: `hsl(var(--muted-foreground))`
- **Primary**: `hsl(var(--primary))`
- **Green (Positive)**: `#16a34a` (green-600)

---

## 13. Spacing Conventions

### Vertical Spacing
- `space-y-1`: 4px (tight spacing)
- `space-y-2`: 8px (normal spacing)
- `space-y-3`: 12px (loose spacing)
- `space-y-4`: 16px (very loose spacing)

### Padding
- Card Header: `pb-2` (8px bottom)
- Card Header (large): `pb-4` (16px bottom)
- Cell/Row: `py-2 px-3` (8px vertical, 12px horizontal)

### Gap
- Between cards: `gap-4` (16px)
- Between items: `gap-2` (8px)
- Between legend items: `gap-2` (8px)

---

## 14. Key Design Principles

1. **Consistency**: All cards use the same shadow and border styling
2. **Hierarchy**: Font sizes clearly distinguish titles, labels, and values
3. **Spacing**: Consistent use of Tailwind spacing utilities
4. **Color Coding**: Status and data types use consistent colors across all tabs
5. **Responsiveness**: Grid layouts adapt from 1 to 4 columns based on screen size
6. **Accessibility**: Proper contrast with muted-foreground for secondary text
7. **Minimalism**: No borders on cards, subtle shadows for depth
8. **Interactivity**: Hover states on tables and charts for better UX

