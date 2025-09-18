import { Routes, Route } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Store, 
  ShoppingCart,
  TrendingUp,
  DollarSign,
  MapPin,
  Utensils,
  Clock,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { MainLayout } from '@/components/layout/MainLayout';

function AdminOverview() {
  const { orders, branches, user } = useStore();

  const todayOrders = orders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.timestamps.created).toDateString();
    return orderDate === today;
  });

  const totalRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = todayOrders.length ? totalRevenue / todayOrders.length : 0;
  
  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(0)}`,
      description: "Today's earnings",
      icon: DollarSign,
      color: "text-green-600",
      change: "+12.5%"
    },
    {
      title: "Total Orders",
      value: todayOrders.length,
      description: "Across all branches",
      icon: ShoppingCart,
      color: "text-blue-600",
      change: "+8.2%"
    },
    {
      title: "Active Branches",
      value: branches.filter(b => b.status === 'active').length,
      description: "Currently operating",
      icon: MapPin,
      color: "text-purple-600",
      change: "100%"
    },
    {
      title: "Avg Order Value",
      value: `$${avgOrderValue.toFixed(2)}`,
      description: "Per order today",
      icon: TrendingUp,
      color: "text-primary",
      change: "+5.3%"
    }
  ];

  const quickActions = [
    {
      title: "Order Management",
      description: "View and manage all orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-blue-500"
    },
    {
      title: "Menu Management",
      description: "Update menu items and pricing",
      icon: Utensils,
      href: "/admin/menu",
      color: "bg-green-500"
    },
    {
      title: "Staff Management",
      description: "Manage staff and permissions",
      icon: Users,
      href: "/admin/staff",
      color: "bg-purple-500"
    },
    {
      title: "Branch Management",
      description: "Manage branch locations",
      icon: Store,
      href: "/admin/branches",
      color: "bg-orange-500"
    },
    {
      title: "Analytics & Reports",
      description: "View detailed reports",
      icon: BarChart3,
      href: "/admin/reports",
      color: "bg-red-500"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="heading-lg text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your business overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <Card 
              key={stat.title}
              className="card-benthai-feature"
              style={{ 
                animationDelay: `${index * 100}ms` 
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="card-benthai">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Access key management functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              
              return (
                <Card 
                  key={action.title}
                  className="card-benthai hover-lift cursor-pointer"
                  style={{ 
                    animationDelay: `${index * 100}ms` 
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      Access
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card className="card-benthai">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>
              Latest order activity across branches
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayOrders.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No orders today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayOrders.slice(0, 5).map((order) => {
                  const branch = branches.find(b => b.id === order.branchId);
                  
                  return (
                    <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">Order #{order.id.slice(-6)}</div>
                        <div className="text-sm text-muted-foreground">
                          {branch?.name} • ${order.total.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.timestamps.created).toLocaleTimeString()}
                        </div>
                      </div>
                      <Badge className={
                        order.status === 'delivered' ? 'status-active' :
                        order.status === 'preparing' ? 'status-pending' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Branch Performance */}
        <Card className="card-benthai">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Branch Performance
            </CardTitle>
            <CardDescription>
              Today's performance by location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {branches.map((branch) => {
                const branchOrders = todayOrders.filter(order => order.branchId === branch.id);
                const branchRevenue = branchOrders.reduce((sum, order) => sum + order.total, 0);
                
                return (
                  <div key={branch.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{branch.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {branchOrders.length} orders • ${branchRevenue.toFixed(0)}
                      </div>
                    </div>
                    <Badge className={
                      branch.status === 'active' ? 'status-active' : 'status-inactive'
                    }>
                      {branch.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Placeholder components for other routes
function AdminOrders() {
  return (
    <div className="space-y-6">
      <h2 className="heading-md text-foreground">Order Management</h2>
      <Card className="card-benthai text-center py-12">
        <CardContent>
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">Order Management System</CardTitle>
          <CardDescription className="mb-4">
            Comprehensive order management interface coming soon
          </CardDescription>
          <Button className="btn-benthai">View Orders</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminMenu() {
  return (
    <div className="space-y-6">
      <h2 className="heading-md text-foreground">Menu Management</h2>
      <Card className="card-benthai text-center py-12">
        <CardContent>
          <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">Menu Management System</CardTitle>
          <CardDescription className="mb-4">
            Full menu management interface coming soon
          </CardDescription>
          <Button className="btn-benthai">Manage Menu</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminStaff() {
  return (
    <div className="space-y-6">
      <h2 className="heading-md text-foreground">Staff Management</h2>
      <Card className="card-benthai text-center py-12">
        <CardContent>
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">Staff Management System</CardTitle>
          <CardDescription className="mb-4">
            Staff management interface coming soon
          </CardDescription>
          <Button className="btn-benthai">Manage Staff</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminBranches() {
  return (
    <div className="space-y-6">
      <h2 className="heading-md text-foreground">Branch Management</h2>
      <Card className="card-benthai text-center py-12">
        <CardContent>
          <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">Branch Management System</CardTitle>
          <CardDescription className="mb-4">
            Branch management interface coming soon
          </CardDescription>
          <Button className="btn-benthai">Manage Branches</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminReports() {
  return (
    <div className="space-y-6">
      <h2 className="heading-md text-foreground">Analytics & Reports</h2>
      <Card className="card-benthai text-center py-12">
        <CardContent>
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">Analytics Dashboard</CardTitle>
          <CardDescription className="mb-4">
            Comprehensive analytics and reporting coming soon
          </CardDescription>
          <Button className="btn-benthai">View Reports</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="branches" element={<AdminBranches />} />
          <Route path="reports" element={<AdminReports />} />
        </Routes>
      </div>
    </MainLayout>
  );
}