import { 
  Home, 
  TestTube, 
  Package, 
  Microscope, 
  FlaskConical, 
  Shield, 
  Settings,
  Users,
  Menu,
  LogOut,
  User,
  Sprout,
  Factory,
  LucideIcon
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  Home,
  TestTube,
  Package,
  Microscope,
  FlaskConical,
  Shield,
  Settings,
  Users,
  Menu,
  LogOut,
  User,
  Sprout,
  Factory,
};

export const getIconComponent = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Home; // Default to Home icon if not found
};

export const getAvailableIcons = (): { name: string; component: LucideIcon }[] => {
  return Object.entries(iconMap).map(([name, component]) => ({
    name,
    component,
  }));
};
