'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author?: string;
  category?: string;
  image?: string;
}

interface CardSmallProps {
  news?: NewsItem;
  onDetailsClick: (news: NewsItem) => void;
}

const defaultNews: NewsItem = {
  id: '1',
  title: 'Breaking News',
  description: 'Stay updated with the latest news and announcements',
  content: 'This is the full content of the news article. Click details to read more about this important update.',
  date: new Date().toLocaleDateString(),
  author: 'News Team',
  category: 'General'
};

export function CardSmall({ news = defaultNews, onDetailsClick }: CardSmallProps) {
  
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      {news.image && (
        <div className="relative w-full h-40 bg-muted">
          <img src="/news-1.jpg"
            alt={news.title}
            className="w-full h-full object-cover"/>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
        <CardDescription className="text-xs">{news.date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80 line-clamp-2 mb-4">{news.description}</p>
        {news.category && (
          <span className="inline-block bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs mb-4">
            {news.category}
          </span>
        )}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDetailsClick(news)}
          className="w-full"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
