type BadgeVariant = "gold" | "blue" | "green" | "red" | "purple" | "gray";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const styles: Record<BadgeVariant, string> = {
  gold: "bg-gold-500/20 text-gold-400 border-gold-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  green: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  red: "bg-red-500/20 text-red-400 border-red-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  gray: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function Badge({ label, variant = "gray" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}
    >
      {label}
    </span>
  );
}
