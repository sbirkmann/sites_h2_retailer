import React from 'react';

interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?:
  'default' |
  'bordered' |
  'outline' |
  'ghost' |
  'navy' |
  'outline-solid' |
  'pink' |
  'event' |
  'white' |
  'subtle' |
  'light-outline' |
  'light-glass' |
  'yellow-glass' |
  'live';
  size?: 'sm' | 'default';
  style?: React.CSSProperties;
}

export function SectionBadge({
  children,
  className = '',
  variant = 'default',
  size = 'default',
  style,
}: SectionBadgeProps) {
  const sizeClasses =
  size === 'sm' ?
  'text-[11px] sm:text-[12px] px-3 py-1' :
  'text-[14px] sm:text-[16px] px-4 py-1.5';

  const variantClasses =
  variant === 'bordered' ?
  'border border-[#173A57]' :
  variant === 'outline' ?
  'border border-[#FDF277]/30 bg-[#FDF277]/10 text-[#FDF277]' :
  variant === 'ghost' ?
  'bg-[#FDF277]/15 text-[#FDF277]' :
  variant === 'navy' ?
  'bg-[#173A57] text-white' :
  variant === 'outline-solid' ?
  'border border-[#FDF277] text-[#FDF277]' :
  variant === 'pink' ?
  'bg-[#FDF277] text-[#173A57]' :
  variant === 'event' ?
  'bg-[#173A57] text-[#FDF277] border border-[#FDF277]/40' :
  variant === 'white' ?
  'bg-white text-navy' :
  variant === 'subtle' ?
  'border border-[#173A57]/15 text-[#173A57]/70' :
  variant === 'light-outline' ?
  'border border-white/30 text-white' :
  variant === 'light-glass' ?
  'border border-white/25 bg-white/12 backdrop-blur-sm text-white' :
  variant === 'yellow-glass' ?
  'bg-[#FDF277]/95 backdrop-blur-sm text-[#173A57]' :
  variant === 'live' ?
  'bg-red-600 text-white' :
  '';

  const needsStyle =
  variant === 'default' || variant === 'bordered';

  return (
    <span
      className={`section-badge inline-flex w-fit items-center gap-1.5 self-start rounded-full font-bold uppercase ${sizeClasses} ${variantClasses} ${className}`}
      style={
        needsStyle ?
        { backgroundColor: '#FDF277', color: '#173A57', ...style } :
        style
      }>
      {children}
    </span>);

}
