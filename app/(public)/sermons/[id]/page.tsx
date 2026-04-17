"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Play, Volume2, Calendar, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Sermon {
  _id: string; title: string; speaker: string; topic: string;
  date: string; videoUrl?: string; audioUrl?: string;
  description?: string; thumbnail?: string; views: number; tags?: string[];
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function SermonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/sermons/${id}`)
      .then((r) => r.json())
      .then((d) => { setSermon(d.sermon); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!sermon) return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center text-slate-400">
      Sermon not found.
    </div>
  );

  const embedUrl = sermon.videoUrl ? getYouTubeEmbedUrl(sermon.videoUrl) : null;

  return (
    <div className="min-h-screen bg-navy-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/sermons" className="inline-flex items-center gap-2 text-slate-400 hover:text-gold-400 transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Sermons
        </Link>

        {/* Video Embed */}
        {embedUrl ? (
          <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-black">
            <iframe
              src={embedUrl}
              title={sermon.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : sermon.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sermon.thumbnail} alt={sermon.title} className="w-full rounded-2xl mb-8 object-cover max-h-80" />
        ) : (
          <div className="rounded-2xl mb-8 h-64 gradient-navy flex items-center justify-center">
            <div className="w-20 h-20 gradient-gold rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
        )}

        {/* Info */}
        <div className="glass rounded-2xl p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-xs font-medium">{sermon.topic}</span>
            {sermon.tags?.map((t) => (
              <span key={t} className="px-3 py-1 glass text-slate-400 rounded-full text-xs">{t}</span>
            ))}
          </div>
          <h1 className="text-3xl font-black text-white mb-4">{sermon.title}</h1>
          <div className="flex flex-wrap gap-6 text-sm text-slate-400 mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gold-500" />
              {new Date(sermon.date).toLocaleDateString("en-NG", { dateStyle: "long" })}
            </span>
            <span>{sermon.speaker}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {sermon.views} views
            </span>
          </div>

          {sermon.description && (
            <p className="text-slate-300 leading-relaxed mb-6">{sermon.description}</p>
          )}

          {/* Audio player */}
          {sermon.audioUrl && (
            <div className="flex items-center gap-3 glass rounded-xl p-4">
              <Volume2 className="w-5 h-5 text-gold-400" />
              <audio controls src={sermon.audioUrl} className="flex-1" />
            </div>
          )}

          {/* External video link */}
          {sermon.videoUrl && !embedUrl && (
            <a
              href={sermon.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-gold rounded-xl font-semibold text-navy-950 hover:opacity-90 transition-opacity mt-4"
            >
              <Play className="w-4 h-4" /> Watch Sermon
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
