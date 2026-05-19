import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { priceFor, useBooking } from '../state/BookingContext';
import { addMinutes, courts } from '../data/courts';

const CONFETTI_COLORS = ['#003426', '#4e6359', '#d6ec00', '#99d3ba'];

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const pieces: {
      x: number;
      y: number;
      rotation: number;
      size: number;
      color: string;
      speed: number;
      drift: number;
    }[] = [];

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 4,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        speed: Math.random() * 3 + 2,
        drift: Math.random() - 0.5,
      });
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.y += p.speed;
        p.x += p.drift;
        p.rotation += p.speed;
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
        ctx.restore();
      });
      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}

export function Receipt() {
  const navigate = useNavigate();
  const { selectedCourtId, selectedDate, startTime, durationMins, receiptId, reset } = useBooking();
  const court = courts.find((c) => c.id === selectedCourtId);
  const total = priceFor(court, durationMins);
  const endTime = addMinutes(startTime, durationMins);

  return (
    <div className="relative flex min-h-dvh flex-col items-center bg-surface text-on-surface antialiased">
      <Confetti />
      <main className="relative z-10 flex w-full max-w-md flex-grow flex-col px-container-padding py-xl">
        <section className="mb-xl flex flex-col items-center text-center">
          <div className="mb-md flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-secondary-container">
            <Icon name="check_circle" filled className="text-4xl text-on-secondary-container" />
          </div>
          <h1 className="mb-xs font-headline text-headline-md text-primary">Booking Confirmed!</h1>
          <p className="font-body text-body-md text-on-surface-variant">
            Your court is ready for action. See you there!
          </p>
        </section>

        <section className="relative mb-xl flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-receipt">
          <div className="h-2 w-full bg-secondary" />
          <div className="p-lg">
            <div className="mb-lg flex items-center justify-between">
              <span className="font-headline text-headline-md font-bold text-primary">AcePoint</span>
              <span className="rounded-full bg-surface-container px-3 py-1 font-label text-label-sm uppercase tracking-wider text-outline">
                Receipt #{receiptId}
              </span>
            </div>

            <div className="mb-xl grid grid-cols-2 gap-y-lg">
              <ReceiptField label="Court" value={court?.name ?? ''} primary />
              <ReceiptField label="Date" value={selectedDate?.fullLabel ?? ''} />
              <ReceiptField label="Time Slot" value={`${startTime} - ${endTime}`} />
              <ReceiptField label="Duration" value={`${durationMins} Minutes`} />
            </div>

            <div className="relative mb-lg border-t border-dashed border-outline-variant">
              <div className="absolute -left-lg -top-2 h-4 w-4 rounded-full bg-surface" />
              <div className="absolute -right-lg -top-2 h-4 w-4 rounded-full bg-surface" />
            </div>

            <div className="flex flex-col items-center gap-md">
              <div className="mb-md flex w-full items-center justify-between">
                <span className="font-body text-body-lg font-semibold text-on-surface">Total Paid</span>
                <span className="font-display text-display-lg text-primary">${total.toFixed(2)}</span>
              </div>
              <div className="flex w-full flex-col items-center rounded-xl bg-surface-container p-md">
                <div className="mb-sm rounded-md bg-white p-2">
                  <QrPlaceholder seed={receiptId} />
                </div>
                <span className="font-label text-label-sm font-bold uppercase text-primary">
                  Scan for Entry
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-sm">
          <button className="flex w-full items-center justify-center gap-xs rounded-xl bg-secondary-container py-md font-label text-label-lg text-on-secondary-container shadow-sm transition-all duration-200 hover:bg-secondary hover:text-on-secondary active:scale-95">
            <Icon name="calendar_add_on" />
            Add to Calendar
          </button>
          <button
            onClick={() => {
              reset();
              navigate('/');
            }}
            className="flex w-full items-center justify-center gap-xs rounded-xl bg-primary py-md font-label text-label-lg text-on-primary shadow-sm transition-all duration-200 hover:bg-primary-container active:scale-95"
          >
            <Icon name="home" />
            Back to Home
          </button>
        </section>

        <p className="mt-xl text-center font-label text-label-sm text-outline">
          Need help? Contact{' '}
          <a className="font-bold text-primary underline" href="#">
            Support
          </a>
        </p>
      </main>
    </div>
  );
}

function ReceiptField({
  label,
  value,
  primary = false,
}: {
  label: string;
  value: string;
  primary?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="mb-xs font-label text-label-sm uppercase text-outline">{label}</span>
      <span
        className={
          primary
            ? 'font-headline text-headline-md text-primary'
            : 'font-body text-body-md font-semibold'
        }
      >
        {value}
      </span>
    </div>
  );
}

function QrPlaceholder({ seed }: { seed: string }) {
  // Deterministic 8x8 pseudo-QR pattern derived from the seed string
  const size = 8;
  const cells: boolean[] = [];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = 0; i < size * size; i++) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    cells.push((hash & 1) === 1);
  }
  return (
    <div
      className="grid h-32 w-32 gap-[2px]"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      aria-label="Entry QR code"
    >
      {cells.map((on, i) => (
        <div key={i} className={on ? 'bg-on-surface' : 'bg-white'} />
      ))}
    </div>
  );
}
