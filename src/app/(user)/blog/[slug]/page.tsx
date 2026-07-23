// src/app/(user)/blog/[slug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Tag,
  ChevronLeft,
  Eye,
  User,
  Clock,
  Share2,
  Heart,
  Sparkles,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';
import { blogService } from '../../../../services/blogService';
import { BlogPost } from '../../../../types';
import { SEO } from '../../../../components/SEO';
import { LoadingSpinner } from '../../../../components/ui/Loading';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const postData = await blogService.getPostBySlug(slug);
      if (postData) {
        setPost(postData);
        await blogService.incrementViews(postData.id);
        
        const related = await blogService.getRelatedPosts(
          postData.category,
          postData.id,
          3
        );
        setRelatedPosts(related);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load the article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-amber-600">
              Loading Article...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-serif text-neutral-900 mb-2">
            {error || 'Post Not Found'}
          </h2>
          <p className="text-neutral-500 mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <SEO
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt || post.content?.substring(0, 160)}
        image={post.featuredImage}
        article={{
          publishedTime: post.publishedAt?.toDate?.()?.toISOString(),
          modifiedTime: post.updatedAt?.toDate?.()?.toISOString(),
          author: post.author?.name,
          tags: post.tags,
        }}
        keywords={post.seoKeywords || post.tags}
        schema={{
          type: "BlogPost",
          data: { post }
        }}
      />

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <Link
            href={`/blog?category=${post.category}`}
            className="inline-block px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 hover:bg-amber-100 transition-colors"
          >
            {post.categoryName || 'Blog'}
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-neutral-900 leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author?.name || 'Royal Furniture'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {Math.ceil((post.content?.length || 0) / 1000)} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views || 0} views
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-neutral-100">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-900 prose-li:text-neutral-600 prose-blockquote:border-l-amber-500 prose-blockquote:bg-amber-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:border-l-4 prose-img:rounded-xl">
          <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-neutral-200/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-neutral-600">Tags:</span>
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/blog?search=${tag}`}
                  className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full hover:bg-neutral-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share & Like */}
        <div className="mt-8 pt-8 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isLiked
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-white border border-neutral-200/80 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-amber-600' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200/80 text-neutral-600 hover:bg-neutral-50 rounded-xl transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 rounded-xl transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Have Questions?
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-serif text-neutral-900 mb-6">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="group bg-white border border-neutral-200/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
                  {relatedPost.featuredImage ? (
                    <img
                      src={relatedPost.featuredImage}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🪑
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2 mt-1">
                    {relatedPost.excerpt || relatedPost.content?.substring(0, 100) + '...'}
                  </p>
                  <div className="mt-3 text-[10px] text-neutral-400">
                    {formatDate(relatedPost.publishedAt || relatedPost.createdAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}