import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type  ShortUrl  from '../types';
import { mockUrls } from '../lib/constants';

interface UrlContextType {
  urls: ShortUrl[];
  addUrl: (originalUrl: string) => Promise<ShortUrl>;
  deleteUrl: (id: string) => Promise<void>;
  getUrlByCode: (shortCode: string) => ShortUrl | undefined;
  getTotalClicks: () => number;
}

const UrlContext = createContext<UrlContextType | undefined>(undefined);

function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function UrlProvider({ children }: { children: ReactNode }) {
  const [urls, setUrls] = useState<ShortUrl[]>(mockUrls);

  const addUrl = async (originalUrl: string): Promise<ShortUrl> => {
    const shortCode = generateShortCode();
    const newUrl: ShortUrl = {
      id: Date.now().toString(),
      short_code: shortCode,
      short_url: `https://shortify.link/${shortCode}`,
      original_url: originalUrl,
      clicks: 0,
      created_at: new Date().toISOString(),
      user_id: '1',
    };
    setUrls((prev) => [newUrl, ...prev]);
    return newUrl;
  };

  const deleteUrl = async (id: string) => {
    setUrls((prev) => prev.filter((url) => url.id !== id));
  };

  const getUrlByCode = (shortCode: string) => {
    return urls.find((url) => url.short_code === shortCode);
  };

  const getTotalClicks = () => {
    return urls.reduce((sum, url) => sum + url.clicks, 0);
  };

  return (
    <UrlContext.Provider value={{ urls, addUrl, deleteUrl, getUrlByCode, getTotalClicks }}>
      {children}
    </UrlContext.Provider>
  );
}

export function useUrls() {
  const context = useContext(UrlContext);
  if (context === undefined) {
    throw new Error('useUrls must be used within a UrlProvider');
  }
  return context;
}
