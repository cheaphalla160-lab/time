import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Volume2, RotateCcw, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface InteractiveClockProps {
  hour: number;
  minute: number;
  onChangeTime?: (hour: number, minute: number) => void;
  interactive?: boolean;
  showHelpers?: boolean;
  size?: number; // default 320
  hideHands?: boolean; // for quizzes
}

export const InteractiveClock: React.FC<InteractiveClockProps> = ({
  hour,
  minute,
  onChangeTime,
  interactive = true,
  showHelpers = true,
  size = 320,
  hideHands = false,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDraggingMinute, setIsDraggingMinute] = useState(false);
  const [isDraggingHour, setIsDraggingHour] = useState(false);

  // Angles in degrees
  const minuteAngle = (minute % 60) * 6; // 360 / 60 = 6 deg/min
  const hourAngle = ((hour % 12) + minute / 60) * 30; // 360 / 12 = 30 deg/hour

  const center = 160;
  const radius = 138;

  // Calculate angle from mouse/touch event relative to clock center
  const getAngleFromEvent = useCallback((e: MouseEvent | TouchEvent) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - (rect.left + rect.width / 2);
    const y = clientY - (rect.top + rect.height / 2);

    // Math.atan2 gives radians from positive X axis clockwise/counterclockwise
    // In our clock, 12 o'clock is -Y axis (angle 0)
    let degrees = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, []);

  const handlePointerDown = (type: 'minute' | 'hour', e: React.MouseEvent | React.TouchEvent) => {
    if (!interactive || !onChangeTime) return;
    e.preventDefault();
    if (type === 'minute') {
      setIsDraggingMinute(true);
    } else {
      setIsDraggingHour(true);
    }
    soundEngine.playTick();
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive || !onChangeTime) return;
      if (!isDraggingMinute && !isDraggingHour) return;

      const deg = getAngleFromEvent(e);

      if (isDraggingMinute) {
        // 6 degrees per minute
        const newMinute = Math.round(deg / 6) % 60;
        if (newMinute !== minute) {
          // If minute wraps from 59 to 0 clockwise
          let newHour = hour;
          if (minute >= 50 && newMinute <= 10) {
            newHour = hour === 12 ? 1 : hour + 1;
          } else if (minute <= 10 && newMinute >= 50) {
            newHour = hour === 1 ? 12 : hour - 1;
          }
          onChangeTime(newHour, newMinute);
          soundEngine.playTick();
        }
      } else if (isDraggingHour) {
        // 30 degrees per hour
        let newHour = Math.floor(deg / 30);
        if (newHour === 0) newHour = 12;
        if (newHour !== hour) {
          onChangeTime(newHour, minute);
          soundEngine.playTick();
        }
      }
    };

    const handleUp = () => {
      setIsDraggingMinute(false);
      setIsDraggingHour(false);
    };

    if (isDraggingMinute || isDraggingHour) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDraggingMinute, isDraggingHour, hour, minute, interactive, onChangeTime, getAngleFromEvent]);

  // Click anywhere on clock to quickly set minute
  const handleClockClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || !onChangeTime || isDraggingMinute || isDraggingHour) return;
    const deg = getAngleFromEvent(e.nativeEvent);
    // Snap to nearest 5 minutes on direct click for easy mobile/desktop tapping
    const rawMin = Math.round(deg / 6) % 60;
    const snappedMin = Math.round(rawMin / 5) * 5 % 60;
    onChangeTime(hour, snappedMin);
    soundEngine.playTick();
  };

  // Generate ticks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const isMajor = i % 5 === 0;
    const angle = i * 6 * (Math.PI / 180);
    const rOuter = radius - 8;
    const rInner = isMajor ? radius - 20 : radius - 14;

    const x1 = center + rOuter * Math.sin(angle);
    const y1 = center - rOuter * Math.cos(angle);
    const x2 = center + rInner * Math.sin(angle);
    const y2 = center - rInner * Math.cos(angle);

    return { i, isMajor, x1, y1, x2, y2 };
  });

  // Numerals 1 to 12
  const numerals = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const angle = num * 30 * (Math.PI / 180);
    const r = radius - 36;
    const x = center + r * Math.sin(angle);
    const y = center - r * Math.cos(angle) + 6; // +6 for vertical center alignment
    return { num, x, y };
  });

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      <svg
        ref={svgRef}
        viewBox="0 0 320 320"
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`touch-none drop-shadow-md transition-transform ${
          interactive ? 'cursor-pointer' : ''
        }`}
        onClick={handleClockClick}
      >
        <defs>
          <radialGradient id="clockFaceGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="90%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </radialGradient>
          <filter id="handShadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Ring & Dial Base */}
        <circle
          cx={center}
          cy={center}
          r={radius + 8}
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="3"
        />
        <circle
          cx={center}
          cy={center}
          r={radius + 5}
          fill="#334155"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#clockFaceGrad)"
        />

        {/* Educational Zone Coloring (PAST vs TO sectors) */}
        {showHelpers && (
          <g opacity="0.16">
            {/* PAST Zone (Right semicircle: 12 to 6 o'clock) */}
            <path
              d={`M ${center} ${center - radius + 10} A ${radius - 10} ${radius - 10} 0 0 1 ${center} ${center + radius - 10} Z`}
              fill="#10b981"
            />
            {/* TO Zone (Left semicircle: 6 to 12 o'clock) */}
            <path
              d={`M ${center} ${center + radius - 10} A ${radius - 10} ${radius - 10} 0 0 1 ${center} ${center - radius + 10} Z`}
              fill="#f97316"
            />
          </g>
        )}

        {/* Educational Zone Labels on Dial */}
        {showHelpers && (
          <g className="text-[10px] font-bold tracking-wider" opacity="0.75">
            <text x={center + 58} y={center - 70} fill="#059669" textAnchor="middle">
              PAST (过)
            </text>
            <text x={center - 58} y={center - 70} fill="#ea580c" textAnchor="middle">
              TO (差)
            </text>
          </g>
        )}

        {/* 60 Minute & 12 Hour Ticks */}
        {ticks.map((t) => (
          <line
            key={t.i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.isMajor ? '#334155' : '#94a3b8'}
            strokeWidth={t.isMajor ? '2.5' : '1.2'}
            strokeLinecap="round"
          />
        ))}

        {/* 12 Hour Numerals */}
        {numerals.map((n) => (
          <text
            key={n.num}
            x={n.x}
            y={n.y}
            textAnchor="middle"
            fill="#1e293b"
            className="text-[17px] font-bold font-sans"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {n.num}
          </text>
        ))}

        {/* Pedagogical Corner Badges: 12=o'clock, 3=quarter past, 6=half past, 9=quarter to */}
        {showHelpers && (
          <g className="text-[9px] font-semibold">
            {/* 12: o'clock */}
            <rect
              x={center - 26}
              y={center - radius + 22}
              width="52"
              height="15"
              rx="4"
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
            <text
              x={center}
              y={center - radius + 33}
              textAnchor="middle"
              fill="#475569"
              className="font-mono text-[9px] font-bold"
            >
              o'clock
            </text>

            {/* 3: quarter past */}
            <rect
              x={center + radius - 70}
              y={center - 8}
              width="60"
              height="16"
              rx="4"
              fill="#ecfdf5"
              stroke="#a7f3d0"
              strokeWidth="0.8"
            />
            <text
              x={center + radius - 40}
              y={center + 3}
              textAnchor="middle"
              fill="#065f46"
              className="text-[8px] font-bold"
            >
              quarter past
            </text>

            {/* 6: half past */}
            <rect
              x={center - 28}
              y={center + radius - 35}
              width="56"
              height="15"
              rx="4"
              fill="#f0fdf4"
              stroke="#bbf7d0"
              strokeWidth="0.8"
            />
            <text
              x={center}
              y={center + radius - 24}
              textAnchor="middle"
              fill="#166534"
              className="font-mono text-[9px] font-bold"
            >
              half past
            </text>

            {/* 9: quarter to */}
            <rect
              x={center - radius + 10}
              y={center - 8}
              width="58"
              height="16"
              rx="4"
              fill="#fff7ed"
              stroke="#fed7aa"
              strokeWidth="0.8"
            />
            <text
              x={center - radius + 39}
              y={center + 3}
              textAnchor="middle"
              fill="#9a3412"
              className="text-[8px] font-bold"
            >
              quarter to
            </text>
          </g>
        )}

        {/* Hands */}
        {!hideHands && (
          <g filter="url(#handShadow)">
            {/* Hour Hand (Blue / Shorter & Sturdier) */}
            <g
              transform={`rotate(${hourAngle} ${center} ${center})`}
              className={interactive ? 'cursor-grab active:cursor-grabbing' : ''}
              onMouseDown={(e) => handlePointerDown('hour', e)}
              onTouchStart={(e) => handlePointerDown('hour', e)}
            >
              {/* Invisible wider hit area for easy touch dragging */}
              <line
                x1={center}
                y1={center + 15}
                x2={center}
                y2={center - 68}
                stroke="transparent"
                strokeWidth="24"
              />
              <line
                x1={center}
                y1={center + 12}
                x2={center}
                y2={center - 65}
                stroke="#2563eb"
                strokeWidth="6.5"
                strokeLinecap="round"
              />
              {/* Arrow point */}
              <polygon
                points={`${center - 4},${center - 62} ${center + 4},${center - 62} ${center},${center - 74}`}
                fill="#1d4ed8"
              />
            </g>

            {/* Minute Hand (Emerald Green / Longer & Sleek) */}
            <g
              transform={`rotate(${minuteAngle} ${center} ${center})`}
              className={interactive ? 'cursor-grab active:cursor-grabbing' : ''}
              onMouseDown={(e) => handlePointerDown('minute', e)}
              onTouchStart={(e) => handlePointerDown('minute', e)}
            >
              {/* Invisible wider hit area */}
              <line
                x1={center}
                y1={center + 20}
                x2={center}
                y2={center - 100}
                stroke="transparent"
                strokeWidth="26"
              />
              <line
                x1={center}
                y1={center + 18}
                x2={center}
                y2={center - 95}
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Sleek tip */}
              <polygon
                points={`${center - 3.5},${center - 92} ${center + 3.5},${center - 92} ${center},${center - 106}`}
                fill="#059669"
              />
            </g>

            {/* Center Pivot Pin */}
            <circle cx={center} cy={center} r="7" fill="#0f172a" />
            <circle cx={center} cy={center} r="3" fill="#ffffff" />
          </g>
        )}
      </svg>

      {/* Legend below clock in interactive mode */}
      {interactive && (
        <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span>时针 Hour</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>分针 Minute</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400">可拖拽针或点击表盘拨针</span>
        </div>
      )}
    </div>
  );
};
