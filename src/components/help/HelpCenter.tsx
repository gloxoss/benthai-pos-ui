import { useState } from 'react';
import { Search, MessageCircle, Phone, Mail, ExternalLink, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const mockFAQs: FAQItem[] = [
  {
    id: '1',
    question: 'How do I update menu items?',
    answer: 'Go to the Admin Dashboard > Menu Management. Click on any menu item to edit its details, price, or availability.',
    category: 'menu'
  },
  {
    id: '2',
    question: 'How do I track orders?',
    answer: 'Orders can be tracked in real-time from the Orders dashboard. You can see order status, estimated completion time, and customer details.',
    category: 'orders'
  },
  {
    id: '3',
    question: 'How do I add new staff members?',
    answer: 'Navigate to Admin Dashboard > Staff Management. Click "Add New Staff" and fill in their details including role and branch assignment.',
    category: 'staff'
  },
  {
    id: '4',
    question: 'How do I generate reports?',
    answer: 'Go to Analytics & Reports section. Select your date range and report type, then click Generate Report. You can export reports as PDF or CSV.',
    category: 'reports'
  },
];

export const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const { t } = useLanguage();

  const filteredFAQs = mockFAQs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {t('common.help')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t('common.help')} Center
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5 text-benthai-red" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Get instant help from our support team
                </p>
                <Button size="sm" className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5 text-benthai-gold" />
                  Call Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Speak directly with our support team
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  +1 (555) 123-4567
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Send us a detailed message
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  support@benthai.com
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {t('common.faq')}
            </h3>
            <div className="space-y-2">
              {filteredFAQs.map((faq) => (
                <Collapsible
                  key={faq.id}
                  open={openItems.includes(faq.id)}
                  onOpenChange={() => toggleItem(faq.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                      <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium">
                            {faq.question}
                          </CardTitle>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              openItems.includes(faq.id) ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </CardHeader>
                    </Card>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-6 pb-4">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>

          {/* Documentation Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {t('common.documentation')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" className="justify-between h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">User Guide</div>
                  <div className="text-sm text-muted-foreground">
                    Complete user manual
                  </div>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="justify-between h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">API Documentation</div>
                  <div className="text-sm text-muted-foreground">
                    For developers
                  </div>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="justify-between h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Video Tutorials</div>
                  <div className="text-sm text-muted-foreground">
                    Step-by-step guides
                  </div>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="justify-between h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Release Notes</div>
                  <div className="text-sm text-muted-foreground">
                    Latest updates
                  </div>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};