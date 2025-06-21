'use client';

import { Twitter, Facebook, Linkedin } from 'lucide-react';
import { usePathname } from 'next/navigation';

const ShareButtons = ({ title }: { title: string }) => {
  const pathname = usePathname();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${pathname}`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  };

  return (
    <div className="flex items-center gap-4">
      <p className="font-semibold text-gray-700">Share this post:</p>
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><Twitter size={20} /></a>
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><Facebook size={20} /></a>
      <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><Linkedin size={20} /></a>
    </div>
  );
};

export default ShareButtons;
