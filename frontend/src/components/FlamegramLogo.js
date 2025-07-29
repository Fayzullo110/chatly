import React from 'react';
import { Box, Typography } from '@mui/material';

const FlamegramLogo = ({ size = 'medium', variant = 'full', color = 'primary', ...props }) => {
  const sizes = {
    small: { width: 32, height: 32, fontSize: 14 },
    medium: { width: 48, height: 48, fontSize: 18 },
    large: { width: 64, height: 64, fontSize: 24 },
    xlarge: { width: 80, height: 80, fontSize: 32 }
  };

  const currentSize = sizes[size] || sizes.medium;

  const colors = {
    primary: '#2196f3',
    secondary: '#1976d2',
    white: '#ffffff',
    dark: '#1a1a1a',
    flame: {
      primary: '#2196f3',
      secondary: '#1976d2',
      accent: '#64b5f6',
      glow: '#1565c0'
    }
  };

  const currentColor = colors[color] || colors.flame.primary;

  const LogoIcon = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background glow */}
      <defs>
        <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.flame.glow} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={colors.flame.glow} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.flame.accent}/>
          <stop offset="50%" stopColor={colors.flame.primary}/>
          <stop offset="100%" stopColor={colors.flame.secondary}/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background glow circle */}
      <circle cx="50" cy="50" r="45" fill="url(#flameGlow)"/>
      
      {/* Main flame shape */}
      <path
        d="M35 70 Q50 20 65 70 Q50 60 35 70"
        fill="url(#flameGradient)"
        filter="url(#glow)"
      />
      
      {/* Inner flame highlight */}
      <path
        d="M40 65 Q50 25 60 65 Q50 55 40 65"
        fill={colors.flame.accent}
        opacity="0.8"
      />
      
      {/* Flame tip */}
      <ellipse cx="50" cy="25" rx="8" ry="12" fill={colors.flame.accent} opacity="0.9"/>
      
      {/* Chat message bubbles */}
      <rect x="20" y="30" width="12" height="8" rx="4" fill={colors.flame.secondary} opacity="0.8">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="68" y="30" width="12" height="8" rx="4" fill={colors.flame.secondary} opacity="0.8">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </rect>
      <rect x="20" y="50" width="12" height="8" rx="4" fill={colors.flame.secondary} opacity="0.8">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" begin="1s" />
      </rect>
      <rect x="68" y="50" width="12" height="8" rx="4" fill={colors.flame.secondary} opacity="0.8">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" begin="1.5s" />
      </rect>
      
      {/* Connection lines to flame */}
      <line x1="32" y1="34" x2="40" y2="50" stroke={colors.flame.secondary} strokeWidth="1.5" opacity="0.6"/>
      <line x1="68" y1="34" x2="60" y2="50" stroke={colors.flame.secondary} strokeWidth="1.5" opacity="0.6"/>
      <line x1="32" y1="54" x2="40" y2="60" stroke={colors.flame.secondary} strokeWidth="1.5" opacity="0.6"/>
      <line x1="68" y1="54" x2="60" y2="60" stroke={colors.flame.secondary} strokeWidth="1.5" opacity="0.6"/>
      
      {/* Chat dots inside message bubbles */}
      <circle cx="26" cy="34" r="1.5" fill="white" opacity="0.9"/>
      <circle cx="74" cy="34" r="1.5" fill="white" opacity="0.9"/>
      <circle cx="26" cy="54" r="1.5" fill="white" opacity="0.9"/>
      <circle cx="74" cy="54" r="1.5" fill="white" opacity="0.9"/>
      
      {/* Sparkle effects */}
      <circle cx="20" cy="25" r="1" fill={colors.flame.accent}>
        <animate attributeName="r" values="1;2;1" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="80" cy="30" r="1" fill={colors.flame.accent}>
        <animate attributeName="r" values="1;2;1" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
      </circle>
      <circle cx="15" cy="45" r="1" fill={colors.flame.accent}>
        <animate attributeName="r" values="1;2;1" dur="1.5s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" begin="1s" />
      </circle>
    </svg>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        ...props.sx
      }}
      {...props}
    >
      <LogoIcon />
      {variant === 'full' && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: currentColor,
            fontSize: currentSize.fontSize,
            letterSpacing: '0.5px',
            background: `linear-gradient(135deg, ${colors.flame.primary}, ${colors.flame.secondary})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(33, 150, 243, 0.3)'
          }}
        >
          Flamegram
        </Typography>
      )}
    </Box>
  );
};

export default FlamegramLogo; 