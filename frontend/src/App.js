import React, { useMemo, Suspense } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { ThemeProviderCustom, useThemeMode } from './contexts/ThemeContext';
import MobileNav from './components/MobileNav';

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
            primary: { main: '#2196f3' },
            secondary: { main: '#f50057' },
            background: { default: '#2196f3', paper: '#fff' },
            text: { primary: '#111', secondary: '#333' },
          }
        : {
            primary: { main: '#2196f3' },
            secondary: { main: '#f50057' },
            background: { default: '#111', paper: '#222' },
            text: { primary: '#fff', secondary: '#eee' },
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
    },
  }), [resolvedMode]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<div style={{ padding: 32 }}>Loading...</div>}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <Router>
              <AppRoutes />
              <MobileNav />
            </Router>
          </AuthProvider>
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
