import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BranchesPage from "./pages/BranchesPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/auth/AuthPage";
import StaffDashboard from "./pages/staff/StaffDashboard";
import KitchenDashboard from "./pages/kitchen/KitchenDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<AuthPage type="login" />} />
          <Route path="/auth/register" element={<AuthPage type="register" />} />
          
          {/* Staff Routes */}
          <Route path="/staff/*" element={<StaffDashboard />} />
          
          {/* Kitchen Routes */}
          <Route path="/kitchen/*" element={<KitchenDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
