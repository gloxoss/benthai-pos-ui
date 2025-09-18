import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for our store
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'kitchen' | 'admin';
  branchId?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: 'active' | 'inactive';
  operatingHours: {
    open: string;
    close: string;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  cookingTime: number; // in minutes
  ingredients?: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  branchId: string;
  customerId?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  customerInfo?: {
    name: string;
    phone: string;
    address?: string;
  };
  timestamps: {
    created: string;
    updated: string;
    estimated?: string;
  };
}

interface AppState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  
  // Current branch context
  selectedBranch: Branch | null;
  branches: Branch[];
  
  // Cart & Orders
  cart: CartItem[];
  orders: Order[];
  
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  setSelectedBranch: (branch: Branch) => void;
  setBranches: (branches: Branch[]) => void;
  addToCart: (item: MenuItem, quantity?: number, notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  createOrder: (orderData: Omit<Order, 'id' | 'timestamps'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      selectedBranch: null,
      branches: [
        {
          id: '1',
          name: 'Benthai Downtown',
          address: '123 Main Street, Downtown District',
          phone: '+1 (555) 123-4567',
          status: 'active',
          operatingHours: { open: '11:00', close: '22:00' }
        },
        {
          id: '2', 
          name: 'Benthai Westside',
          address: '456 West Avenue, Westside Mall',
          phone: '+1 (555) 234-5678',
          status: 'active',
          operatingHours: { open: '10:00', close: '23:00' }
        },
        {
          id: '3',
          name: 'Benthai Airport',
          address: 'Terminal 2, International Airport',
          phone: '+1 (555) 345-6789',
          status: 'active',
          operatingHours: { open: '06:00', close: '24:00' }
        }
      ],
      cart: [],
      orders: [],
      sidebarOpen: false,
      theme: 'light',

      // Actions
      login: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        cart: [],
        selectedBranch: null 
      }),
      
      setSelectedBranch: (branch) => set({ selectedBranch: branch }),
      
      setBranches: (branches) => set({ branches }),
      
      addToCart: (item, quantity = 1, notes) => {
        const { cart } = get();
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
          set({
            cart: cart.map(cartItem =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + quantity, notes }
                : cartItem
            )
          });
        } else {
          set({
            cart: [...cart, { ...item, quantity, notes }]
          });
        }
      },
      
      removeFromCart: (itemId) => {
        const { cart } = get();
        set({
          cart: cart.filter(item => item.id !== itemId)
        });
      },
      
      updateCartItem: (itemId, updates) => {
        const { cart } = get();
        set({
          cart: cart.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          )
        });
      },
      
      clearCart: () => set({ cart: [] }),
      
      createOrder: (orderData) => {
        const { orders } = get();
        const newOrder: Order = {
          ...orderData,
          id: `order-${Date.now()}`,
          timestamps: {
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
          }
        };
        
        set({
          orders: [...orders, newOrder],
          cart: [] // Clear cart after order
        });
      },
      
      updateOrderStatus: (orderId, status) => {
        const { orders } = get();
        set({
          orders: orders.map(order =>
            order.id === orderId
              ? { 
                  ...order, 
                  status,
                  timestamps: {
                    ...order.timestamps,
                    updated: new Date().toISOString()
                  }
                }
              : order
          )
        });
      },
      
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'benthai-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        selectedBranch: state.selectedBranch,
        cart: state.cart,
        theme: state.theme,
      }),
    }
  )
);