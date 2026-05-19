import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { ChooseTime } from './pages/ChooseTime';
import { SelectCourt } from './pages/SelectCourt';
import { BookingSummary } from './pages/BookingSummary';
import { Receipt } from './pages/Receipt';
import { Bookings } from './pages/Bookings';
import { ProShop } from './pages/ProShop';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { FindPartner } from './pages/FindPartner';

function App() {
  return (
    <div className="mx-auto min-h-dvh max-w-screen-sm bg-surface">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/book" element={<ChooseTime />} />
        <Route path="/courts" element={<SelectCourt />} />
        <Route path="/summary" element={<BookingSummary />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/shop" element={<ProShop />} />
        <Route path="/partners" element={<FindPartner />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
