import React from 'react';
import { Box, Typography } from '@mui/material';

const NexusLogo = ({ size = 'medium', variant = 'full', color = 'primary', ...props }) => {
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
    dark: '#1a1a1a'
  };

  const currentColor = colors[color] || colors.primary;

  const LogoIcon = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke={currentColor}
        strokeWidth="3"
        fill="none"
        opacity="0.3"
      />
      
      {/* Inner connection nodes */}
      <circle cx="30" cy="30" r="6" fill={currentColor} />
      <circle cx="70" cy="30" r="6" fill={currentColor} />
      <circle cx="30" cy="70" r="6" fill={currentColor} />
      <circle cx="70" cy="70" r="6" fill={currentColor} />
      <circle cx="50" cy="50" r="8" fill={currentColor} />
      
      {/* Connection lines */}
      <line x1="30" y1="30" x2="50" y2="50" stroke={currentColor} strokeWidth="2" />
      <line x1="70" y1="30" x2="50" y2="50" stroke={currentColor} strokeWidth="2" />
      <line x1="30" y1="70" x2="50" y2="50" stroke={currentColor} strokeWidth="2" />
      <line x1="70" y1="70" x2="50" y2="50" stroke={currentColor} strokeWidth="2" />
      
      {/* Pulse animation dots */}
      <circle cx="30" cy="30" r="2" fill={currentColor} opacity="0.7">
        <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="70" cy="30" r="2" fill={currentColor} opacity="0.7">
        <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="0.5s" />
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </circle>
      <circle cx="30" cy="70" r="2" fill={currentColor} opacity="0.7">
        <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" begin="1s" />
      </circle>
      <circle cx="70" cy="70" r="2" fill={currentColor} opacity="0.7">
        <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="1.5s" />
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" begin="1.5s" />
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
            letterSpacing: '0.5px'
          }}
        >
          Nexus
        </Typography>
      )}
    </Box>
  );
};

export default NexusLogo; 