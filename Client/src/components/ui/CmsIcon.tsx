import {
  ArrowRight,
  BarChart3,
  Bell,
  Briefcase,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ChartColumnIncreasing,
  Check,
  Cloud,
  Cpu,
  CreditCard,
  Gift,
  Globe,
  Headset,
  HelpCircle,
  LayoutGrid,
  Megaphone,
  Network,
  Play,
  Puzzle,
  RefreshCw,
  Rocket,
  Scissors,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  UserRoundCog,
  Users,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons an admin can pick from. The values are what gets stored in the
 * database, so renaming one would orphan existing content.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  ArrowRight,
  BarChart3,
  Bell,
  Briefcase,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ChartColumnIncreasing,
  Check,
  Cloud,
  Cpu,
  CreditCard,
  Gift,
  Globe,
  Headset,
  HelpCircle,
  LayoutGrid,
  Megaphone,
  Network,
  Play,
  Puzzle,
  RefreshCw,
  Rocket,
  Scissors,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  UserRoundCog,
  Users,
  UsersRound,
  Zap,
};

const FALLBACK_ICON: LucideIcon = Sparkles;

export function getIcon(name: string | undefined | null): LucideIcon {
  if (!name) return FALLBACK_ICON;
  return ICON_MAP[name] ?? FALLBACK_ICON;
}

type Props = {
  name: string | undefined | null;
  className?: string;
  strokeWidth?: number;
};

export default function CmsIcon({ name, className, strokeWidth = 1.8 }: Props) {
  const Icon = getIcon(name);
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}
