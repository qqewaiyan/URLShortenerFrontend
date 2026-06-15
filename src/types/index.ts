export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export default interface ShortUrl {
  id: string;
  short_code: string;
  original_url: string;
  short_url: string;
  clicks: number;
  created_at: string;
  user_id: string;
}

export interface DashboardStats {
  totalUrls: number;
  totalClicks: number;
  recentUrls: ShortUrl[];
}
