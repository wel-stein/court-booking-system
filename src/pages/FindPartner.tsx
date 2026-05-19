import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';

type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
type PlayStyle = 'Singles' | 'Doubles' | 'Mixed';

interface Partner {
  id: string;
  name: string;
  initials: string;
  skill: SkillLevel;
  styles: PlayStyle[];
  availability: string;
  distanceKm: number;
  rating: number;
  matchPercent: number;
  bio: string;
}

const seed: Partner[] = [
  {
    id: 'p1',
    name: 'Jordan Lee',
    initials: 'JL',
    skill: 'Advanced',
    styles: ['Doubles', 'Mixed'],
    availability: 'Fri & Sat evenings',
    distanceKm: 1.2,
    rating: 4.8,
    matchPercent: 92,
    bio: 'Looking for a steady doubles partner for weekend ladder play.',
  },
  {
    id: 'p2',
    name: 'Priya Raman',
    initials: 'PR',
    skill: 'Intermediate',
    styles: ['Singles'],
    availability: 'Weekday mornings',
    distanceKm: 0.8,
    rating: 4.6,
    matchPercent: 87,
    bio: 'Casual singles, working on footwork and consistency.',
  },
  {
    id: 'p3',
    name: 'Marcus Tan',
    initials: 'MT',
    skill: 'Pro',
    styles: ['Singles', 'Doubles'],
    availability: 'Tue / Thu nights',
    distanceKm: 3.4,
    rating: 4.9,
    matchPercent: 81,
    bio: 'Ex-state player. Down to drill or play tournament-style.',
  },
  {
    id: 'p4',
    name: 'Sara Cohen',
    initials: 'SC',
    skill: 'Beginner',
    styles: ['Doubles'],
    availability: 'Sunday afternoons',
    distanceKm: 2.1,
    rating: 4.4,
    matchPercent: 74,
    bio: 'New to the sport. Looking for patient partners to learn with.',
  },
  {
    id: 'p5',
    name: 'Aiden Park',
    initials: 'AP',
    skill: 'Intermediate',
    styles: ['Doubles', 'Mixed'],
    availability: 'Anytime weekends',
    distanceKm: 0.5,
    rating: 4.7,
    matchPercent: 89,
    bio: 'Recreational doubles. Bring snacks, leave the ego at home.',
  },
  {
    id: 'p6',
    name: 'Nadia Hassan',
    initials: 'NH',
    skill: 'Advanced',
    styles: ['Singles', 'Mixed'],
    availability: 'Wed nights & Sat AM',
    distanceKm: 4.7,
    rating: 4.8,
    matchPercent: 78,
    bio: 'Competitive but friendly. Open to mixed doubles tournaments.',
  },
];

const SKILL_FILTERS: ('All' | SkillLevel)[] = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Pro'];

const skillStyle: Record<SkillLevel, string> = {
  Beginner: 'bg-secondary-container text-on-secondary-container',
  Intermediate: 'bg-primary-fixed text-on-primary-fixed',
  Advanced: 'bg-primary text-on-primary',
  Pro: 'bg-tertiary-container text-on-tertiary-container',
};

const avatarTones = [
  'bg-secondary-fixed text-on-secondary-fixed',
  'bg-primary-fixed text-on-primary-fixed',
  'bg-tertiary-fixed text-on-tertiary-fixed',
  'bg-secondary-container text-on-secondary-container',
  'bg-primary-container text-on-primary-container',
];

