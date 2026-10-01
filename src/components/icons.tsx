import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

export function Leaf(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20c0-8 4-14 16-16-1 12-6 16-14 16" />
      <path d="M4 20c3-5 7-8 11-10" />
    </svg>
  );
}

export function Feather(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 4c-6 0-11 4-13 10l-3 6" />
      <path d="M20 4c0 6-4 11-10 13H7" />
      <path d="M8 14h6" />
    </svg>
  );
}

export function Ruler(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m3 17 14-14 4 4L7 21z" />
      <path d="m8 8 2 2" />
      <path d="m11 5 2 2" />
      <path d="m14 2 2 2" />
    </svg>
  );
}

export function Factory(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 21V9l6 4V9l6 4V5h4v16z" />
      <path d="M9 17h2" />
      <path d="M13 17h2" />
    </svg>
  );
}

export function Smartphone(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}

export function BookOpen(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 6c-2-1.5-5-2-9-2v14c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2z" />
      <path d="M12 6v14" />
    </svg>
  );
}

export function MapPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function Users(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
      <path d="M17.5 14a6.5 6.5 0 0 1 4 6" />
    </svg>
  );
}

export function Sparkle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="m12 7 2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Shield(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function Instagram(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsApp(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" aria-hidden {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3z" />
    </svg>
  );
}

/* Ícones das condições comerciais (barra de benefícios) e do formulário. */

export function Truck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 6.5h11v9h-11z" />
      <path d="M13.5 9.5h4l3 3v3h-7" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
    </svg>
  );
}

export function Tag(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12.2V4h8.2l9.3 9.3-8.2 8.2z" />
      <circle cx="7.5" cy="8.5" r="1.3" />
    </svg>
  );
}

export function Percent(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m19 5-14 14" />
      <circle cx="7" cy="7" r="2.3" />
      <circle cx="17" cy="17" r="2.3" />
    </svg>
  );
}

export function Clock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function Lock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export function Box(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
      <path d="M3.5 7.5 12 12l8.5-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

export function Refresh(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 11a8 8 0 0 0-14.5-4.5L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14.5 4.5L20 16" />
      <path d="M20 20v-4h-4" />
    </svg>
  );
}

export function Play(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Pause(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7.5 5.5h3v13h-3zM13.5 5.5h3v13h-3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function ChevronLeft(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}
