'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CardSmall, type NewsItem } from '../components/newsCard';
import AppPageSkeleton from '@/components/skeletons/AppPageSkeleton';

type ApiNews = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  isPinned: boolean;
  targetGroup?: string | null;
  createdAt: string;
  author?: {
    firstName?: string;
    lastName?: string;
  };
};

const NEWS_URL =
  (process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/news`
    : null) ?? 'http://localhost:3002/news';

function formatAuthor(news: ApiNews) {
  const authorName = [news.author?.firstName, news.author?.lastName].filter(Boolean).join(' ');
  return authorName || 'Unknown author';
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchNews = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(NEWS_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!response.ok) {
          throw new Error(`Failed to load news (${response.status})`);
        }

        const data = (await response.json()) as ApiNews[];
        if (!isMounted) return;

        const mappedNews: NewsItem[] = (Array.isArray(data) ? data : []).map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          date: new Date(item.createdAt).toLocaleDateString(),
          author: formatAuthor(item),
          category: item.targetGroup ?? 'General',
          image: item.imageUrl ?? undefined,
          isPinned: item.isPinned,
        }));

        setNewsItems(mappedNews);
      } catch {
        if (!isMounted) return;
        setError('Could not load news right now.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNews();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedNewsItems = useMemo(
    () => [...newsItems].sort((a, b) => Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned))),
    [newsItems]
  );

  const selectedNews = newsItems.find(n => n.id === selectedNewsId);

  const handleDetailsClick = (news: NewsItem) => {
    setSelectedNewsId(news.id);
  };

  const handleBackClick = () => {
    setSelectedNewsId(null);
  };

  return (
    <>
    {loading ? <AppPageSkeleton/> : 
    <div className="min-h-screen bg-background">
      {!selectedNewsId ? (
        // News List View
        <div className="p-5">
          <header className="mb-8 flex items-center gap-4">
            <Link
              href="/student-dashboard"
              className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">News</h1>
            </div>
          </header>

          {loading ? <p className="text-sm text-muted-foreground">Loading news...</p> : null}
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {!loading && !error && newsItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No news available.</p>
          ) : null}

          <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
            {sortedNewsItems.map((news) => (
              <CardSmall
                key={news.id}
                news={news}
                onDetailsClick={handleDetailsClick}
              />
            ))}
          </div>
        </div>
      ) : (
        // Detailed News View
        <div className="p-5">
          <header className="mb-8 flex items-center gap-4">
            <button
              onClick={handleBackClick}
              className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">News Details</h1>
            </div>
          </header>

          {selectedNews && (
            <div className="max-w-4xl mx-auto">
              {/* Featured Image */}
              {selectedNews.image && (
                <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={selectedNews.image}
                    alt={selectedNews.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Article Metadata */}
              <div className="mb-6 flex flex-col gap-4">
                <h1 className="text-4xl font-bold text-foreground text-pretty">
                  {selectedNews.title}
                </h1>
                
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-foreground/60">Published on {selectedNews.date}</p>
                    {selectedNews.author && (
                      <p className="text-sm font-medium text-foreground">By {selectedNews.author}</p>
                    )}
                  </div>
                </div>

                <hr className="border-border" />
              </div>

              {/* Article Content */}
              <div className="prose prose-base max-w-none dark:prose-invert">
                <p className="text-foreground/90 leading-relaxed text-lg">
                  {selectedNews.content}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    }
    </>
  );
}
