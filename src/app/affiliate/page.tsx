'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  IndianRupee,
  MousePointerClick,
  Target,
  Users,
  Copy,
  Check,
  Link,
  Plus,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Ban,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

interface AffiliateStats {
  totalEarnings: number;
  pendingEarnings: number;
  totalClicks: number;
  totalLeads: number;
  totalReferredCustomers: number;
  totalConversions: number;
  conversionRate: number;
  referralLink: string;
  referralCode: string;
}

interface Referral {
  id: string;
  leadName: string;
  leadEmail: string;
  company?: string;
  estimatedValue: number;
  status: string;
  createdAt: string;
}

export default function AffiliateDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copied, setCopied] = useState<'link' | 'code' | null>(null);

  // Referral form state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    leadName: '',
    leadEmail: '',
    estimatedValue: '0',
  });

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [authLoading, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/affiliate/profile');
      const data = await response.json();

      if (data.success) {
        setStats({
          totalEarnings: data.affiliate?.balanceCents || 0,
          pendingEarnings: data.stats?.pendingEarnings || 0,
          totalClicks: data.stats?.totalClicks || 0,
          totalLeads: data.referrals?.length || 0,
          totalReferredCustomers: data.referrals?.filter((r: any) => r.status === 'APPROVED').length || 0,
          totalConversions: data.stats?.totalConversions || 0,
          conversionRate: data.stats?.conversionRate || 0,
          referralLink: `${window.location.origin}/r/${data.affiliate?.referralCode}`,
          referralCode: data.affiliate?.referralCode || '',
        });
        setReferrals(data.referrals || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const response = await fetch('/api/affiliate/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_name: submitForm.leadName,
          lead_email: submitForm.leadEmail,
          estimated_value: submitForm.estimatedValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('success', 'Lead submitted successfully! Waiting for admin approval.');
        setShowSubmitModal(false);
        setSubmitForm({ leadName: '', leadEmail: '', estimatedValue: '0' });
        loadDashboardData();
      } else {
        showNotification('error', data.error || 'Failed to submit lead');
      }
    } catch {
      showNotification('error', 'An error occurred while submitting lead');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      const response = await fetch('/api/affiliate/generate-code', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        window.location.reload();
      } else {
        showNotification('error', 'Failed to generate code: ' + data.error);
      }
    } catch {
      showNotification('error', 'Failed to generate code. Please try again.');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  const formatCurrency = (cents: number) =>
    `\u20B9${(cents / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getStatusBadge = (status: string) => {
    const map: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
      APPROVED: { variant: 'default', icon: CheckCircle2 },
      COMPLETED: { variant: 'default', icon: CheckCircle2 },
      PAID: { variant: 'default', icon: CheckCircle2 },
      PENDING: { variant: 'secondary', icon: Clock },
      PROCESSING: { variant: 'secondary', icon: Loader2 },
      REJECTED: { variant: 'destructive', icon: Ban },
      FAILED: { variant: 'destructive', icon: AlertCircle },
    };
    const { variant, icon: Icon } = map[status] || { variant: 'outline' as const, icon: Clock };
    return (
      <Badge variant={variant} className="gap-1 text-xs">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  if (authLoading || loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <Alert variant={notification.type === 'error' ? 'destructive' : 'default'}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      {/* Commission Banner */}
      <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0">
        <CardContent className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-white/80 font-medium">Earn 20% commission on all paid customers</p>
              <p className="text-lg font-bold mt-0.5">Start referring today and grow your earnings!</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => setShowSubmitModal(true)} className="gap-1.5 hidden sm:flex">
            <Plus className="h-4 w-4" />
            Submit Lead
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <IndianRupee className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats?.totalEarnings || 0)}</p>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <MousePointerClick className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalClicks || 0}</p>
                <p className="text-xs text-muted-foreground">Total Clicks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Target className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalLeads || 0}</p>
                <p className="text-xs text-muted-foreground">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                <TrendingUp className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.conversionRate?.toFixed(1) || '0.0'}%</p>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Link className="h-4 w-4" />
            Your Referral Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!stats?.referralCode ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                <Link className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium">No referral code found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Generate your referral code to start earning commissions
              </p>
              <Button className="mt-4" onClick={handleGenerateCode}>
                Generate Referral Code
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Referral Link</Label>
                <div className="flex gap-2">
                  <Input readOnly value={stats?.referralLink || ''} className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(stats?.referralLink || '', 'link')}
                  >
                    {copied === 'link' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Referral Code</Label>
                <div className="flex gap-2">
                  <Input readOnly value={stats?.referralCode || ''} className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(stats?.referralCode || '', 'code')}
                  >
                    {copied === 'code' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Referrals</CardTitle>
            <CardDescription>Latest 5 referrals</CardDescription>
          </div>
          {referrals.length > 5 && (
            <Button variant="ghost" size="sm" asChild>
              <a href="/affiliate/referrals" className="gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {referrals.length === 0 ? (
            <EmptyState icon={Users} message="No referrals yet" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.slice(0, 5).map((ref) => (
                  <TableRow key={ref.id}>
                    <TableCell className="font-medium">{ref.leadName}</TableCell>
                    <TableCell className="text-muted-foreground">{ref.leadEmail}</TableCell>
                    <TableCell>{getStatusBadge(ref.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(ref.createdAt)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {`\u20B9${(Number(ref.estimatedValue) || 0).toFixed(2)}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/affiliate/referrals'}>
          <CardContent className="p-5 flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Manage Referrals</p>
              <p className="text-xs text-muted-foreground">View all your submissions</p>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/affiliate/reports'}>
          <CardContent className="p-5 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-medium">View Reports</p>
              <p className="text-xs text-muted-foreground">Analyze your performance</p>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/affiliate/resources'}>
          <CardContent className="p-5 flex items-center gap-3">
            <Target className="h-5 w-5 text-violet-600" />
            <div>
              <p className="font-medium">Resources</p>
              <p className="text-xs text-muted-foreground">Marketing materials</p>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Submit Lead Modal */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Lead</DialogTitle>
            <DialogDescription>
              Enter the details below to submit a lead. Ensure all information is accurate for proper tracking.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div className="space-y-2">
              <Label>Lead&apos;s Name *</Label>
              <Input
                required
                value={submitForm.leadName}
                onChange={(e) => setSubmitForm({ ...submitForm, leadName: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Email *</Label>
              <Input
                type="email"
                required
                value={submitForm.leadEmail}
                onChange={(e) => setSubmitForm({ ...submitForm, leadEmail: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Estimated Deal Size (₹) *</Label>
              <Input
                type="number"
                required
                value={submitForm.estimatedValue}
                onChange={(e) => setSubmitForm({ ...submitForm, estimatedValue: e.target.value })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Type 0 if unsure</p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowSubmitModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitLoading}>
                {submitLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Lead
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-10 w-10 text-muted-foreground/40 mb-3" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div>
                  <Skeleton className="h-7 w-20 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
