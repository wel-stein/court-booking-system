import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/TopAppBar';
import { ProgressBar } from '../components/ProgressBar';
import { PriceCard } from '../components/PriceCard';
import { BottomActionBar } from '../components/BottomActionBar';
import { Icon } from '../components/Icon';
import { SkillLevelPicker } from '../components/SkillLevelPicker';
import { priceFor, useBooking } from '../state/BookingContext';
import { useInvites, type SkillLevel } from '../state/InvitesContext';
import { addMinutes, courts, formatDuration } from '../data/courts';

export function BookingSummary() {
  const navigate = useNavigate();
  const {
    selectedCourtId,
    selectedDate,
    startTime,
    durationMins,
    wantsShareInvite,
    setWantsShareInvite,
    invitePlayerCount,
    setInvitePlayerCount,
    inviteNotes,
    setInviteNotes,
    inviteSkillLevel,
    setInviteSkillLevel,
    markInviteCreated,
  } = useBooking();
  const { createInvite } = useInvites();

  useEffect(() => {
    if (!selectedCourtId) navigate('/courts', { replace: true });
  }, [selectedCourtId, navigate]);

  const court = courts.find((c) => c.id === selectedCourtId);
  const endTime = addMinutes(startTime, durationMins);
  const total = priceFor(court, durationMins);

  const handleConfirm = () => {
    if (wantsShareInvite && court && selectedDate) {
      const invite = createInvite({
        courtName: court.name,
        courtType: court.type,
        dateIso: selectedDate.iso,
        dateLabel: selectedDate.fullLabel,
        startTime,
        endTime,
        durationMins,
        totalPlayers: invitePlayerCount,
        skillLevel: inviteSkillLevel,
        notes: inviteNotes.trim() || undefined,
      });
      markInviteCreated(invite.id);
    } else {
      markInviteCreated(null);
    }
    navigate('/receipt');
  };

  return (
    <div className="min-h-dvh bg-surface pb-36 text-on-surface">
      <TopAppBar title="Booking Summary" />
      <ProgressBar step={3} />
      <main className="mx-auto max-w-screen-sm space-y-md px-container-padding pt-20">
        <div className="group relative mb-lg aspect-[16/9] w-full overflow-hidden rounded-xl shadow-lg">
          <img
            alt="Court"
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
          <div className="absolute bottom-md left-md">
            <span className="mb-xs inline-block rounded-full bg-secondary-container px-2 py-1 font-label text-label-sm text-on-secondary-container">
              {court?.type.toUpperCase() ?? 'PREMIUM COURT'}
            </span>
            <h2 className="font-headline text-headline-md text-white">
              {court?.name} - {court?.type}
            </h2>
          </div>
        </div>

        <section className="mb-lg space-y-md">
          <h3 className="font-headline text-headline-md text-primary">Booking Details</h3>
          <div className="grid grid-cols-1 gap-base rounded-xl border border-outline-variant/20 bg-surface-container p-md shadow-sm">
            <DetailRow label="Court" value={`${court?.name} - ${court?.type}`} />
            <DetailRow label="Date" value={selectedDate?.fullLabel ?? ''} />
            <DetailRow label="Time" value={`${startTime} - ${endTime}`} />
            <DetailRow label="Duration" value={formatDuration(durationMins)} last />
          </div>
        </section>

        <ShareInviteSection
          enabled={wantsShareInvite}
          onToggle={setWantsShareInvite}
          playerCount={invitePlayerCount}
          onChangePlayerCount={setInvitePlayerCount}
          skillLevel={inviteSkillLevel}
          onChangeSkillLevel={setInviteSkillLevel}
          notes={inviteNotes}
          onChangeNotes={setInviteNotes}
        />

        <PriceCard
          title="Pricing Breakdown"
          subtitle="Total"
          total={total}
          caption={`Base Rate: $${(court?.ratePer30Min ?? 12).toFixed(2)} / 30 mins`}
          footnotes={[
            { icon: 'info', label: 'Includes court rental & amenities' },
            { icon: 'bolt', label: 'Instant confirmation active' },
          ]}
        />
      </main>

      <BottomActionBar caption="Selected Window" primaryText={`${startTime} - ${endTime}`}>
        <button
          onClick={handleConfirm}
          className="flex items-center gap-sm rounded-xl bg-secondary-fixed px-xl py-md font-label text-label-lg font-bold text-on-secondary-fixed shadow-elevated transition-all hover:bg-secondary-fixed-dim active:scale-95"
        >
          <span>Confirm &amp; Pay</span>
          <Icon name="arrow_forward" />
        </button>
      </BottomActionBar>
    </div>
  );
}

