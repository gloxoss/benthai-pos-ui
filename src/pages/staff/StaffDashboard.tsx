import { Routes, Route } from 'react-router-dom';
import { 
  ClipboardList, 
  ShoppingCart, 
  Users, 
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { MainLayout } from '@/components/layout/MainLayout';

function StaffOverview() {
  const { orders, selectedBranch, user } = useStore();

  const todayOrders = orders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.timestamps.created).toDateString();
    return orderDate === today && order.branchId === selectedBranch?.id;
  });

  const pendingOrders = todayOrders.filter(order => order.status === 'pending');
  const completedOrders = todayOrders.filter(order => order.status === 'delivered');
  
  const stats = [
    {
      title: "Today's Orders",
      value: todayOrders.length,
      description: "Total orders received",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Pending Orders",
      value: pendingOrders.length,
      description: "Awaiting processing",
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Completed Orders",
      value: completedOrders.length,
      description: "Successfully fulfilled",
      icon: CheckCircle2,
      color: "text-green-600"
    },
    {
      title: "Revenue",
      value: `$${todayOrders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}`,
      description: "Today's earnings",
      icon: DollarSign,
      color: "text-primary"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="heading-lg text-foreground">Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your shift overview.
        </p>
        {selectedBranch && (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {selectedBranch.name}
          </Badge>
        )}
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
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card className="card-benthai">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Recent Orders
          </CardTitle>
          <CardDescription>
            Latest orders that need attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending orders at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">Order #{order.id.slice(-6)}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.items.length} items • ${order.total.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(order.timestamps.created).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="status-pending">
                      {order.status}
                    </Badge>
                    <Button size="sm" className="btn-benthai">
                      Process
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StaffOrders() {
  return (
    <div className="space-y-6">
      <h2 className="heading-md text-foreground">Order Management</h2>
      <Card className="card-benthai text-center py-12">
        <CardContent>
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">Order Management</CardTitle>
          <CardDescription className="mb-4">
            Full order management interface coming soon
          </CardDescription>
          <Button className="btn-benthai">View All Orders</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StaffDashboard() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={<StaffOverview />} />
          <Route path="orders" element={<StaffOrders />} />
        </Routes>
      </div>
    </MainLayout>
  );
}