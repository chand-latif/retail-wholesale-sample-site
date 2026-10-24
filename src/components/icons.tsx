type IconProps = { size?: number; className?: string };
const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const Icon = {
  Bag: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
  ),
  Search: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
  ),
  User: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" /></svg>
  ),
  Heart: ({ size, className, filled }: IconProps & { filled?: boolean }) => (
    <svg {...base(size)} className={className} fill={filled ? "currentColor" : "none"}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>
  ),
  Menu: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="M4 7h16M4 12h16M4 17h10" /></svg>
  ),
  Close: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
  ),
  Arrow: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
  Chevron: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="m6 9 6 6 6-6" /></svg>
  ),
  Plus: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="M12 5v14M5 12h14" /></svg>
  ),
  Minus: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="M5 12h14" /></svg>
  ),
  Check: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="m5 12.5 4.5 4.5L19 7" /></svg>
  ),
  Star: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className} fill="currentColor" stroke="none"><path d="m12 3 2.7 5.8 6.3.8-4.6 4.3 1.2 6.3L12 17.1 6.4 20.2l1.2-6.3L3 9.6l6.3-.8L12 3Z" /></svg>
  ),
  Truck: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="M2 6h11v10H2zM13 10h4l3 3v3h-7" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="16.5" cy="17.5" r="1.8" /></svg>
  ),
  Globe: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>
  ),
  Leaf: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15" /><path d="M5 19c3-5 6-8 10-10" /></svg>
  ),
  Shield: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="M12 3 4.5 6v6c0 4.5 3 7.5 7.5 9 4.5-1.5 7.5-4.5 7.5-9V6L12 3Z" /><path d="m9 12 2.2 2.2L15.5 10" /></svg>
  ),
  Layers: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></svg>
  ),
  Box: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" /><path d="m3 7.5 9 4.5 9-4.5M12 12v9" /></svg>
  ),
  Mail: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
  ),
  Pin: ({ size, className }: IconProps) => (
    <svg {...base(size)} className={className}><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.800 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
  ),
};