function ShareInviteSection({
  enabled,
  onToggle,
  playerCount,
  onChangePlayerCount,
  skillLevel,
  onChangeSkillLevel,
  notes,
  onChangeNotes,
}: {
  enabled: boolean;
  onToggle: (v: boolean) => void;
  playerCount: number;
  onChangePlayerCount: (n: number) => void;
  skillLevel: SkillLevel;
  onChangeSkillLevel: (s: SkillLevel) => void;
  notes: string;
  onChangeNotes: (s: string) => void;
}) {
  const slotsLeft = Math.max(0, playerCount - 1);
  return (
    <section className="space-y-md">
      <div
        className={`overflow-hidden rounded-xl border bg-surface-container-lowest shadow-elevated transition-colors ${
          enabled ? 'border-primary/40' : 'border-outline-variant/20'
        }`}
      >
        <div className="flex items-start gap-md p-md">
          <span
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
              enabled ? 'bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container'
            }`}
          >
            <Icon name="groups" filled={enabled} />
          </span>
          <div className="flex-1">
            <p className="font-headline text-headline-md leading-tight text-primary">
              Open this slot to others
            </p>
            <p className="font-label text-label-sm text-on-surface-variant">
              Post your booking to Find Partner. Players can join until the court is full.
            </p>
          </div>
          <button
            onClick={() => onToggle(!enabled)}
            role="switch"
            aria-checked={enabled}
            className={`relative inline-flex h-8 w-14 flex-shrink-0 rounded-full transition-colors ${
              enabled ? 'bg-primary' : 'bg-outline-variant'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-7 w-7 rounded-full bg-white shadow-md transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {enabled && (
          <div className="space-y-md border-t border-outline-variant/30 p-md">
            <div>
              <div className="mb-sm flex items-center justify-between">
                <p className="font-label text-label-lg text-primary">Total players</p>
                <span className="rounded-full bg-secondary-fixed px-3 py-0.5 font-label text-label-sm font-bold text-on-secondary-fixed">
                  {slotsLeft} slot{slotsLeft === 1 ? '' : 's'} open
                </span>
              </div>
              <div className="flex items-center gap-sm">
                <button
                  onClick={() => onChangePlayerCount(Math.max(2, playerCount - 1))}
                  disabled={playerCount <= 2}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/40 bg-white text-primary shadow-elevated transition active:scale-90 disabled:opacity-40"
                  aria-label="decrease"
                >
                  <Icon name="remove" />
                </button>
                <div className="flex flex-1 items-center justify-center rounded-md bg-surface-container py-sm">
                  <span className="font-display text-headline-md text-primary">{playerCount}</span>
                  <span className="ml-xs font-label text-label-sm text-on-surface-variant">
                    players incl. you
                  </span>
                </div>
                <button
                  onClick={() => onChangePlayerCount(Math.min(6, playerCount + 1))}
                  disabled={playerCount >= 6}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/40 bg-white text-primary shadow-elevated transition active:scale-90 disabled:opacity-40"
                  aria-label="increase"
                >
                  <Icon name="add" />
                </button>
              </div>
            </div>

            <SkillLevelPicker value={skillLevel} onChange={onChangeSkillLevel} />

            <label className="block">
              <p className="mb-xs font-label text-label-lg text-primary">Note for joiners (optional)</p>
              <textarea
                value={notes}
                onChange={(e) => onChangeNotes(e.target.value)}
                maxLength={140}
                rows={2}
                placeholder="e.g. casual doubles, bring water"
                className="w-full resize-none rounded-md border border-outline-variant bg-white px-sm py-sm font-body text-body-md text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <p className="mt-xs text-right font-label text-label-sm text-outline">
                {notes.length}/140
              </p>
            </label>

            <p className="flex items-center gap-xs font-label text-label-sm text-on-surface-variant">
              <Icon name="lock_open" className="text-base text-primary" />
              Stops accepting new players once {playerCount} have joined.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-xs ${
        last ? '' : 'border-b border-outline-variant/30'
      }`}
    >
      <span className="font-label text-label-lg text-on-surface-variant">{label}</span>
      <span className="font-bold text-primary">{value}</span>
    </div>
  );
}
