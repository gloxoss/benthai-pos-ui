import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Store, 
  ShoppingCart, 
  User, 
  Menu as MenuIcon, 
  X,
  LogOut,
  Settings,
  ChefHat,
  ClipboardList,
  BarChart3,
  Users,
  MapPin,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    cart, 
    selectedBranch, 
    logout 
  } = useStore();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const getNavItems = () => {
    const customerItems = [
      { name: 'Home', href: '/', icon: Home },
      { name: 'Menu', href: '/menu', icon: Store },
      { name: 'Branches', href: '/branches', icon: MapPin },
    ];

    const staffItems = [
      { name: 'Dashboard', href: '/staff', icon: ClipboardList },
      { name: 'Orders', href: '/staff/orders', icon: ShoppingCart },
      { name: 'Menu', href: '/menu', icon: Store },
    ];

    const kitchenItems = [
      { name: 'Kitchen', href: '/kitchen', icon: ChefHat },
      { name: 'Orders Queue', href: '/kitchen/orders', icon: ClipboardList },
    ];

    const adminItems = [
      { name: 'Dashboard', href: '/admin', icon: BarChart3 },
      { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
      { name: 'Menu Management', href: '/admin/menu', icon: Store },
      { name: 'Staff', href: '/admin/staff', icon: Users },
      { name: 'Branches', href: '/admin/branches', icon: MapPin },
      { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    ];

    if (!user) return customerItems;
    
    switch (user.role) {
      case 'staff': return staffItems;
      case 'kitchen': return kitchenItems;
      case 'admin': return adminItems;
      default: return customerItems;
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span>Benthai</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Branch info */}
            {selectedBranch && (
              <div className="hidden sm:block text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 inline mr-1" />
                {selectedBranch.name}
              </div>
            )}

            {/* Cart */}
            {(!user || user.role === 'customer') && (
              <Link 
                to="/cart" 
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs min-w-[1.25rem] h-5 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            )}

            {/* User menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-destructive">
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth/register">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border mt-4 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {selectedBranch && (
              <div className="px-4 py-2 text-sm text-muted-foreground border-t border-border mt-4">
                <MapPin className="w-4 h-4 inline mr-2" />
                Current: {selectedBranch.name}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};