import { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface MainLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

export const MainLayout = ({ children, showNavigation = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {showNavigation && <Navigation />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Benthai Restaurant</h3>
              <p className="text-sm text-muted-foreground">
                Professional restaurant management system for modern food service operations.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/menu" className="hover:text-foreground transition-colors">Menu</a></li>
                <li><a href="/branches" className="hover:text-foreground transition-colors">Locations</a></li>
                <li><a href="/about" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/help" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>support@benthai.com</p>
                <p>+1 (555) 123-4567</p>
                <p>Available 24/7</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Benthai Restaurant Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};