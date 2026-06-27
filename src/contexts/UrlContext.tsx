import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type  ShortUrl  from '../types';
import { useAuth } from './AuthContext';
import apiClient from '../api/apiClient';

interface UrlContextType {
  urls: ShortUrl[];
  addUrl: (originalUrl: string) => Promise<ShortUrl>;
  deleteUrl: (id: number) => Promise<void>;
  getUrlByCode: (shortCode: string) => ShortUrl | undefined;
  getTotalClicks: () => number;
}

const UrlContext = createContext<UrlContextType | undefined>(undefined);


export function UrlProvider({ children }: { children: ReactNode }) {


  const { user } = useAuth();
  const [urls, setUrls] = useState<ShortUrl[]>([]);

  useEffect(() => {
  const loadUrls = async () => {
    if (!user?.id) return;

    try {
      const result = await apiClient.get(`/url/user/${user.id}`);
      const response = result.data;
      if (result.status !== 200) throw new Error("Error getting URLs");
      console.log(response)
      setUrls(response);
    } catch (err) {
      console.error(err);
      setUrls([]);
    }
  };

  loadUrls();
}, [user?.id]);

  const addUrl = async (originalUrl: string): Promise<ShortUrl> => {
  try {
    const result = await apiClient.post("/url/shorten", {
      original_url: originalUrl,
      user_id: user?.id,
    });
      const response = result.data;

    if (result.status !== 200) {
      throw new Error("Failed to create URL");
    }
    console.log(result);
    const newUrl: ShortUrl = response;

    setUrls((prev) => [newUrl, ...prev]);

    return newUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

  const deleteUrl = async (id: number) => {
  try {
    await apiClient.delete(`/url/${id}`);

    setUrls((prev) => prev.filter((url) => url.id !== id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

  const getUrlByCode = (shortCode: string) => {
    return urls.find((url) => url.shortCode === shortCode);
  };

  const getTotalClicks = () => {
    return urls.reduce((sum, url) => sum + url.clickCount, 0);
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
