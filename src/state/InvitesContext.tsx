import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type SkillLevel = 'Open' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';

export interface Invite {
  id: string;
  hostId: string;
  hostName: string;
  hostInitials: string;
  courtName: string;
  courtType: string;
  dateIso: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  durationMins: number;
  totalPlayers: number;
  joined: string[];
  skillLevel: SkillLevel;
  notes?: string;
  createdAt: number;
}

export interface CreateInviteInput {
  hostName?: string;
  hostInitials?: string;
  courtName: string;
  courtType: string;
  dateIso: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  durationMins: number;
  totalPlayers: number;
  skillLevel?: SkillLevel;
  notes?: string;
}

interface InvitesContextValue {
  invites: Invite[];
  currentUserId: string;
  createInvite: (input: CreateInviteInput) => Invite;
  joinInvite: (id: string) => void;
  leaveInvite: (id: string) => void;
  cancelInvite: (id: string) => void;
}

const InvitesContext = createContext<InvitesContextValue | null>(null);

const ME = 'me';

function isoOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function dateLabelFor(iso: string) {
  const d = new Date(iso);
  return `${WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const seed: Invite[] = [
  {
    id: 'inv-101',
    hostId: 'jordan',
    hostName: 'Jordan Lee',
    hostInitials: 'JL',
    courtName: 'Court 1',
    courtType: 'Premium PVC',
    dateIso: isoOffset(1),
    dateLabel: dateLabelFor(isoOffset(1)),
    startTime: '20:00',
    endTime: '21:00',
    durationMins: 60,
    totalPlayers: 4,
    joined: ['jordan', 'priya'],
    skillLevel: 'Intermediate',
    notes: 'Friendly doubles. Bringing extra shuttles.',
    createdAt: Date.now() - 60_000 * 30,
  },
  {
    id: 'inv-102',
    hostId: 'marcus',
    hostName: 'Marcus Tan',
    hostInitials: 'MT',
    courtName: 'Court 3',
    courtType: 'Premium PVC',
    dateIso: isoOffset(2),
    dateLabel: dateLabelFor(isoOffset(2)),
    startTime: '21:00',
    endTime: '22:30',
    durationMins: 90,
    totalPlayers: 2,
    joined: ['marcus'],
    skillLevel: 'Advanced',
    notes: 'Singles match, looking for someone competitive.',
    createdAt: Date.now() - 60_000 * 60 * 3,
  },
  {
    id: 'inv-103',
    hostId: 'aiden',
    hostName: 'Aiden Park',
    hostInitials: 'AP',
    courtName: 'Court 5',
    courtType: 'Wooden',
    dateIso: isoOffset(3),
    dateLabel: dateLabelFor(isoOffset(3)),
    startTime: '09:00',
    endTime: '10:00',
    durationMins: 60,
    totalPlayers: 4,
    joined: ['aiden', 'sara', 'nadia', 'maya'],
    skillLevel: 'Open',
    notes: 'Casual weekend doubles. All levels welcome.',
    createdAt: Date.now() - 60_000 * 60 * 24,
  },
  {
    id: 'inv-104',
    hostId: 'priya',
    hostName: 'Priya Raman',
    hostInitials: 'PR',
    courtName: 'Court 6',
    courtType: 'Wooden',
    dateIso: isoOffset(4),
    dateLabel: dateLabelFor(isoOffset(4)),
    startTime: '16:00',
    endTime: '17:00',
    durationMins: 60,
    totalPlayers: 3,
    joined: ['priya'],
    skillLevel: 'Beginner',
    notes: 'Working on basics; happy to coach newer players.',
    createdAt: Date.now() - 60_000 * 60 * 6,
  },
];

export function InvitesProvider({ children }: { children: ReactNode }) {
  const [invites, setInvites] = useState<Invite[]>(seed);

  const value = useMemo<InvitesContextValue>(
    () => ({
      invites,
      currentUserId: ME,
      createInvite: (input) => {
        const invite: Invite = {
          id: `inv-${Date.now()}`,
          hostId: ME,
          hostName: input.hostName ?? 'Alex Smith',
          hostInitials: input.hostInitials ?? 'AS',
          courtName: input.courtName,
          courtType: input.courtType,
          dateIso: input.dateIso,
          dateLabel: input.dateLabel,
          startTime: input.startTime,
          endTime: input.endTime,
          durationMins: input.durationMins,
          totalPlayers: input.totalPlayers,
          joined: [ME],
          skillLevel: input.skillLevel ?? 'Open',
          notes: input.notes,
          createdAt: Date.now(),
        };
        setInvites((list) => [invite, ...list]);
        return invite;
      },
      joinInvite: (id) =>
        setInvites((list) =>
          list.map((inv) => {
            if (inv.id !== id) return inv;
            if (inv.joined.includes(ME)) return inv;
            if (inv.joined.length >= inv.totalPlayers) return inv;
            return { ...inv, joined: [...inv.joined, ME] };
          }),
        ),
      leaveInvite: (id) =>
        setInvites((list) =>
          list.map((inv) => {
            if (inv.id !== id) return inv;
            if (inv.hostId === ME) return inv; // host can't leave; must cancel
            return { ...inv, joined: inv.joined.filter((p) => p !== ME) };
          }),
        ),
      cancelInvite: (id) =>
        setInvites((list) => list.filter((inv) => !(inv.id === id && inv.hostId === ME))),
    }),
    [invites],
  );

  return <InvitesContext.Provider value={value}>{children}</InvitesContext.Provider>;
}

export function useInvites() {
  const ctx = useContext(InvitesContext);
  if (!ctx) throw new Error('useInvites must be used inside InvitesProvider');
  return ctx;
}

export function inviteStatus(invite: Invite, currentUserId: string) {
  const isHost = invite.hostId === currentUserId;
  const isJoined = invite.joined.includes(currentUserId);
  const isFull = invite.joined.length >= invite.totalPlayers;
  return { isHost, isJoined, isFull };
}
