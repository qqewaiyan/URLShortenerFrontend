import { useState } from 'react';
import { useUrls } from '../../contexts/UrlContext';
import { DashboardLayout } from '../layout/DashboardLayout';
import  Card  from '../ui/Card';
import  Button  from '../ui/Button';
import  Input  from '../ui/Input';
import  Modal   from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { Link2, Copy, ExternalLink, Trash2, Search, Plus, CheckCircle, MousePointer, Calendar, ArrowUpDown } from 'lucide-react';
import type  ShortUrl  from '../../types';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function UrlRow({ url, onCopy, onDelete, copiedId }: {
  url: ShortUrl;
  onCopy: (id: number, shortUrl: string) => void;
  onDelete: (id: number) => void;
  copiedId: number | null;
}) {
  return (
    <tr className="group hover:bg-brand-50/50 transition-colors">
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
            <Link2 className="w-5 h-5 text-brand-900" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-brand-900">{url.shortUrl}</span>
              <button
                onClick={() => onCopy(url.id, url.shortUrl)}
                className="p-1 text-brand-400 hover:text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Copy link"
              >
                {copiedId === url.id ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-sm text-brand-500 truncate max-w-xs">{url.shortCode}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="min-w-0 max-w-md">
          <a
            href={url.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-600 hover:text-brand-900 truncate block"
          >
            {url.originalUrl}
          </a>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <MousePointer className="w-4 h-4 text-brand-400" />
          <span className="text-sm font-medium text-brand-900">{url.clicks.toLocaleString()}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 text-sm text-brand-500">
          <Calendar className="w-4 h-4 text-brand-400" />
          {formatDate(url.createdAt)}
        </div>
      </td>
      <td className="py-4 pl-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <a
            href={url.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-brand-400 hover:text-brand-600 hover:bg-brand-100 rounded-lg transition-colors"
            title="Open original URL"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => onDelete(url.id)}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete URL"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function MyUrlsPage() {
  const { urls, addUrl, deleteUrl } = useUrls();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredUrls = urls
    .filter((url) =>
      url.shortUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleCopy = (id: number, shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    toast('Link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: number) => {
    await deleteUrl(id);
    setShowDeleteModal(null);
    toast('URL deleted successfully');
  };

  const handleCreateUrl = async () => {
    if (!newUrl) return;
    setLoading(true);
    await addUrl(newUrl);
    setNewUrl('');
    setLoading(false);
    setShowCreateModal(false);
    toast('Short link created successfully!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-900">My URLs</h1>
            <p className="text-brand-500 mt-1">{urls.length} links created</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            Create new link
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="p-4 border-b border-brand-200 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
              <Input
                type="text"
                placeholder="Search URLs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="whitespace-nowrap"
            >
              <ArrowUpDown className="w-4 h-4" />
              Date {sortOrder === 'asc' ? '(oldest)' : '(newest)'}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-200 bg-brand-50/50">
                  <th className="text-left py-3 pl-4 text-xs font-medium text-brand-500 uppercase tracking-wider">
                    Short URL
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-brand-500 uppercase tracking-wider">
                    Original URL
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-brand-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-brand-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="text-right py-3 pr-4 text-xs font-medium text-brand-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {filteredUrls.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Link2 className="w-12 h-12 text-brand-300 mb-4" />
                        <p className="text-brand-500 font-medium">No URLs found</p>
                        <p className="text-sm text-brand-400 mt-1">
                          {searchQuery ? 'Try a different search term' : 'Create your first short link'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUrls.map((url) => (
                    <UrlRow
                      key={url.id}
                      url={url}
                      onCopy={handleCopy}
                      onDelete={(id) => setShowDeleteModal(id)}
                      copiedId={copiedId}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredUrls.length > 0 && (
            <div className="p-4 border-t border-brand-200 bg-brand-50/50 text-sm text-brand-500">
              Showing {filteredUrls.length} of {urls.length} URLs
            </div>
          )}
        </Card>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create new short link">
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
      </Modal>

      <Modal isOpen={showDeleteModal !== null} onClose={() => setShowDeleteModal(null)} title="Delete URL">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-brand-900 mb-2">Delete this URL?</h3>
          <p className="text-sm text-brand-600 mb-6">
            This action cannot be undone. The short link will stop working immediately.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowDeleteModal(null)}>
              Cancel
            </Button>
            <Button variant="danger" className="flex-1" onClick={() => showDeleteModal && handleDelete(showDeleteModal)}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
