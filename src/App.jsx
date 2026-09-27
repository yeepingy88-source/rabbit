import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { LangProvider } from '@/lib/i18n';
import ScrollToTop from './components/ScrollToTop';
import Game from './pages/Game';

function App() {
  const basename = import.meta.env.BASE_URL || '/';

  return (
    <LangProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router basename={basename}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Game />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </QueryClientProvider>
      </AuthProvider>
    </LangProvider>
  );
}

export default App;
