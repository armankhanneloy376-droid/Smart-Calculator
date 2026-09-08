import React, { useState } from 'react';
import logoAsset from '../assets/images/smart_calculator_logo_1788864167909.jpg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'invoice';
  showSubtitle?: boolean;
  businessName?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  businessName,
  showText = true,
}) => {
  const [imgError, setImgError] = useState(false);

  // Vector fallback if image cannot be rendered
  if (imgError) {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <svg
          viewBox="0 0 120 120"
          className={
            size === 'sm'
              ? 'w-8 h-8 shrink-0'
              : size === 'lg'
              ? 'w-16 h-16 shrink-0'
              : size === 'invoice'
              ? 'w-13 h-13 shrink-0'
              : 'w-11 h-11 shrink-0'
          }
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Document Sheet behind */}
          <rect x="52" y="16" width="46" height="60" rx="6" fill="#F8FAFC" stroke="#0284C7" strokeWidth="3" />
          <line x1="62" y1="30" x2="88" y2="30" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          <line x1="62" y1="42" x2="88" y2="42" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          <line x1="62" y1="54" x2="80" y2="54" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />

          {/* Calculator Body */}
          <rect
            x="24"
            y="30"
            width="56"
            height="70"
            rx="12"
            fill="url(#calc-grad)"
            stroke="#1D4ED8"
            strokeWidth="3"
            transform="rotate(-5 24 30)"
          />
          {/* Screen */}
          <rect
            x="32"
            y="36"
            width="40"
            height="18"
            rx="4"
            fill="#EFF6FF"
            stroke="#93C5FD"
            strokeWidth="1.5"
            transform="rotate(-5 32 36)"
          />
          {/* Keypad Buttons */}
          <rect x="33" y="60" width="8" height="8" rx="2" fill="#FFFFFF" opacity="0.9" transform="rotate(-5 33 60)" />
          <rect x="45" y="59" width="8" height="8" rx="2" fill="#FFFFFF" opacity="0.9" transform="rotate(-5 45 59)" />
          <rect x="57" y="58" width="8" height="8" rx="2" fill="#22C55E" transform="rotate(-5 57 58)" />
          <rect x="34" y="72" width="8" height="8" rx="2" fill="#FFFFFF" opacity="0.9" transform="rotate(-5 34 72)" />
          <rect x="46" y="71" width="8" height="8" rx="2" fill="#FFFFFF" opacity="0.9" transform="rotate(-5 46 71)" />
          <rect x="58" y="70" width="8" height="8" rx="2" fill="#22C55E" transform="rotate(-5 58 70)" />

          {/* Ascending Green Growth Bars */}
          <rect x="74" y="68" width="6" height="18" rx="2" fill="#16A34A" />
          <rect x="83" y="58" width="6" height="28" rx="2" fill="#16A34A" />
          <rect x="92" y="48" width="6" height="38" rx="2" fill="#15803D" />

          {/* Upward Curved Growth Arrow */}
          <path
            d="M 20 85 C 35 110, 85 105, 102 44"
            stroke="url(#arrow-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <polygon points="104,36 109,49 97,46" fill="#16A34A" />

          <defs>
            <linearGradient id="calc-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="arrow-grad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
          </defs>
        </svg>

        {showText && (
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-blue-700 tracking-tight text-base sm:text-lg">
                {businessName ? businessName.split(' ')[0] : 'Smart'}
              </span>
              <span className="font-extrabold text-emerald-600 tracking-tight text-base sm:text-lg">
                {businessName ? businessName.split(' ').slice(1).join(' ') : 'Calculator'}
              </span>
            </div>
            {showSubtitle && (
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-normal mt-0.5">
                Cost & Payment Calculator
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Primary rendering using the provided asset logo image
  const sizeClasses = {
    sm: 'h-8 w-auto max-w-[130px]',
    md: 'h-10 sm:h-11 w-auto max-w-[170px]',
    lg: 'h-14 sm:h-16 w-auto max-w-[240px]',
    invoice: 'h-13 sm:h-14 w-auto max-w-[180px]',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="shrink-0 bg-white rounded-md p-0.5 border border-slate-200/70 shadow-2xs flex items-center justify-center">
        <img
          src={logoAsset || `${import.meta.env.BASE_URL}logo.png`}
          alt={businessName || 'Smart Calculator'}
          crossOrigin="anonymous"
          loading="eager"
          decoding="sync"
          onError={() => setImgError(true)}
          className={`object-contain rounded-xs block ${sizeClasses[size]}`}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 leading-tight">
            <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
              {businessName || 'Smart Calculator'}
            </span>
          </div>
          {showSubtitle && (
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-normal leading-none mt-0.5 hidden sm:block">
              Cost & Payment Settlement
            </p>
          )}
        </div>
      )}
    </div>
  );
};
