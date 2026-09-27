import React from 'react';
import { LangProvider } from '@/lib/i18n';
import Game from './pages/Game';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <LangProvider>
        <Game />
      </LangProvider>
    </ErrorBoundary>
  );
}

export default App;
