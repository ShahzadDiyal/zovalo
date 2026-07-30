"use client";
import { useState } from "react";

interface SocialLink {
  name: string;
  icon: string;
  url: string;
  color: string;
  hoverColor: string;
  followers: string;
}

export default function SocialLinks() {
  const [showShare, setShowShare] = useState(false);

  // SVG Icons as strings for better performance
  const socialIcons = {
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.76-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    pinterest: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.244 3.768-5.489 0-2.87-2.063-4.876-5.008-4.876-3.414 0-5.42 2.558-5.42 5.198 0 1.03.394 2.133.889 2.734.098.119.112.223.083.342-.091.378-.293 1.191-.333 1.359-.052.217-.169.263-.393.158-1.45-.673-2.353-2.788-2.353-4.487 0-3.654 2.656-7.009 7.654-7.009 4.018 0 7.141 2.862 7.141 6.688 0 3.988-2.515 7.198-6.005 7.198-1.172 0-2.274-.609-2.65-1.329 0 0-.58 2.21-.721 2.751-.262.999-.967 2.248-1.441 3.011 1.081.333 2.233.511 3.426.511 6.607 0 11.974-5.367 11.974-11.987C23.991 5.367 18.624 0 12.017 0z"/></svg>`,
    share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`,
  };

  const socialLinks: SocialLink[] = [
    {
      name: "Facebook",
      icon: socialIcons.facebook,
      url: "https://www.facebook.com/profile.php?id=61591759840955",
      color: "bg-[#1877F2]",
      hoverColor: "hover:bg-[#1877F2]",
      followers: "2.5K",
    },
    {
      name: "Instagram",
      icon: socialIcons.instagram,
      url: "https://www.instagram.com/royalfurnituresstore",
      color: "bg-[#E4405F]",
      hoverColor: "hover:bg-[#E4405F]",
      followers: "1.8K",
    },
    {
      name: "TikTok",
      icon: socialIcons.tiktok,
      url: "https://www.tiktok.com/@royalfurnitures.store",
      color: "bg-[#010101]",
      hoverColor: "hover:bg-[#010101]",
      followers: "3.2K",
    },
    {
      name: "YouTube",
      icon: socialIcons.youtube,
      url: "https://www.youtube.com/@RoyalFurnituresstore",
      color: "bg-[#FF0000]",
      hoverColor: "hover:bg-[#FF0000]",
      followers: "1.2K",
    },
    {
      name: "Twitter/X",
      icon: socialIcons.twitter,
      url: "https://x.com/royalfurrniture",
      color: "bg-[#000000]",
      hoverColor: "hover:bg-[#000000]",
      followers: "2.1K",
    },
    {
      name: "LinkedIn",
      icon: socialIcons.linkedin,
      url: "https://www.linkedin.com/in/royalfurnituresstore",
      color: "bg-[#0A66C2]",
      hoverColor: "hover:bg-[#0A66C2]",
      followers: "856",
    },
    {
      name: "Pinterest",
      icon: socialIcons.pinterest,
      url: "https://www.pinterest.com/royalfurnituresstore/",
      color: "bg-[#E60023]",
      hoverColor: "hover:bg-[#E60023]",
      followers: "1.4K",
    },
  ];

  // Share links (first 6)
  const shareLinks = socialLinks.slice(0, 6);

  const handleShareClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-5">
      {/* Social Icons */}
      <div className="flex flex-wrap gap-2.5">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative p-2.5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${social.hoverColor} hover:border-transparent`}
            aria-label={`Follow Royal Furniture on ${social.name}`}
            title={`Follow us on ${social.name}`}
            onClick={(e) => {
              e.preventDefault();
              window.open(social.url, "_blank", "noopener,noreferrer");
            }}
          >
            <span
              className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300 block"
              dangerouslySetInnerHTML={{ __html: social.icon }}
            />

            {/* Tooltip */}
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[8px] font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              {social.name}
            </span>
          </a>
        ))}
      </div>

      {/* Share Button */}
      <div className="relative">
        {showShare && (
          <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 min-w-[180px] animate-fade-in">
            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Share on:
            </p>
            <div className="flex flex-wrap gap-2">
              {shareLinks.map((social) => (
                <button
                  key={social.name}
                  onClick={(e) => handleShareClick(e, social.url)}
                  className={`p-1.5 rounded ${social.color} text-white hover:opacity-80 transition-opacity`}
                  aria-label={`Share on ${social.name}`}
                >
                  <span
                    className="w-4 h-4 block"
                    dangerouslySetInnerHTML={{ __html: social.icon }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
