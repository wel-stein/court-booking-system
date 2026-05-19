import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { ChooseTime } from './pages/ChooseTime';
import { SelectCourt } from './pages/SelectCourt';
import { BookingSummary } from './pages/BookingSummary';
import { Receipt } from './pages/Receipt';

function App() {
  return (
    <div className="mx-auto min-h-dvh max-w-screen-sm bg-surface">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<ChooseTime />} />
        <Route path="/courts" element={<SelectCourt />} />
        <Route path="/summary" element={<BookingSummary />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
