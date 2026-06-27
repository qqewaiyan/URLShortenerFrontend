export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export default interface ShortUrl {
  id: number;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  
  clickCount: number;
  createdAt: string;
  userId: number;
}

export interface DashboardStats {
  totalUrls: number;
  totalClicks: number;
  recentUrls: ShortUrl[];
}
