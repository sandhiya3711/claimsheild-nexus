import React, { useState } from 'react';
import { TrendingUp, Activity, AlertTriangle, CheckCircle2, Info, Lightbulb, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function ComparativeLineGraph({
  title = "Monthly Billing & Upcoding Trajectory (12-Month Timeline)",
  subtitle = "Comparative line chart plotting Target Provider against Specialty Peer Baseline",
  targetName = "Dr. Arthur Vance (Target P101)",
  peerName = "Specialty Peer Twin Baseline (k=12)",
  metricType = "upcoding", // "upcoding" | "dollars" | "volume"
  showChangePoint = true,
  changePointMonth = "Feb",
  changePointLabel = "PELT Step-Change Jump (+4.82 z-score)"
}) {
  const [activeMetric, setActiveMetric] = useState(metricType);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [isExplainOpen, setIsExplainOpen] = useState(true);

  // Data sets for the 3 metrics across 12 months (Oct to Sep)
  const dataSets = {
    upcoding: {
      unit: '%',
      yMin: 0,
      yMax: 100,
      yTicks: [0, 20, 40, 60, 80, 100],
      series1: [12, 11, 14, 15, 92, 94, 91, 93, 89, 92, 95, 92], // Target provider
      series2: [18, 17, 19, 18, 18, 19, 17, 18, 19, 18, 17, 18], // Peer baseline
      s1Color: '#f97316', // Bright Orange
      s2Color: '#10b981', // Emerald Green
      s1Label: 'Target Provider Level-5 Share (%)',
      s2Label: 'Specialty Peer Twin Baseline (%)',
    },
    dollars: {
      unit: '$k',
      yMin: 0,
      yMax: 250,
      yTicks: [0, 50, 100, 150, 200, 250],
      series1: [24, 22, 28, 30, 182, 195, 210, 205, 198, 215, 220, 210], // in thousands
      series2: [35, 36, 38, 37, 39, 40, 38, 39, 41, 40, 39, 40],
      s1Color: '#f43f5e', // Rose
      s2Color: '#8458B3', // Dumma Slate Violet
      s1Label: 'Target Provider Billed Dollars ($k)',
      s2Label: 'Peer Twin Expected Paid ($k)',
    },
    volume: {
      unit: ' claims',
      yMin: 0,
      yMax: 1000,
      yTicks: [0, 200, 400, 600, 800, 1000],
      series1: [110, 105, 120, 130, 680, 720, 750, 710, 690, 740, 780, 760],
      series2: [140, 145, 150, 148, 155, 160, 152, 158, 162, 160, 155, 158],
      s1Color: '#ea580c', // Orange-Red
      s2Color: '#0284c7', // Sky Blue
      s1Label: 'Target Provider Monthly Encounters',
      s2Label: 'Peer Twin Panel Volume',
    }
  };

  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const current = dataSets[activeMetric];

  // SVG Geometry - Light & Spacious
  const width = 640;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (index) => paddingLeft + (index / (months.length - 1)) * chartWidth;
  const getY = (value) => paddingTop + chartHeight - ((value - current.yMin) / (current.yMax - current.yMin)) * chartHeight;

  // Generate Smooth SVG Path
  const generatePath = (data) => {
    return data.reduce((acc, val, i) => {
      const x = getX(i);
      const y = getY(val);
      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  const path1 = generatePath(current.series1);
  const path2 = generatePath(current.series2);

  const changePointIndex = months.indexOf(changePointMonth);
  const changePointX = changePointIndex >= 0 ? getX(changePointIndex) : null;

  return (
    <div className="app-card p-6 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f1f5f9] dark:border-slate-800">
        <div>
          <h3 className="text-sm font-black text-[#0f172a] dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#6366f1]" /> {title}
          </h3>
          <p className="text-[11px] text-[#64748b] dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* 3 Metric Pills */}
        <div className="flex items-center gap-1.5 bg-[#f8fafc] dark:bg-slate-800 p-1 rounded-xl border border-[#e2e8f0] dark:border-slate-700">
          <button
            onClick={() => setActiveMetric('upcoding')}
            className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              activeMetric === 'upcoding'
                ? 'bg-[#6366f1] text-white shadow-sm'
                : 'text-[#64748b] dark:text-slate-300 hover:text-[#0f172a]'
            }`}
          >
            High-Cost Visit %
          </button>
          <button
            onClick={() => setActiveMetric('dollars')}
            className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              activeMetric === 'dollars'
                ? 'bg-[#6366f1] text-white shadow-sm'
                : 'text-[#64748b] dark:text-slate-300 hover:text-[#0f172a]'
            }`}
          >
            Dollars Billed ($)
          </button>
          <button
            onClick={() => setActiveMetric('volume')}
            className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              activeMetric === 'volume'
                ? 'bg-[#6366f1] text-white shadow-sm'
                : 'text-[#64748b] dark:text-slate-300 hover:text-[#0f172a]'
            }`}
          >
            Number of Claims
          </button>
        </div>
      </div>

      {/* Top Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 rounded-full" style={{ backgroundColor: current.s1Color }} />
            <span className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: current.s1Color }} />
            <span className="font-bold text-[#0f172a] dark:text-white text-[11px]">{targetName}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 rounded-full" style={{ backgroundColor: current.s2Color }} />
            <span className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: current.s2Color }} />
            <span className="font-semibold text-[#64748b] dark:text-slate-300 text-[11px]">{peerName}</span>
          </div>
        </div>

        {showChangePoint && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800/40 font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Sudden Spike Detected in {changePointMonth}</span>
          </div>
        )}
      </div>

      {/* Light & Clean Line Graph SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-[#fafafa] dark:bg-slate-950/40 rounded-xl p-3 border border-[#f1f5f9] dark:border-slate-800/80">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[540px] select-none">
          <defs>
            <linearGradient id="lightTargetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={current.s1Color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={current.s1Color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* 1. Soft Horizontal Grid Lines */}
          {current.yTicks.map((tick, i) => {
            const y = getY(tick);
            return (
              <g key={`y-grid-${i}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={tick === 0 ? 'none' : '2,2'}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-mono font-semibold"
                >
                  {tick}{current.unit === '%' ? '%' : current.unit === '$k' ? 'k' : ''}
                </text>
              </g>
            );
          })}

          {/* 2. Soft Vertical Grid Lines & X-Axis Month Labels */}
          {months.map((month, i) => {
            const x = getX(i);
            return (
              <g key={`x-grid-${i}`}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={height - paddingBottom}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - paddingBottom + 16}
                  textAnchor="middle"
                  className={`text-[10px] font-mono font-bold ${
                    month === changePointMonth ? 'fill-rose-600 font-black' : 'fill-slate-500 dark:fill-slate-400'
                  }`}
                >
                  {month}
                </text>
              </g>
            );
          })}

          {/* 3. PELT Discontinuity Dashed Line */}
          {showChangePoint && changePointX && (
            <g>
              <line
                x1={changePointX}
                y1={paddingTop}
                x2={changePointX}
                y2={height - paddingBottom}
                stroke="#e11d48"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
              <rect
                x={changePointX - 32}
                y={paddingTop - 14}
                width="64"
                height="14"
                rx="3"
                fill="#e11d48"
              />
              <text
                x={changePointX}
                y={paddingTop - 4}
                textAnchor="middle"
                className="fill-white text-[8.5px] font-black font-mono tracking-wider"
              >
                STEP JUMP
              </text>
            </g>
          )}

          {/* 4. Area Gradient Under Target Curve */}
          <path
            d={`${path1} L ${getX(months.length - 1)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`}
            fill="url(#lightTargetGrad)"
          />

          {/* 5. Peer Baseline Line (Series 2) */}
          <path
            d={path2}
            fill="none"
            stroke={current.s2Color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 6. Target Provider Line (Series 1) */}
          <path
            d={path1}
            fill="none"
            stroke={current.s1Color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 7. Peer Data Points */}
          {current.series2.map((val, i) => (
            <circle
              key={`p-dot-${i}`}
              cx={getX(i)}
              cy={getY(val)}
              r={hoveredPoint === i ? 5 : 3.5}
              fill={current.s2Color}
              stroke="#ffffff"
              strokeWidth="1.5"
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* 8. Target Data Points */}
          {current.series1.map((val, i) => (
            <circle
              key={`t-dot-${i}`}
              cx={getX(i)}
              cy={getY(val)}
              r={hoveredPoint === i ? 6.5 : 4.5}
              fill={current.s1Color}
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all duration-150 cursor-pointer shadow-sm"
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {/* Hover Details Popover */}
        {hoveredPoint !== null && (
          <div className="absolute top-3 right-3 p-3 bg-slate-900/95 text-white rounded-xl shadow-lg border border-slate-700 text-xs font-mono space-y-1 pointer-events-none animate-fadeIn z-10">
            <div className="font-bold text-indigo-300 text-[11px] pb-1 border-b border-slate-700">
              Month: {months[hoveredPoint]} 2026
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-orange-400 font-bold">• Target Provider:</span>
              <span className="font-black text-white">{current.series1[hoveredPoint]}{current.unit}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-emerald-400 font-bold">• Peer Baseline:</span>
              <span className="font-black text-white">{current.series2[hoveredPoint]}{current.unit}</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800 text-[10px] text-rose-400 font-bold">
              <span>Overpayment Discrepancy:</span>
              <span>+{current.series1[hoveredPoint] - current.series2[hoveredPoint]}{current.unit}</span>
            </div>
          </div>
        )}
      </div>

      {/* PLAIN-ENGLISH INTERPRETATION ACCORDION: WHAT THIS GRAPH TELLS US */}
      <div className="border border-[#e2e8f0] dark:border-slate-800 rounded-xl overflow-hidden">
        <button
          onClick={() => setIsExplainOpen(!isExplainOpen)}
          className="w-full p-3.5 text-left flex items-center justify-between bg-[#f8fafc] dark:bg-slate-800/50 hover:bg-[#f1f5f9] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black text-[#0f172a] dark:text-white">
              What Does This Line Graph Tell Us? (Simple Explanation)
            </span>
          </div>
          {isExplainOpen ? (
            <ChevronUp className="w-4 h-4 text-[#6366f1]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#64748b]" />
          )}
        </button>

        {isExplainOpen && (
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-[#f1f5f9] dark:border-slate-800 space-y-3 text-xs leading-relaxed animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Point 1 */}
              <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-1">
                <span className="font-mono font-bold text-emerald-600 block text-[11px]">
                  1. Normal History (Oct – Jan)
                </span>
                <p className="text-[#475569] dark:text-slate-300 text-[11px]">
                  During Months 1–4, the provider billed <strong>12%–15% Level-5 codes</strong>, matching the normal specialty peer baseline (18%). This proves the clinic operated normally in the past.
                </p>
              </div>

              {/* Point 2 */}
              <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 space-y-1">
                <span className="font-mono font-bold text-rose-600 block text-[11px]">
                  2. The Sudden Jump (Feb - Month 5)
                </span>
                <p className="text-[#475569] dark:text-slate-300 text-[11px]">
                  In February, the provider's billing abruptly jumped from <strong>15% to 92%</strong> (PELT z-score: +4.82). This vertical step-change proves an artificial billing shift rather than organic growth.
                </p>
              </div>

              {/* Point 3 */}
              <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 space-y-1">
                <span className="font-mono font-bold text-[#6366f1] block text-[11px]">
                  3. The +74% Overpayment Gap
                </span>
                <p className="text-[#475569] dark:text-slate-300 text-[11px]">
                  The gap between the orange line (92%) and the green peer baseline (18%) represents <strong>+$115.00 overpayment per visit</strong> ($159,000+ total exposure target for recovery).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
