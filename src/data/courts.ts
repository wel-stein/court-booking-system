export type CourtStatus = 'available' | 'booked' | 'maintenance';

export interface Court {
  id: number;
  name: string;
  type: string;
  amenities: string;
  status: CourtStatus;
  ratePer30Min: number;
}

export const courts: Court[] = [
  { id: 1, name: 'Court 1', type: 'Premium PVC', amenities: 'Indoor • A/C', status: 'available', ratePer30Min: 12 },
  { id: 2, name: 'Court 2', type: 'Professional', amenities: 'Reserved', status: 'booked', ratePer30Min: 14 },
  { id: 3, name: 'Court 3', type: 'Premium PVC', amenities: 'Indoor • A/C', status: 'available', ratePer30Min: 12 },
  { id: 4, name: 'Court 4', type: 'Maintenance', amenities: 'Under Repair', status: 'maintenance', ratePer30Min: 0 },
  { id: 5, name: 'Court 5', type: 'Wooden', amenities: 'Indoor • Fan', status: 'available', ratePer30Min: 10 },
  { id: 6, name: 'Court 6', type: 'Wooden', amenities: 'Indoor • Fan', status: 'available', ratePer30Min: 10 },
];

export interface TimeBand {
  id: 'morning' | 'afternoon' | 'evening';
  label: string;
  icon: string;
  hint: string;
  slots: string[];
}

export const timeBands: TimeBand[] = [
  {
    id: 'morning',
    label: 'Morning',
    icon: 'wb_sunny',
    hint: '8 AM – 1 PM',
    slots: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'],
  },
  {
    id: 'afternoon',
    label: 'Afternoon',
    icon: 'wb_twilight',
    hint: '2 PM – 5 PM',
    slots: ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
  },
  {
    id: 'evening',
    label: 'Evening',
    icon: 'nights_stay',
    hint: '8 PM – 12 AM',
    slots: ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
  },
];

export const timeSlots: string[] = timeBands.flatMap((b) => b.slots);

// Slots blocked across the venue at given start times
export const blockedSlots = new Set<string>(['11:00', '15:00', '22:00']);

export interface DateOption {
  iso: string;
  day: string;
  date: number;
  monthLabel: string;
  weekdayLong: string;
  fullLabel: string;
}

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function buildUpcomingDates(count = 14, start: Date = new Date()): DateOption[] {
  const result: DateOption[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    result.push({
      iso: d.toISOString().slice(0, 10),
      day: WEEKDAYS_SHORT[d.getDay()],
      date: d.getDate(),
      monthLabel: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
      weekdayLong: WEEKDAYS_LONG[d.getDay()],
      fullLabel: `${WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`,
    });
  }
  return result;
}

export function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  const eh = Math.floor((total % (24 * 60)) / 60);
  const em = total % 60;
  return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
}

export function formatDuration(mins: number, upper = false): string {
  if (mins <= 30) return upper ? `${mins} MINS` : `${mins} mins`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  const hourLabel = upper ? (hours === 1 ? 'HR' : 'HRS') : hours === 1 ? 'hr' : 'hrs';
  const minLabel = upper ? 'MINS' : 'mins';
  if (remaining === 0) return `${hours} ${hourLabel}`;
  return `${hours} ${hourLabel} ${remaining} ${minLabel}`;
}
