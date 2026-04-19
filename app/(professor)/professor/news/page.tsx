'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CardSmall, type NewsItem } from '../../components/newsCard';

// Sample news data - replace with real data from your API/database
const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Répartition des groupes',
    description: 'Distribution of student groups announcement',
    content: 'The card component supports a size prop that can be set to "sm" for a more compact appearance. Groups have been distributed as per the latest academic guidelines. All students have been organized into their designated groups based on their academic performance, preferences, and course selections. Group leaders have been appointed and notifications have been sent to all students.',
    date: '(29/03/2026)',
    author: 'Admin Team',
    category: 'General',
    image: '/news-1.jpg'
  },
  {
    id: '2',
    title: 'New Campus Facilities Opened',
    description: 'State-of-the-art learning center and sports complex now available for all students',
    content: 'The university is proud to announce the opening of our new world-class facilities. The modern learning center features advanced technology labs, collaborative study spaces, and a comprehensive library. The sports complex includes Olympic-standard facilities for various sports. These facilities are now available for all registered students to use during designated hours.',
    date: 'March 15, 2024',
    author: 'Admin Team',
    category: 'Campus News',
    image: '/news-2.jpg'
  },
  {
    id: '3',
    title: 'Scholarship Applications Now Open',
    description: 'Apply now for merit-based and need-based scholarships for the next academic year',
    content: 'Scholarship applications for the 2024-2025 academic year are now open. We offer various scholarships including merit-based awards, need-based financial aid, and special scholarships for specific fields of study. The application deadline is April 30, 2024. Interested students can submit their applications through the student portal with required documents.',
    date: 'March 10, 2024',
    author: 'Financial Aid Office',
    category: 'Scholarships',
    image: '/news-3.jpg'
  },
  {
    id: '4',
    title: 'Internship Program Success Stories',
    description: 'Read how our students are excelling in their internship placements',
    content: 'This semester, 95% of our students secured internship placements with leading companies. Our internship program continues to provide valuable real-world experience and help students build professional networks. Success stories include placements at Fortune 500 companies, startups, and government organizations across various sectors.',
    date: 'March 5, 2024',
    author: 'Career Services',
    category: 'Student Success',
    image: '/news-4.jpg'
  },
  {
    id: '5',
    title: 'Upcoming Seminar on AI and Machine Learning',
    description: 'Join us for an interactive workshop with industry experts',
    content: 'We are hosting a comprehensive seminar on artificial intelligence and machine learning. Industry experts will share insights on emerging technologies, career opportunities, and hands-on applications. This seminar is open to all students and will be held on March 25, 2024 in the Main Auditorium from 10 AM to 4 PM.',
    date: 'March 1, 2024',
    author: 'Tech Department',
    category: 'Events',
    image: '/news-5.jpg'
  }
];

export default function NewsPage() {
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  
  const selectedNews = newsItems.find(n => n.id === selectedNewsId);

  const handleDetailsClick = (news: NewsItem) => {
    setSelectedNewsId(news.id);
  };

  const handleBackClick = () => {
    setSelectedNewsId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {!selectedNewsId ? (
        // News List View
        <div className="p-5">
          <header className="mb-8 flex items-center gap-4">
            <Link
              href="/professor-dashboard"
              className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">News</h1>
            </div>
          </header>
          
          <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
            {newsItems.map((news) => (
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
                    src="/news-1.jpg"
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
                  
                  {selectedNews.category && (
                    <span className="inline-block bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium w-fit">
                      {selectedNews.category}
                    </span>
                  )}
                </div>

                <hr className="border-border" />
              </div>

              {/* Article Description */}
              <div className="mb-8">
                <p className="text-lg text-foreground/80 font-medium mb-4">
                  {selectedNews.description}
                </p>
              </div>

              {/* Article Content */}
              <div className="prose prose-base max-w-none dark:prose-invert">
                <p className="text-foreground/90 leading-relaxed text-lg">
                  {selectedNews.content}
                </p>
              </div>

              {/* Back Button */}
              {/* <div className="mt-12 pt-8 border-t border-border">
                <button
                  onClick={handleBackClick}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium"
                >
                  <ArrowLeft className="size-5" />
                  Back to News
                </button>
              </div> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
