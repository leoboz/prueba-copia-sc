
import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { useMenuPermissions } from '@/hooks/useMenuPermissions';
import { getIconComponent } from '@/utils/iconMapping';
import CompanySwitcher from '@/components/CompanySwitcher';
import { 
  Menu,
  LogOut,
  User,
  Sprout,
  Home,
  Package,
  TestTube,
  Settings,
  Shield
} from 'lucide-react';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated, isLoading, activeCompany, isSystemAdmin } = useAuth();
  const { userMenuItems, isLoadingMenuItems } = useMenuPermissions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy-600 mx-auto"></div>
          <p className="mt-4 text-navy-700">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Fallback navigation items in case menu permissions fail to load
  const fallbackNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Variedades', href: '/varieties', icon: Package },
    { name: 'Lotes', href: '/lots', icon: Package },
    { name: 'Muestras', href: '/samples', icon: TestTube },
    { name: 'Administración', href: '/admin/users', icon: Settings },
  ];

  // Convert database menu items to navigation format, with fallback
  const navigation = userMenuItems?.length ? userMenuItems.map(permission => ({
    name: permission.menu_item.name,
    href: permission.menu_item.href,
    icon: getIconComponent(permission.menu_item.icon_name),
  })) : fallbackNavigation;

  const NavigationContent = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`${mobile ? 'space-y-1' : 'space-y-2'}`}>
      {isLoadingMenuItems ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy-600"></div>
          <span className="ml-2 text-navy-600">Cargando menú...</span>
        </div>
      ) : (
        navigation.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => mobile && setIsMobileMenuOpen(false)}
              className={`
                group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-navy-900 text-white'
                  : 'text-navy-700 hover:bg-navy-100 hover:text-navy-900'
                }
              `}
            >
              <item.icon className={`mr-3 h-5 w-5 flex-shrink-0`} />
              {item.name}
            </Link>
          );
        })
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-xl border-r border-navy-200/40">
          <div className="flex h-16 shrink-0 items-center border-b border-navy-100">
            <Link to="/dashboard" className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-navy-900 to-navy-800 rounded-lg shadow-lg mr-3">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-serif font-bold bg-gradient-to-r from-navy-900 to-navy-700 bg-clip-text text-transparent">
                GDM Seeds
              </span>
            </Link>
          </div>

          {/* Company Switcher */}
          <div className="border-b border-navy-100 pb-4">
            <CompanySwitcher />
          </div>

          <NavigationContent />
          
          <div className="mt-auto">
            <div className="flex items-center gap-x-4 px-3 py-3 text-sm font-medium text-navy-700 border-t border-navy-100">
              <div className="p-2 bg-navy-100 rounded-full">
                {isSystemAdmin ? (
                  <Shield className="h-4 w-4 text-navy-600" />
                ) : (
                  <User className="h-4 w-4 text-navy-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-navy-800">{user?.name || 'Usuario'}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-navy-500">{activeCompany?.name}</p>
                  {isSystemAdmin && (
                    <span className="text-xs bg-navy-600 text-white px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-8 w-8 p-0 hover:bg-navy-100"
              >
                <LogOut className="h-4 w-4 text-navy-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-navy-200/40 bg-white/90 backdrop-blur-sm px-4 shadow-sm lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="h-6 w-6 text-navy-700" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-white">
            <div className="flex h-16 shrink-0 items-center border-b border-navy-100 mb-5">
              <Link to="/dashboard" className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-navy-900 to-navy-800 rounded-lg shadow-lg mr-3">
                  <Sprout className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-serif font-bold bg-gradient-to-r from-navy-900 to-navy-700 bg-clip-text text-transparent">
                  GDM Seeds
                </span>
              </Link>
            </div>

            {/* Mobile Company Switcher */}
            <div className="border-b border-navy-100 pb-4 mb-4">
              <CompanySwitcher />
            </div>

            <NavigationContent mobile />
            
            <div className="mt-auto pt-5">
              <div className="flex items-center gap-x-4 px-3 py-3 text-sm font-medium text-navy-700 border-t border-navy-100">
                <div className="p-2 bg-navy-100 rounded-full">
                  {isSystemAdmin ? (
                    <Shield className="h-4 w-4 text-navy-600" />
                  ) : (
                    <User className="h-4 w-4 text-navy-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-navy-800">{user?.name || 'Usuario'}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-navy-500">{activeCompany?.name}</p>
                    {isSystemAdmin && (
                      <span className="text-xs bg-navy-600 text-white px-1.5 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="h-8 w-8 p-0 hover:bg-navy-100"
                >
                  <LogOut className="h-4 w-4 text-navy-600" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 text-sm font-semibold leading-6">
          <Link to="/dashboard" className="flex items-center">
            <div className="p-1 bg-gradient-to-br from-navy-900 to-navy-800 rounded-md shadow mr-2">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif font-bold bg-gradient-to-r from-navy-900 to-navy-700 bg-clip-text text-transparent">
              GDM Seeds
            </span>
          </Link>
        </div>

        {/* Mobile Company Context Display */}
        <div className="text-xs text-navy-600">
          {activeCompany?.code}
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
