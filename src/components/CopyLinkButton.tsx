'use client';

import React, { useState } from 'react';

interface CopyLinkButtonProps {
  url?: string;
  label?: string;
  copiedLabel?: string;
}

export default function CopyLinkButton({
  url,
  label = 'Copiar Enlace',
  copiedLabel = '¡Enlace Copiado!'
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
      if (navigator.clipboard && targetUrl) {
        await navigator.clipboard.writeText(targetUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`share-btn copy-link-btn ${copied ? 'copied' : ''}`}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
    >
      {copied ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{copiedLabel}</span>
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