export function FindPartner() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<(typeof SKILL_FILTERS)[number]>('All');
  const [invited, setInvited] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return seed.filter((p) => {
      const matchesSkill = skillFilter === 'All' || p.skill === skillFilter;
      const matchesQuery =
        query.trim() === '' ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.bio.toLowerCase().includes(query.toLowerCase()) ||
        p.styles.some((s) => s.toLowerCase().includes(query.toLowerCase()));
      return matchesSkill && matchesQuery;
    });
  }, [query, skillFilter]);

  const featured = useMemo(
    () =>
      [...seed]
        .filter((p) => p.matchPercent >= 85)
        .sort((a, b) => b.matchPercent - a.matchPercent)
        .slice(0, 3),
    [],
  );

  const toggleInvite = (id: string) =>
    setInvited((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleSave = (id: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="min-h-dvh bg-surface pb-28 text-on-surface">
      <PageHeader
        subtitle="Find Partner"
        title="Match up"
        trailing={{
          icon: 'tune',
          label: 'preferences',
          onClick: () => navigate('/profile'),
        }}
      />

      <main className="mx-auto max-w-screen-sm space-y-lg px-container-padding pt-lg">
        <section>
          <label className="flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-container-lowest px-md py-sm shadow-elevated focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <Icon name="search" className="text-on-surface-variant" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, style, or vibe…"
              className="w-full bg-transparent font-body text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="clear">
                <Icon name="close" className="text-on-surface-variant" />
              </button>
            )}
          </label>
        </section>

        <section className="-mx-container-padding">
          <div className="hide-scrollbar flex gap-sm overflow-x-auto px-container-padding">
            {SKILL_FILTERS.map((s) => {
              const active = s === skillFilter;
              return (
                <button
                  key={s}
                  onClick={() => setSkillFilter(s)}
                  className={`flex-shrink-0 rounded-full px-md py-xs font-label text-label-lg transition active:scale-95 ${
                    active
                      ? 'bg-primary text-on-primary shadow-elevated'
                      : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </section>

        {skillFilter === 'All' && query.trim() === '' && (
          <section className="space-y-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-headline-md text-primary">Top matches for you</h2>
              <span className="font-label text-label-sm text-on-surface-variant">
                Updated daily
              </span>
            </div>
            <div className="-mx-container-padding">
              <div className="hide-scrollbar flex gap-gutter overflow-x-auto px-container-padding pb-xs">
                {featured.map((p, i) => (
                  <FeaturedCard
                    key={p.id}
                    partner={p}
                    tone={avatarTones[i % avatarTones.length]}
                    invited={invited.has(p.id)}
                    onInvite={() => toggleInvite(p.id)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="space-y-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-headline-md text-primary">
              {skillFilter === 'All' ? 'All players' : `${skillFilter} players`}
            </h2>
            <span className="font-label text-label-sm text-on-surface-variant">
              {filtered.length} found
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-sm rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-xl text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                <Icon name="person_search" />
              </div>
              <p className="font-headline text-headline-md text-primary">No partners match</p>
              <p className="font-body text-body-md text-on-surface-variant">
                Try a different skill level or clear your search.
              </p>
            </div>
          ) : (
            <ul className="space-y-sm">
              {filtered.map((p, i) => (
                <li key={p.id}>
                  <PartnerCard
                    partner={p}
                    tone={avatarTones[i % avatarTones.length]}
                    invited={invited.has(p.id)}
                    saved={saved.has(p.id)}
                    onInvite={() => toggleInvite(p.id)}
                    onSave={() => toggleSave(p.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl bg-primary p-lg text-on-primary shadow-elevated">
          <p className="font-label text-label-sm uppercase tracking-widest opacity-80">
            Can't find someone?
          </p>
          <h3 className="mt-xs font-headline text-headline-md">Post an open invite</h3>
          <p className="mt-xs font-body text-body-md text-on-primary-container">
            Share a court, time, and skill level. Nearby players will see your post.
          </p>
          <button
            onClick={() => navigate('/book')}
            className="mt-md inline-flex items-center gap-xs rounded-full bg-secondary-fixed px-lg py-sm font-label text-label-lg font-bold text-on-secondary-fixed shadow-elevated transition active:scale-95"
          >
            <Icon name="add" />
            Create open invite
          </button>
        </section>
      </main>

      <BottomNav active="Explore" />
    </div>
  );
}

function FeaturedCard({
  partner,
  tone,
  invited,
  onInvite,
}: {
  partner: Partner;
  tone: string;
  invited: boolean;
  onInvite: () => void;
}) {
  return (
    <div className="flex w-64 flex-shrink-0 flex-col gap-sm rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-elevated">
      <div className="flex items-center gap-sm">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${tone}`}>
          <span className="font-display text-headline-md leading-none">{partner.initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-headline text-headline-md leading-tight text-primary">
            {partner.name}
          </p>
          <p className="font-label text-label-sm text-on-surface-variant">
            {partner.distanceKm} km away
          </p>
        </div>
      </div>
      <div className="flex items-center gap-xs">
        <Icon name="auto_awesome" filled className="text-base text-primary" />
        <span className="font-label text-label-lg text-primary">{partner.matchPercent}% match</span>
      </div>
      <p className="line-clamp-2 font-body text-body-md text-on-surface-variant">{partner.bio}</p>
      <button
        onClick={onInvite}
        className={`mt-xs flex items-center justify-center gap-xs rounded-full px-md py-sm font-label text-label-lg transition active:scale-95 ${
          invited
            ? 'bg-secondary-container text-on-secondary-container'
            : 'bg-primary text-on-primary shadow-elevated'
        }`}
      >
        <Icon name={invited ? 'check' : 'send'} />
        {invited ? 'Invited' : 'Send invite'}
      </button>
    </div>
  );
}

function PartnerCard({
  partner,
  tone,
  invited,
  saved,
  onInvite,
  onSave,
}: {
  partner: Partner;
  tone: string;
  invited: boolean;
  saved: boolean;
  onInvite: () => void;
  onSave: () => void;
}) {
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-elevated">
      <div className="flex items-start gap-md">
        <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${tone}`}>
          <span className="font-display text-headline-md leading-none">{partner.initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-sm">
            <div>
              <p className="font-headline text-headline-md leading-tight text-primary">
                {partner.name}
              </p>
              <div className="mt-xs flex items-center gap-xs">
                <Icon name="star" filled className="text-base text-secondary-fixed-dim" />
                <span className="font-label text-label-sm text-on-surface-variant">
                  {partner.rating.toFixed(1)} · {partner.matchPercent}% match
                </span>
              </div>
            </div>
            <button
              onClick={onSave}
              aria-label={saved ? 'unsave' : 'save'}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition active:scale-90"
            >
              <Icon name={saved ? 'bookmark' : 'bookmark_border'} filled={saved} />
            </button>
          </div>

          <div className="mt-sm flex flex-wrap gap-xs">
            <span
              className={`rounded-full px-2 py-0.5 font-label text-label-sm font-bold uppercase tracking-wider ${skillStyle[partner.skill]}`}
            >
              {partner.skill}
            </span>
            {partner.styles.map((s) => (
              <span
                key={s}
                className="rounded-full border border-outline-variant px-2 py-0.5 font-label text-label-sm text-on-surface-variant"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-sm font-body text-body-md text-on-surface-variant">{partner.bio}</p>

      <div className="mt-sm grid grid-cols-2 gap-xs">
        <div className="flex items-center gap-xs">
          <Icon name="schedule" className="text-base text-primary" />
          <span className="font-label text-label-sm text-on-surface-variant">
            {partner.availability}
          </span>
        </div>
        <div className="flex items-center gap-xs">
          <Icon name="location_on" className="text-base text-primary" />
          <span className="font-label text-label-sm text-on-surface-variant">
            {partner.distanceKm} km away
          </span>
        </div>
      </div>

      <div className="mt-md flex items-center justify-between border-t border-dashed border-outline-variant/40 pt-md">
        <button className="flex items-center gap-xs font-label text-label-lg text-primary transition active:scale-95">
          <Icon name="chat_bubble_outline" />
          Message
        </button>
        <button
          onClick={onInvite}
          className={`flex items-center gap-xs rounded-xl px-md py-sm font-label text-label-lg transition active:scale-95 ${
            invited
              ? 'bg-secondary-container text-on-secondary-container'
              : 'bg-primary text-on-primary shadow-elevated'
          }`}
        >
          <Icon name={invited ? 'check' : 'send'} />
          {invited ? 'Invited' : 'Send invite'}
        </button>
      </div>
    </div>
  );
}
