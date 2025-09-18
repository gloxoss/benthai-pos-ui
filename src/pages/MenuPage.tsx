import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  Plus, 
  Minus,
  Star,
  ShoppingCart,
  Utensils,
  Leaf,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/store/useStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { toast } from '@/hooks/use-toast';

// Mock menu data - in real app this would come from API
const menuItems = [
  {
    id: '1',
    name: 'Pad Thai',
    description: 'Traditional stir-fried rice noodles with shrimp, tofu, bean sprouts, and tamarind sauce',
    price: 14.95,
    category: 'noodles',
    image: '/api/placeholder/300/200',
    available: true,
    cookingTime: 15,
    ingredients: ['rice noodles', 'shrimp', 'tofu', 'bean sprouts', 'tamarind'],
    spiceLevel: 2,
    isVegetarian: false,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Green Curry',
    description: 'Aromatic coconut curry with Thai basil, bamboo shoots, and your choice of protein',
    price: 16.95,
    category: 'curry',
    image: '/api/placeholder/300/200',
    available: true,
    cookingTime: 20,
    ingredients: ['coconut milk', 'green curry paste', 'thai basil', 'bamboo shoots'],
    spiceLevel: 3,
    isVegetarian: true,
    rating: 4.9
  },
  {
    id: '3',
    name: 'Tom Yum Soup',
    description: 'Spicy and sour soup with lemongrass, lime leaves, and fresh herbs',
    price: 12.95,
    category: 'soup',
    image: '/api/placeholder/300/200',
    available: true,
    cookingTime: 12,
    ingredients: ['lemongrass', 'lime leaves', 'galangal', 'chili', 'mushrooms'],
    spiceLevel: 4,
    isVegetarian: false,
    rating: 4.7
  },
  {
    id: '4',
    name: 'Mango Sticky Rice',
    description: 'Sweet dessert with fresh mango slices and coconut sticky rice',
    price: 8.95,
    category: 'dessert',
    image: '/api/placeholder/300/200',
    available: true,
    cookingTime: 5,
    ingredients: ['mango', 'sticky rice', 'coconut milk'],
    spiceLevel: 0,
    isVegetarian: true,
    rating: 4.6
  },
  {
    id: '5',
    name: 'Thai Iced Tea',
    description: 'Traditional Thai tea with condensed milk and ice',
    price: 4.95,
    category: 'beverage',
    image: '/api/placeholder/300/200',
    available: true,
    cookingTime: 3,
    ingredients: ['thai tea', 'condensed milk', 'sugar'],
    spiceLevel: 0,
    isVegetarian: true,
    rating: 4.5
  },
  {
    id: '6',
    name: 'Massaman Curry',
    description: 'Rich and mild curry with potatoes, peanuts, and tender beef',
    price: 18.95,
    category: 'curry',
    image: '/api/placeholder/300/200',
    available: false,
    cookingTime: 25,
    ingredients: ['massaman paste', 'coconut milk', 'potatoes', 'peanuts', 'beef'],
    spiceLevel: 1,
    isVegetarian: false,
    rating: 4.8
  }
];

const categories = [
  { id: 'all', name: 'All Items', icon: Utensils },
  { id: 'noodles', name: 'Noodles', icon: Utensils },
  { id: 'curry', name: 'Curry', icon: Flame },
  { id: 'soup', name: 'Soup', icon: Utensils },
  { id: 'dessert', name: 'Dessert', icon: Star },
  { id: 'beverage', name: 'Beverages', icon: Utensils }
];

export default function MenuPage() {
  const { cart, addToCart, selectedBranch } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'available' && item.available) ||
                         (filterBy === 'vegetarian' && item.isVegetarian);
    
    return matchesCategory && matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'cookingTime':
        return a.cookingTime - b.cookingTime;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const getCartQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (item: any) => {
    if (!item.available) {
      toast({
        title: "Item Unavailable",
        description: `${item.name} is currently not available.`,
        variant: "destructive"
      });
      return;
    }

    addToCart(item);
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`
    });
  };

  const renderSpiceLevel = (level: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Flame 
            key={i} 
            className={`w-3 h-3 ${
              i < level ? 'text-red-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <h1 className="heading-lg text-foreground">Our Menu</h1>
            <p className="text-lg text-muted-foreground">
              Discover authentic Thai cuisine crafted with traditional recipes and fresh ingredients.
            </p>
            {selectedBranch && (
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Ordering from: {selectedBranch.name}
              </Badge>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="cookingTime">Cook Time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-2 py-3 px-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredItems.length} items
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Menu Items Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => {
            const quantity = getCartQuantity(item.id);
            
            return (
              <Card 
                key={item.id}
                className={`card-benthai-feature overflow-hidden ${
                  !item.available ? 'opacity-60' : ''
                }`}
                style={{ 
                  animationDelay: `${index * 50}ms` 
                }}
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-subtle flex items-center justify-center">
                    <Utensils className="w-12 h-12 text-muted-foreground" />
                  </div>
                  
                  {!item.available && (
                    <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                      Unavailable
                    </Badge>
                  )}
                  
                  {item.isVegetarian && (
                    <Badge className="absolute top-3 left-3 bg-green-100 text-green-800 border-green-200">
                      <Leaf className="w-3 h-3 mr-1" />
                      Vegetarian
                    </Badge>
                  )}
                </div>

                <CardHeader className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {item.rating}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.cookingTime}m
                        </div>
                        
                        {item.spiceLevel > 0 && (
                          <div className="flex items-center gap-1">
                            {renderSpiceLevel(item.spiceLevel)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {quantity > 0 ? (
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const cartItem = cart.find(i => i.id === item.id);
                          if (cartItem && cartItem.quantity > 1) {
                            // In real app, this would decrease quantity
                            addToCart(item, -1);
                          } else {
                            // Remove from cart completely
                            // removeFromCart(item.id);
                          }
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <span className="px-4 py-2 bg-primary/10 rounded-lg font-medium">
                        {quantity} in cart
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.available}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full btn-benthai"
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.available}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <Card className="card-benthai text-center py-12">
            <CardContent>
              <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-lg mb-2">No items found</CardTitle>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setFilterBy('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Cart Summary (sticky on mobile) */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 right-4 lg:hidden">
            <Button size="lg" className="btn-benthai rounded-full shadow-lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              {cart.reduce((total, item) => total + item.quantity, 0)} items
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}