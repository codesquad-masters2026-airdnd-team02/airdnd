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
  Plus,
  Minus,
  MapPin,
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
  plus: Plus,
  minus: Minus,
  'map-pin': MapPin,
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
