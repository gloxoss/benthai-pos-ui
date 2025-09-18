import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/useStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { toast } from '@/hooks/use-toast';

export default function CartPage() {
  const { 
    cart, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    selectedBranch, 
    createOrder,
    user 
  } = useStore();
  const [orderNotes, setOrderNotes] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    phone: '',
    address: ''
  });

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartItem(itemId, { quantity: newQuantity });
    }
  };

  const handleCheckout = () => {
    if (!selectedBranch) {
      toast({
        title: "Select a Branch",
        description: "Please select a branch location before placing your order.",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Add items to your cart before checking out.",
        variant: "destructive"
      });
      return;
    }

    // Create order
    createOrder({
      branchId: selectedBranch.id,
      customerId: user?.id,
      items: cart,
      total,
      status: 'pending',
      orderType: 'dine-in', // This would be selected by user
      customerInfo: user ? undefined : customerInfo,
    });

    toast({
      title: "Order Placed Successfully!",
      description: "Your order has been submitted and will be prepared shortly.",
    });
  };

  if (cart.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="card-benthai text-center py-16 max-w-md mx-auto">
            <CardContent>
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <CardTitle className="text-2xl mb-4">Your cart is empty</CardTitle>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added anything to your cart yet. 
                Browse our delicious menu to get started!
              </p>
              <Button asChild className="btn-benthai">
                <Link to="/menu">
                  Browse Menu
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/menu">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <div>
            <h1 className="heading-lg text-foreground">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {selectedBranch && (
              <Card className="card-benthai">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Ordering from</p>
                        <p className="text-sm text-muted-foreground">{selectedBranch.name}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/branches">Change</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {cart.map((item) => (
              <Card key={item.id} className="card-benthai">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gradient-subtle rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {item.cookingTime}m cook time
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-lg">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          <strong>Notes:</strong> {item.notes}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          
                          <span className="px-3 py-1 bg-muted rounded font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Order Notes */}
            <Card className="card-benthai">
              <CardHeader>
                <CardTitle className="text-lg">Special Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special requests or dietary requirements?"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="card-benthai sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Badge className="w-full justify-center py-2 bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Estimated prep time: {Math.max(...cart.map(item => item.cookingTime))}m
                  </Badge>

                  {!user && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Customer Information</h4>
                      <Input
                        placeholder="Your name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Phone number"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  )}

                  <Button 
                    className="w-full btn-benthai text-lg py-6"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Place Order
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}