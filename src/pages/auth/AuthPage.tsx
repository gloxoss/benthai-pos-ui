import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Store,
  UserCheck,
  Shield,
  ChefHat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useStore } from '@/store/useStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { toast } from '@/hooks/use-toast';

interface AuthPageProps {
  type: 'login' | 'register';
}

export default function AuthPage({ type }: AuthPageProps) {
  const navigate = useNavigate();
  const { login } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as 'customer' | 'staff' | 'kitchen' | 'admin'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (type === 'register' && formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    // Mock authentication - in real app this would call an API
    const mockUser = {
      id: `user-${Date.now()}`,
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      role: formData.role
    };

    login(mockUser);
    
    toast({
      title: type === 'login' ? "Welcome back!" : "Account created!",
      description: `Successfully ${type === 'login' ? 'signed in' : 'registered'} as ${mockUser.name}.`
    });

    // Redirect based on role
    switch (mockUser.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'staff':
        navigate('/staff');
        break;
      case 'kitchen':
        navigate('/kitchen');
        break;
      default:
        navigate('/');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const roleOptions = [
    { value: 'customer', label: 'Customer', icon: User, description: 'Browse menu and place orders' },
    { value: 'staff', label: 'Staff', icon: UserCheck, description: 'Take orders and manage service' },
    { value: 'kitchen', label: 'Kitchen', icon: ChefHat, description: 'Manage food preparation' },
    { value: 'admin', label: 'Admin', icon: Shield, description: 'Full system access' }
  ];

  return (
    <MainLayout showNavigation={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-primary">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span>Benthai</span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-foreground">
              {type === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {type === 'login' 
                ? 'Sign in to access your dashboard' 
                : 'Join our restaurant management system'
              }
            </p>
          </div>

          {/* Form */}
          <Card className="card-benthai">
            <CardHeader>
              <CardTitle>
                {type === 'login' ? 'Sign In' : 'Create Account'}
              </CardTitle>
              <CardDescription>
                {type === 'login' 
                  ? 'Enter your credentials to access your account'
                  : 'Fill in your details to create a new account'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {type === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {type === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-3">
                                <Icon className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-muted-foreground">{option.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {type === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full btn-benthai">
                  {type === 'login' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                {type === 'login' ? (
                  <p className="text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/auth/register" className="text-primary hover:text-primary/80 font-medium">
                      Sign up
                    </Link>
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="text-primary hover:text-primary/80 font-medium">
                      Sign in
                    </Link>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Demo Accounts Info */}
          <Card className="card-benthai">
            <CardHeader>
              <CardTitle className="text-sm">Demo Accounts</CardTitle>
              <CardDescription className="text-xs">
                For testing purposes, you can use any email/password combination.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}