'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from 'lucide-react';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author?: string;
  image?: string;
  isPinned?: boolean;
}

interface CardSmallProps {
  news?: NewsItem;
  onDetailsClick: (news: NewsItem) => void;
}

const defaultNews: NewsItem = {
  id: '0',
  title: '',
  content: "",
  date: new Date().toLocaleDateString(),
  author: '',
};

export function CardSmall({ news = defaultNews, onDetailsClick }: CardSmallProps) {
  
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      {news.image && (
        <div className="relative w-full h-40 bg-muted">
          <img src={news.image}
            alt={news.title}
            className="w-full h-full object-cover"/>
        </div>
      )}
      <CardHeader>
        <div className='flex justify-between w-full'>
          <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
          {news.isPinned ? (
            <span className="ml-2 inline-block rounded bg-amber-600 px-2 py-1 text-xs text-primary-foreground">
              Pinned
            </span>) : null}
          </div>
        <CardDescription className="text-xs">{news.date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80 line-clamp-2 mb-4">{news.content}</p>
        
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
