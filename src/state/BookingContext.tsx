import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { buildUpcomingDates, type Court, type DateOption } from '../data/courts';

interface BookingState {
  dates: DateOption[];
  selectedDateIso: string;
  startTime: string;
  durationMins: number;
  selectedCourtId: number | null;
  receiptId: string;
}

interface BookingActions {
  setSelectedDate: (iso: string) => void;
  setStartTime: (time: string) => void;
  setDuration: (mins: number) => void;
  selectCourt: (id: number | null) => void;
  reset: () => void;
}

interface BookingContextValue extends BookingState, BookingActions {
  selectedDate: DateOption | undefined;
}

const BookingContext = createContext<BookingContextValue | null>(null);

const DEFAULT_DATES = buildUpcomingDates(14);

function randomReceiptId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `ACE-${n}`;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedDateIso, setSelectedDateIso] = useState(DEFAULT_DATES[0].iso);
  const [startTime, setStartTime] = useState('09:00');
  const [durationMins, setDuration] = useState(60);
  const [selectedCourtId, selectCourt] = useState<number | null>(null);
  const [receiptId, setReceiptId] = useState(randomReceiptId());

  const value = useMemo<BookingContextValue>(
    () => ({
      dates: DEFAULT_DATES,
      selectedDateIso,
      startTime,
      durationMins,
      selectedCourtId,
      receiptId,
      selectedDate: DEFAULT_DATES.find((d) => d.iso === selectedDateIso),
      setSelectedDate: setSelectedDateIso,
      setStartTime,
      setDuration,
      selectCourt,
      reset: () => {
        setSelectedDateIso(DEFAULT_DATES[0].iso);
        setStartTime('09:00');
        setDuration(60);
        selectCourt(null);
        setReceiptId(randomReceiptId());
      },
    }),
    [selectedDateIso, startTime, durationMins, selectedCourtId, receiptId],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}

export function priceFor(court: Court | undefined, durationMins: number) {
  const rate = court?.ratePer30Min ?? 12;
  return (durationMins / 30) * rate;
}
