import React, { useMemo, Suspense } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { ThemeProviderCustom, useThemeMode } from './contexts/ThemeContext';

// ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, color: 'red', background: '#fff' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function ThemedApp() {
  const { resolvedMode } = useThemeMode();
  const theme = useMemo(() => createTheme({
    palette: {
      mode: resolvedMode,
      ...(resolvedMode === 'light'
        ? {
            primary: { main: '#1976d2' },
            secondary: { main: '#f50057' },
            background: { default: '#f7fafd', paper: '#fff' },
            text: { primary: '#222', secondary: '#555' },
            divider: '#e3eafc',
            action: { hover: '#e3eafc', selected: '#e3eafc' },
          }
        : {
            primary: { main: '#90caf9' },
            secondary: { main: '#f48fb1' },
            background: { default: '#10151b', paper: '#232a36' },
            text: { primary: '#f5f5f5', secondary: '#b0b8c1' },
            divider: '#2c3442',
            action: { hover: '#232a36', selected: '#232a36' },
          }),
    },
    components: {
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            height: 70,
            paddingBottom: 8,
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            minWidth: 'auto',
            padding: '6px 12px 8px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  }), [resolvedMode]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<div style={{ padding: 32 }}>Loading...</div>}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ThemeProviderCustom>
      <ThemedApp />
    </ThemeProviderCustom>
  );
}

export default App;
