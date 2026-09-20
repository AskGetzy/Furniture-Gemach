interface SofaMarkProps {
  size?: number
  strokeWidth?: number
  color?: string
  className?: string
}

export default function SofaMark({
  size = 44,
  strokeWidth = 6,
  color = '#1F5D40',
  className,
}: SofaMarkProps) {
  return (
    <svg
      width={size}
      height={(size * 54) / 88}
      viewBox="0 0 88 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left armrest */}
      <rect x="3" y="16" width="13" height="26" rx="4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* Right armrest */}
      <rect x="72" y="16" width="13" height="26" rx="4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* Back cushion (low) */}
      <rect x="16" y="10" width="56" height="18" rx="4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* Seat */}
      <rect x="16" y="28" width="56" height="14" rx="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* Three-seat dividers */}
      <line x1="35" y1="28" x2="35" y2="42" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="53" y1="28" x2="53" y2="42" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Legs */}
      <line x1="22" y1="42" x2="22" y2="51" stroke={color} strokeWidth={strokeWidth - 1} strokeLinecap="round" />
      <line x1="66" y1="42" x2="66" y2="51" stroke={color} strokeWidth={strokeWidth - 1} strokeLinecap="round" />
    </svg>
  )
}
