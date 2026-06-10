import {
  Search,
  Menu,
  User,
  Heart,
  Star,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Image,
  Plus,
  Minus,
  MapPin,
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  TrendingUp,
  Shield,
  Briefcase,
  MessageCircle,
  Clock,
  Edit3,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

const ICONS: Record<string, LucideIcon> = {
  search: Search,
  menu: Menu,
  user: User,
  heart: Heart,
  star: Star,
  x: X,
  check: Check,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  'arrow-left': ArrowLeft,
  image: Image,
  plus: Plus,
  minus: Minus,
  'map-pin': MapPin,
  'layout-dashboard': LayoutDashboard,
  users: Users,
  'building-2': Building2,
  'calendar-check': CalendarCheck,
  'trending-up': TrendingUp,
  shield: Shield,
  briefcase: Briefcase,
  'message-circle': MessageCircle,
  clock: Clock,
  'edit-3': Edit3,
  sparkles: Sparkles,
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}

export function Icon({ name, size = 20, color, fill, strokeWidth = 2, style }: IconProps) {
  const Comp = ICONS[name];
  if (!Comp) return null;
  return (
    <Comp
      size={size}
      color={color ?? 'currentColor'}
      fill={fill ?? 'none'}
      strokeWidth={strokeWidth}
      style={style}
    />
  );
}
