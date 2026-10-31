const base = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export function Spark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 2c1.2 8 4.800 11.800 13 14-8.200 2.200-11.800 6-13 14-1.200-8-4.800-11.800-13-14C11.200 13.800 14.800 10 16 2Z" fill="#DF693E" />
      <circle cx="26" cy="6" r="2.400" fill="#2B5141" />
    </svg>
  );
}
export const BookmarkIcon = ({ filled }: { filled?: boolean }) => (
  <svg {...base} fill={filled ? "currentColor" : "none"}><path d="M6 3h12v18l-6-4.500L6 21z" /></svg>
);
export const PlayIcon = () => <svg {...base}><path d="M7 4.500v15l12-7.500z" fill="currentColor" /></svg>;
export const PauseIcon = () => <svg {...base}><path d="M8 5v14M16 5v14" /></svg>;
export const StopIcon = () => <svg {...base}><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" /></svg>;
export const CheckIcon = () => <svg {...base}><path d="m5 13 4.500 4.500L19 7" /></svg>;
export const DiceIcon = () => <svg {...base}><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M9 9h.01M15 15h.01M15 9h.01M9 15h.01" strokeWidth="3" /></svg>;
