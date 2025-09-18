import { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Star, 
  Search,
  Filter,
  CheckCircle2,
  Store,
  Navigation,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useStore } from '@/store/useStore';
import { MainLayout } from '@/components/layout/MainLayout';

export default function BranchesPage() {
  const { branches, selectedBranch, setSelectedBranch } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const isOpen = (branch: typeof branches[0]) => {
    const now = new Date();
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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <h1 className="heading-lg text-foreground">Our Locations</h1>
            <p className="text-lg text-muted-foreground">
              Find the Benthai branch nearest to you. All locations offer our complete menu 
              and exceptional service.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by location name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selected branch indicator */}
          {selectedBranch && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Selected Branch</p>
                      <p className="text-sm text-muted-foreground">{selectedBranch.name}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBranch(null)}
                  >
                    Change Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredBranches.length} of {branches.length} branches
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredBranches.map((branch, index) => {
            const branchIsOpen = isOpen(branch);
            const isSelected = selectedBranch?.id === branch.id;
            
            return (
              <Card 
                key={branch.id}
                className={`card-benthai-feature transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                style={{ 
                  animationDelay: `${index * 100}ms` 
                }}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Store className="h-5 w-5 text-primary" />
                        {branch.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
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
                          {branchIsOpen ? 'Open Now' : 'Closed'}
                        </Badge>
                        
                        <Badge 
                          className={
                            branch.status === 'active' 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {branch.status}
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
                
                <CardContent className="space-y-6">
                  {/* Branch Details */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">{branch.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium">Phone</p>
                        <a 
                          href={`tel:${branch.phone}`}
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          {branch.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium">Operating Hours</p>
                        <p className="text-sm text-muted-foreground">
                          {formatOperatingHours(branch.operatingHours)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <Button 
                      className={`w-full ${isSelected ? 'btn-benthai' : 'btn-benthai-outline'}`}
                      onClick={() => setSelectedBranch(branch)}
                      disabled={isSelected}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Selected Branch
                        </>
                      ) : (
                        <>
                          Select This Branch
                        </>
                      )}
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          // In a real app, this would open maps with the address
                          window.open(`https://maps.google.com?q=${encodeURIComponent(branch.address)}`, '_blank');
                        }}
                      >
                        <Navigation className="mr-2 h-4 w-4" />
                        Get Directions
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // In a real app, this could show more details or reviews
                          alert(`More details about ${branch.name} coming soon!`);
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredBranches.length === 0 && (
          <Card className="card-benthai text-center py-12">
            <CardContent>
              <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-lg mb-2">No branches found</CardTitle>
              <CardDescription>
                Try adjusting your search criteria or filters to find branches.
              </CardDescription>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}