import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Star, 
  ShoppingBag, 
  Users, 
  ChefHat,
  Utensils,
  ArrowRight,
  CheckCircle2,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { MainLayout } from '@/components/layout/MainLayout';

export default function HomePage() {
  const { branches, selectedBranch, setSelectedBranch, user } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const isOpen = (branch: typeof branches[0]) => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    const openTime = parseInt(branch.operatingHours.open.split(':')[0]) * 60 + 
                     parseInt(branch.operatingHours.open.split(':')[1]);
    const closeTime = parseInt(branch.operatingHours.close.split(':')[0]) * 60 + 
                      parseInt(branch.operatingHours.close.split(':')[1]);
    
    return currentTimeInMinutes >= openTime && currentTimeInMinutes <= closeTime;
  };

  const formatOperatingHours = (hours: { open: string; close: string }) => {
    const formatTime = (time: string) => {
      const [hour, minute] = time.split(':');
      const hour12 = parseInt(hour) > 12 ? parseInt(hour) - 12 : parseInt(hour);
      const period = parseInt(hour) >= 12 ? 'PM' : 'AM';
      const displayHour = hour12 === 0 ? 12 : hour12;
      return `${displayHour}:${minute} ${period}`;
    };
    
    return `${formatTime(hours.open)} - ${formatTime(hours.close)}`;
  };

  const features = [
    {
      icon: ShoppingBag,
      title: 'Easy Ordering',
      description: 'Browse our menu and place orders with just a few clicks.',
      color: 'bg-primary'
    },
    {
      icon: Users,
      title: 'Staff Management',
      description: 'Comprehensive tools for managing restaurant staff and operations.',
      color: 'bg-accent'
    },
    {
      icon: ChefHat,
      title: 'Kitchen Operations',
      description: 'Streamlined kitchen workflow and order management system.',
      color: 'bg-primary'
    },
    {
      icon: Utensils,
      title: 'Menu Management',
      description: 'Easily update menu items, prices, and availability across all branches.',
      color: 'bg-accent'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-subtle py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1">
                Professional Restaurant Management
              </Badge>
              <h1 className="heading-xl text-foreground">
                Welcome to <span className="text-primary">Benthai</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience authentic Thai cuisine with our modern restaurant management system. 
                Choose your location and start your culinary journey today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="btn-benthai">
                <Link to="/menu">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Menu
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-benthai-outline">
                <Link to="/branches">
                  <MapPin className="mr-2 h-5 w-5" />
                  Find Locations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Directory */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="heading-lg text-foreground">Our Locations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Visit any of our branches for an exceptional dining experience. 
              Each location offers the full Benthai menu and premium service.
            </p>
          </div>
          
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch, index) => {
              const branchIsOpen = isOpen(branch);
              const isSelected = selectedBranch?.id === branch.id;
              
              return (
                <Card 
                  key={branch.id} 
                  className={`card-benthai-feature cursor-pointer transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : ''
                  }`}
                  style={{ 
                    animationDelay: `${index * 100}ms` 
                  }}
                  onClick={() => setSelectedBranch(branch)}
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          <Store className="h-5 w-5 text-primary" />
                          {branch.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              branchIsOpen 
                                ? "status-active" 
                                : "status-inactive"
                            }
                          >
                            <div className={`w-2 h-2 rounded-full mr-1 ${
                              branchIsOpen ? 'bg-green-600' : 'bg-red-600'
                            }`} />
                            {branchIsOpen ? 'Open' : 'Closed'}
                          </Badge>
                          {isSelected && (
                            <Badge className="bg-primary text-primary-foreground">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{branch.address}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{branch.phone}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {formatOperatingHours(branch.operatingHours)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <Button 
                        className={`w-full ${isSelected ? 'btn-benthai' : 'btn-benthai-outline'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBranch(branch);
                        }}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Selected Branch
                          </>
                        ) : (
                          <>
                            Select Branch
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="heading-lg text-foreground">Why Choose Benthai?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive restaurant management system provides everything you need 
              for exceptional service and operations.
            </p>
          </div>
          
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <Card 
                  key={feature.title}
                  className="card-benthai text-center hover-lift"
                  style={{ 
                    animationDelay: `${index * 100}ms` 
                  }}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Role-based Quick Actions */}
      {user && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="heading-lg text-foreground">Quick Actions</h2>
              <p className="text-lg text-muted-foreground">
                Welcome back, {user.name}! Access your dashboard and manage operations.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-2xl">
                {user.role === 'admin' && (
                  <>
                    <Button size="lg" asChild className="btn-benthai">
                      <Link to="/admin">
                        <Users className="mr-2 h-5 w-5" />
                        Admin Dashboard
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="btn-benthai-outline">
                      <Link to="/admin/orders">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Manage Orders
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="btn-benthai-outline">
                      <Link to="/admin/reports">
                        <Star className="mr-2 h-5 w-5" />
                        View Reports
                      </Link>
                    </Button>
                  </>
                )}
                
                {user.role === 'staff' && (
                  <>
                    <Button size="lg" asChild className="btn-benthai">
                      <Link to="/staff">
                        <Users className="mr-2 h-5 w-5" />
                        Staff Dashboard
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="btn-benthai-outline">
                      <Link to="/staff/orders">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Take Orders
                      </Link>
                    </Button>
                  </>
                )}
                
                {user.role === 'kitchen' && (
                  <Button size="lg" asChild className="btn-benthai">
                    <Link to="/kitchen">
                      <ChefHat className="mr-2 h-5 w-5" />
                      Kitchen Dashboard
                    </Link>
                  </Button>
                )}
                
                {user.role === 'customer' && (
                  <>
                    <Button size="lg" asChild className="btn-benthai">
                      <Link to="/menu">
                        <Utensils className="mr-2 h-5 w-5" />
                        Browse Menu
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="btn-benthai-outline">
                      <Link to="/orders">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        My Orders
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}