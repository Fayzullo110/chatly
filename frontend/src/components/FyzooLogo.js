import React from 'react';
import { Box, Typography } from '@mui/material';

const FyzooLogo = ({ size = 'medium', variant = 'full', color = 'primary', ...props }) => {
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
    <img
      src="/images/fyzoo.png"
      alt="Fyzoo Logo"
      width={currentSize.width}
      height={currentSize.height}
      style={{
        objectFit: 'contain',
        filter: color === 'white' ? 'brightness(0) invert(1)' : 'none'
      }}
    />
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
          Fyzoo
        </Typography>
      )}
    </Box>
  );
};

export default FyzooLogo; 