import { useState } from 'react';
import { useUrls } from '../../contexts/UrlContext';
import { DashboardLayout } from '../layout/DashboardLayout';
import  Card  from '../ui/Card';
import  Button  from '../ui/Button';
import  Input  from '../ui/Input';
import  Modal   from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { Link2, Link2Icon, MousePointer, Clock, ArrowRight, Copy, CheckCircle, ExternalLink, TrendingUp, Globe, MapPin } from 'lucide-react';
import { recentActivity } from '../../lib/constants';

function StatCard({ icon: Icon, title, value, subtitle }: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-brand-500">{title}</p>
          <p className="text-3xl font-bold text-brand-900 mt-2">{value}</p>
          <p className="text-sm text-brand-400 mt-1">{subtitle}</p>
        </div>
        <div className="p-3 bg-brand-100 rounded-xl">
          <Icon className="w-6 h-6 text-brand-900" />
        </div>
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const { urls, addUrl, getTotalClicks } = useUrls();
  const [showModal, setShowModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<{ short: string; original: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const recentUrls = urls.slice(0, 3);

  const handleCreateUrl = async () => {
    if (!newUrl) return;
    setLoading(true);
    const url = await addUrl(newUrl);
    setCreatedUrl({ short: url.shortUrl, original: url.originalUrl });
    setNewUrl('');
    setLoading(false);
  };

  const handleCopy = () => {
    if (createdUrl) {
      navigator.clipboard.writeText(createdUrl.short);
      setCopied(true);
      toast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-brand-900">Welcome back!</h1>
          <p className="text-brand-500 mt-1">Here's what's happening with your links.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Link2Icon}
            title="Total URLs"
            value={urls.length}
            subtitle="links created"
          />
          <StatCard
            icon={MousePointer}
            title="Total Clicks"
            value={getTotalClicks().toLocaleString()}
            subtitle="all time"
          />
          <StatCard
            icon={Clock}
            title="Avg. Clicks/URL"
            value={urls.length > 0 ? Math.round(getTotalClicks() / urls.length) : 0}
            subtitle="performance"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-brand-900">Recent URLs</h2>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = '/urls'}>
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-4">
                {recentUrls.map((url) => (
                  <div
                    key={url.id}
                    className="flex items-center justify-between p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link2Icon className="w-4 h-4 text-brand-400 flex-shrink-0" />
                        <span className="font-medium text-brand-900 truncate">{url.shortUrl}</span>
                      </div>
                      <p className="text-sm text-brand-500 truncate mt-1">{url.originalUrl}</p>
                    </div>
                    <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium text-brand-900">
                          <MousePointer className="w-4 h-4 text-brand-400" />
                          {url.clicks}
                        </div>
                      </div>
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-brand-400 hover:text-brand-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full mt-6"
                onClick={() => setShowModal(true)}
              >
                <Link2 className="w-4 h-4" />
                Create new short link
              </Button>
            </Card>
          </div>

          <div>
            <Card>
              <h2 className="text-lg font-semibold text-brand-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'click'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {activity.type === 'click' ? (
                        <MousePointer className="w-4 h-4" />
                      ) : (
                        <Link2 className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-brand-900">
                        {activity.type === 'click' ? 'Click on' : 'Created'}{' '}
                        <span className="font-medium">{activity.url}</span>
                      </p>
                      <div className="flex items-center gap-2 text-xs text-brand-400 mt-1">
                        <span>{activity.time}</span>
                        {activity.location && (
                          <>
                            <span>•</span>
                            <MapPin className="w-3 h-3" />
                            <span>{activity.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="mt-6">
              <h2 className="text-lg font-semibold text-brand-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-brand-600">
                    <Globe className="w-4 h-4" />
                    Top Countries
                  </div>
                  <span className="text-sm font-medium text-brand-900">US, UK, DE</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-brand-600">
                    <TrendingUp className="w-4 h-4" />
                    This Week
                  </div>
                  <span className="text-sm font-medium text-brand-900">+142 clicks</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setCreatedUrl(null); }} title="Create short link">
        {createdUrl ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-brand-900 mb-2">Link created!</h3>
            <div className="bg-brand-50 rounded-lg p-4 mb-4">
              <p className="text-lg font-medium text-brand-900">{createdUrl.short}</p>
              <p className="text-sm text-brand-500 truncate mt-1">{createdUrl.original}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={handleCopy}>
                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button className="flex-1" onClick={() => { setShowModal(false); setCreatedUrl(null); }}>
                Create another
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-brand-600 mb-4">Paste your long URL below to create a short link.</p>
            <div className="space-y-4">
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                <Input
                  type="url"
                  placeholder="https://example.com/very-long-url..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="pl-11"
                />
              </div>
              <Button className="w-full" loading={loading} onClick={handleCreateUrl}>
                Create short link
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
