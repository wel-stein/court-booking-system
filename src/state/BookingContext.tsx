import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { buildUpcomingDates, type Court, type DateOption } from '../data/courts';
import type { SkillLevel } from './InvitesContext';

interface BookingState {
  dates: DateOption[];
  selectedDateIso: string;
  startTime: string;
  durationMins: number;
  selectedCourtId: number | null;
  receiptId: string;
  wantsShareInvite: boolean;
  invitePlayerCount: number;
  inviteNotes: string;
  inviteSkillLevel: SkillLevel;
  inviteCreatedId: string | null;
}

interface BookingActions {
  setSelectedDate: (iso: string) => void;
  setStartTime: (time: string) => void;
  setDuration: (mins: number) => void;
  selectCourt: (id: number | null) => void;
  setWantsShareInvite: (v: boolean) => void;
  setInvitePlayerCount: (n: number) => void;
  setInviteNotes: (s: string) => void;
  setInviteSkillLevel: (s: SkillLevel) => void;
  markInviteCreated: (id: string | null) => void;
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
  const [startTime, setStartTime] = useState('14:00');
  const [durationMins, setDuration] = useState(60);
  const [selectedCourtId, selectCourt] = useState<number | null>(null);
  const [receiptId, setReceiptId] = useState(randomReceiptId());
  const [wantsShareInvite, setWantsShareInvite] = useState(false);
  const [invitePlayerCount, setInvitePlayerCount] = useState(4);
  const [inviteNotes, setInviteNotes] = useState('');
  const [inviteSkillLevel, setInviteSkillLevel] = useState<SkillLevel>('Open');
  const [inviteCreatedId, setInviteCreatedId] = useState<string | null>(null);

  const value = useMemo<BookingContextValue>(
    () => ({
      dates: DEFAULT_DATES,
      selectedDateIso,
      startTime,
      durationMins,
      selectedCourtId,
      receiptId,
      wantsShareInvite,
      invitePlayerCount,
      inviteNotes,
      inviteSkillLevel,
      inviteCreatedId,
      selectedDate: DEFAULT_DATES.find((d) => d.iso === selectedDateIso),
      setSelectedDate: setSelectedDateIso,
      setStartTime,
      setDuration,
      selectCourt,
      setWantsShareInvite,
      setInvitePlayerCount,
      setInviteNotes,
      setInviteSkillLevel,
      markInviteCreated: setInviteCreatedId,
      reset: () => {
        setSelectedDateIso(DEFAULT_DATES[0].iso);
        setStartTime('14:00');
        setDuration(60);
        selectCourt(null);
        setReceiptId(randomReceiptId());
        setWantsShareInvite(false);
        setInvitePlayerCount(4);
        setInviteNotes('');
        setInviteSkillLevel('Open');
        setInviteCreatedId(null);
      },
    }),
    [
      selectedDateIso,
      startTime,
      durationMins,
      selectedCourtId,
      receiptId,
      wantsShareInvite,
      invitePlayerCount,
      inviteNotes,
      inviteSkillLevel,
      inviteCreatedId,
    ],
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
