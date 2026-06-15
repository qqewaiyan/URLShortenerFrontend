export const APP_URL = 'https://shortify.link';
export const API_URL = 'https://urlshortenerapi-uylk.onrender.com/api'
export const mockUser = {
  id: '1',
  email: 'john@example.com',
  name: 'John Doe',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  created_at: '2024-01-15T10:30:00Z',
};

export const mockUrls = [
  {
    id: '1',
    short_code: 'demo123',
    short_url: 'https://shortify.link/demo123',
    original_url: 'https://www.example.com/very-long-url-that-needs-shortening/products/category/item',
    clicks: 1247,
    created_at: '2024-03-15T14:30:00Z',
    user_id: '1',
  },
  {
    id: '2',
    short_code: 'abc456',
    short_url: 'https://shortify.link/abc456',
    original_url: 'https://github.com/repository/awesome-project-with-long-name',
    clicks: 892,
    created_at: '2024-03-14T09:15:00Z',
    user_id: '1',
  },
  {
    id: '3',
    short_code: 'xyz789',
    short_url: 'https://shortify.link/xyz789',
    original_url: 'https://www.figma.com/file/design-system-components-library-v2',
    clicks: 2341,
    created_at: '2024-03-13T16:45:00Z',
    user_id: '1',
  },
  {
    id: '4',
    short_code: 'prod001',
    short_url: 'https://shortify.link/prod001',
    original_url: 'https://company.notion.site/Product-Roadmap-Q1-2024-internal-document',
    clicks: 567,
    created_at: '2024-03-12T11:20:00Z',
    user_id: '1',
  },
  {
    id: '5',
    short_code: 'tech22',
    short_url: 'https://shortify.link/tech22',
    original_url: 'https://techcrunch.com/article-about-startup-funding-and-growth-strategies',
    clicks: 1834,
    created_at: '2024-03-10T08:00:00Z',
    user_id: '1',
  },
  {
    id: '6',
    short_code: 'docs99',
    short_url: 'https://shortify.link/docs99',
    original_url: 'https://docs.google.com/document/d/long-id-string/edit?usp=sharing',
    clicks: 423,
    created_at: '2024-03-08T13:50:00Z',
    user_id: '1',
  },
];

export const recentActivity = [
  { type: 'click', url: 'demo123', time: '2 minutes ago', location: 'New York, US' },
  { type: 'click', url: 'abc456', time: '15 minutes ago', location: 'London, UK' },
  { type: 'create', url: 'new-url', time: '1 hour ago', location: null },
  { type: 'click', url: 'xyz789', time: '2 hours ago', location: 'Tokyo, JP' },
];
