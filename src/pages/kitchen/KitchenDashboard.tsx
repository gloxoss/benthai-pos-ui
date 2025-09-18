import { Routes, Route } from 'react-router-dom';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Timer,
  Utensils,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { MainLayout } from '@/components/layout/MainLayout';

function KitchenOverview() {
  const { orders, selectedBranch, user } = useStore();

  const kitchenOrders = orders.filter(order => 
    order.branchId === selectedBranch?.id && 
    ['confirmed', 'preparing'].includes(order.status)
  );

  const preparingOrders = kitchenOrders.filter(order => order.status === 'preparing');
  const pendingOrders = kitchenOrders.filter(order => order.status === 'confirmed');
  
  const stats = [
    {
      title: "Orders in Queue",
      value: kitchenOrders.length,
      description: "Total orders to prepare",
      icon: ChefHat,
      color: "text-blue-600"
    },
    {
      title: "Currently Cooking",
      value: preparingOrders.length,
      description: "Orders being prepared",
      icon: Timer,
      color: "text-yellow-600"
    },
    {
      title: "Average Prep Time",
      value: "18m",
      description: "Today's average",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Completed Today",
      value: orders.filter(o => o.status === 'ready').length,
      description: "Orders completed",
      icon: CheckCircle2,
      color: "text-primary"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="heading-lg text-foreground">Kitchen Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the kitchen, {user?.name}! Here's your current workload.
        </p>
        {selectedBranch && (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {selectedBranch.name} Kitchen
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

      {/* Active Orders */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Orders */}
        <Card className="card-benthai">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              New Orders
            </CardTitle>
            <CardDescription>
              Orders waiting to be started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingOrders.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <ChefHat className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No new orders</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Order #{order.id.slice(-6)}</div>
                      <Badge className="status-pending">New</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.timestamps.created).toLocaleTimeString()}
                      </span>
                      <Button size="sm" className="btn-benthai">
                        Start Cooking
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preparing Orders */}
        <Card className="card-benthai">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-blue-600" />
              In Progress
            </CardTitle>
            <CardDescription>
              Orders currently being prepared
            </CardDescription>
          </CardHeader>
          <CardContent>
            {preparingOrders.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nothing cooking</p>
              </div>
            ) : (
              <div className="space-y-3">
                {preparingOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-3 border border-border rounded-lg bg-blue-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Order #{order.id.slice(-6)}</div>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        Cooking
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600 font-medium">
                        Started: {new Date(order.timestamps.updated || order.timestamps.created).toLocaleTimeString()}
                      </span>
                      <Button size="sm" variant="outline">
                        Mark Ready
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KitchenOrders() {
  return (
    <div className="space-y-6">
      <h2 className="heading-md text-foreground">Order Queue</h2>
      <Card className="card-benthai text-center py-12">
        <CardContent>
          <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">Kitchen Order Management</CardTitle>
          <CardDescription className="mb-4">
            Full kitchen queue interface coming soon
          </CardDescription>
          <Button className="btn-benthai">View All Orders</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function KitchenDashboard() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={<KitchenOverview />} />
          <Route path="orders" element={<KitchenOrders />} />
        </Routes>
      </div>
    </MainLayout>
  );
}