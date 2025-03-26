/**
 * Type definitions for the Dashboard
 */

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  gender?: string;
  phone?: string;
  birthday?: string;
  role?: string;
}

export interface DashboardClientProps {
  initialUser?: User | null;
}

export interface NavigationItem {
  name: string;
  icon: React.ElementType;
  id: string;
  description: string;
}

export interface TabContentProps {
  initialUser: User | null;
}

export interface SidebarContentProps {
  navigation: NavigationItem[];
  activeContent: string;
  handleTabChange: (tabId: string) => void;
  isSidebarOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  initialUser: User | null;
}
