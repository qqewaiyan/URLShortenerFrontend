import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../layout/Header';
import  Button  from '../ui/Button';
import  Input  from '../ui/Input';
import { API_URL } from '../../lib/constants';
import { Link2, ArrowRight, BarChart3, Shield, Zap, Globe, Copy, CheckCircle } from 'lucide-react';

export function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<{ original: string; short: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

const handleShorten = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!url) return;

  setLoading(true);

  try {
    const response = await fetch(
      `${API_URL}/url/shorten`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: url,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to shorten URL");
    }

    const data = await response.json();

    setShortenedUrl({
      original: url,
      short: data.shortUrl, 
    });
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleCopy = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(`https://${shortenedUrl.short}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Create short links instantly. Our optimized infrastructure ensures your URLs redirect in milliseconds.',
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Track every click with comprehensive analytics. Know your audience and optimize your campaigns.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with SSL encryption. Your links are always safe and accessible.',
    },
    {
      icon: Globe,
      title: 'Global CDN',
      description: 'Distributed across 50+ locations worldwide. Fast redirects wherever your users are.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full text-brand-700 text-sm font-medium mb-8">
                <Link2 className="w-4 h-4" />
                Trusted by 500,000+ users
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-900 tracking-tight leading-tight">
                Transform long URLs into
                <span className="block mt-2">powerful short links</span>
              </h1>
              <p className="mt-6 text-lg text-brand-600 max-w-2xl mx-auto">
                Create memorable short links, track performance in real-time, and manage all your URLs in one beautiful dashboard.
              </p>

              <form onSubmit={handleShorten} className="mt-10 max-w-xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" /> 
                    <Input
                      type="url"
                      placeholder="Paste your long URL here..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="pl-12"
                      required
                    />
                  </div>
                  <Button type="submit" loading={loading} className="whitespace-nowrap">
                    Shorten URL
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </form>

              {shortenedUrl && (
                <div className="mt-8 max-w-xl mx-auto animate-slide-up">
                  <div className="bg-brand-50 rounded-xl p-6 border border-brand-200">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-brand-500 mb-1">Your short link</p>
                        <p className="text-lg font-semibold text-brand-900 truncate">
                          {shortenedUrl.short}
                        </p>
                      </div>
                      <Button onClick={handleCopy} variant="secondary" size="sm">
                        {copied ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="mt-3 text-xs text-brand-400 truncate">
                      Original: {shortenedUrl.original}
                    </p>
                    <div className="mt-4 pt-4 border-t border-brand-200 flex items-center justify-center">
                      <Button variant="ghost" onClick={() => navigate('/register')}>
                        Create an account to track this link
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <p className="mt-6 text-sm text-brand-400">
                Free to use. No credit card required.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 bg-brand-50" id="features">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-brand-900">Why choose Shortify?</h2>
              <p className="mt-4 text-brand-600 max-w-2xl mx-auto">
                Built for individuals and teams who want powerful link management without complexity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-xl p-6 border border-brand-200 shadow-soft hover:shadow-soft-lg transition-shadow duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-brand-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-brand-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
