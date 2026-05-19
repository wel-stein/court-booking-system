import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { BookingProvider } from './state/BookingContext.tsx';
import { InvitesProvider } from './state/InvitesContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <InvitesProvider>
        <BookingProvider>
          <App />
        </BookingProvider>
      </InvitesProvider>
    </HashRouter>
  </StrictMode>,
);
