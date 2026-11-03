import {useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Starfield from '@site/src/components/Starfield';
import {
  hitMatches,
  queryWords,
  titleRank,
  useRoster,
  type RosterEntry,
  type RosterFaction,
} from '@site/src/components/useRoster';
import styles from './styles.module.css';

const ALL = 'all';

function Plate({entry}: {entry: RosterEntry}): ReactNode {
  const icon = useBaseUrl(entry.icon ?? '/img/logo.png');
  return (
    <li>
      <Link className={styles.plate} to={entry.permalink} style={{'--role': entry.color} as CSSProperties}>
        <img className={styles.plateIcon} src={icon} alt="" width={48} height={48} loading="lazy" decoding="async" />
        <span className={styles.plateName}>{entry.title}</span>
        <span className={styles.plateTagline}>{entry.tagline}</span>
      </Link>
    </li>
  );
}

export default function Manifest(): ReactNode {
  const roster = useRoster();
  const history = useHistory();
  const factions = useMemo(() => [...roster.roles, ...roster.modifiers], [roster]);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(ALL);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordmark = useBaseUrl('/img/Banner.png');

  const words = queryWords(query);
  const visible = factions
    .filter((faction) => active === ALL || faction.key === active)
    .map((faction): RosterFaction => ({
      ...faction,
      groups: faction.groups
        .map((group) => ({
          ...group,
          entries: group.entries.filter((entry) =>
            hitMatches({...entry, faction: faction.label, group: group.label}, words),
          ),
        }))
        .filter((group) => group.entries.length > 0),
    }))
    .filter((faction) => faction.groups.length > 0);
  const matches = visible.flatMap((faction) => faction.groups.flatMap((group) => group.entries));
  const counts = new Map(
    factions.map((faction) => [
      faction.key,
      faction.groups.reduce((count, group) => count + group.entries.length, 0),
    ]),
  );
  const roleTotal = roster.roles.reduce((sum, faction) => sum + (counts.get(faction.key) ?? 0), 0);
  const modifierTotal = counts.get('mod') ?? 0;

  let topMatch: RosterEntry | undefined;
  let topRank = Infinity;
  for (const entry of words.length > 0 ? matches : []) {
    const rank = titleRank(entry, words);
    if (rank < topRank) {
      topMatch = entry;
      topRank = rank;
    }
  }
  const topIcon = useBaseUrl(topMatch?.icon ?? '/img/logo.png');

  const openTopMatch = (event: FormEvent) => {
    event.preventDefault();
    if (topMatch) {
      history.push(topMatch.permalink);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key !== '/' || target.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <section
        className={clsx(styles.stage, 'toum-role-scope')}
        style={{'--role': topMatch?.color ?? 'var(--crew)'} as CSSProperties}
        aria-labelledby="finder-title">
        <Starfield />
        <div className={styles.cone} key={topMatch?.id ?? 'idle'} aria-hidden="true" />

        <header className={styles.top}>
          <h1 className={styles.wordmark}>
            <img src={wordmark} alt="Town of Us: Mira" width={2280} height={750} />
          </h1>
          <div className={styles.topActions}>
            {roster.latestPost && (
              <Link className={styles.latest} to={roster.latestPost.permalink}>
                <span className={styles.latestLabel}>Latest</span>
                {roster.latestPost.title}
              </Link>
            )}
            <Link className="toum-btn toum-btn--ember" to="/docs/install/intro">
              Install Mira
            </Link>
          </div>
        </header>

        <div className={styles.finder}>
          <h2 id="finder-title" className={styles.title}>
            {roleTotal} roles. {modifierTotal} modifiers. Look one up.
          </h2>
          <form role="search" className={styles.search} onSubmit={openTopMatch}>
            <label className="sr-only" htmlFor="finder-input">
              Find a role, ability or modifier
            </label>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.searchIcon}>
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.6" />
              <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
            <input
              id="finder-input"
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sheriff, vent, Lovers…"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="go"
            />
            <kbd className="toum-kbd">/</kbd>
          </form>

          <div className={styles.hint}>
            {topMatch ? (
              <Link className={styles.topMatch} to={topMatch.permalink} key={topMatch.id}>
                <img src={topIcon} alt="" width={36} height={36} />
                <span className={styles.topName}>{topMatch.title}</span>
                <span className={styles.topTagline}>{topMatch.tagline}</span>
                <span className={styles.enter}>
                  <kbd className="toum-kbd">Enter</kbd>
                  Open
                </span>
              </Link>
            ) : (
              <p className={styles.hintText}>
                {words.length > 0
                  ? 'Nobody aboard answers to that.'
                  : 'Search by name, ability or alignment. Enter opens the top match.'}
              </p>
            )}
            <p className="sr-only" role="status">
              {words.length > 0 && `${matches.length} match${matches.length === 1 ? '' : 'es'}`}
            </p>
          </div>

          <div className={styles.tabs} role="group" aria-label="Filter by faction">
            {[{key: ALL, label: 'Everyone', color: null}, ...factions].map((faction) => (
              <button
                key={faction.key}
                type="button"
                className={styles.tab}
                aria-pressed={active === faction.key}
                onClick={() => setActive(faction.key)}
                style={faction.color ? ({'--role': faction.color} as CSSProperties) : undefined}>
                {faction.color && <span className={styles.tabDot} />}
                {faction.label}
                <span className={styles.tabCount}>
                  {faction.key === ALL ? roleTotal + modifierTotal : counts.get(faction.key)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.results} aria-label="Roles and modifiers">
        {words.length > 0 && matches.length > 0 && (
          <p className={styles.status}>
            {matches.length} match{matches.length === 1 ? '' : 'es'} for “{query.trim()}”
          </p>
        )}
        {visible.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Nobody aboard answers to that.</p>
            <p>
              Try a role name like <button type="button" onClick={() => setQuery('sheriff')}>sheriff</button>, or
              an ability like <button type="button" onClick={() => setQuery('vent')}>vent</button>.
            </p>
          </div>
        ) : (
          visible.map((faction) => (
            <section
              key={faction.key}
              className={clsx(styles.faction, 'toum-role-scope')}
              style={{'--role': faction.color} as CSSProperties}
              aria-labelledby={`faction-${faction.key}`}>
              <header className={styles.factionHead}>
                <h3 id={`faction-${faction.key}`} className={styles.factionName}>
                  {faction.label}
                </h3>
                {words.length === 0 && <p className={styles.factionText}>{faction.description}</p>}
              </header>
              {faction.groups.map((group) => (
                <div key={group.label} className={styles.group}>
                  <h4 className={styles.groupLabel}>
                    {group.label}
                    <span>{group.entries.length}</span>
                  </h4>
                  <ul className={styles.grid}>
                    {group.entries.map((entry) => (
                      <Plate key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))
        )}
      </section>
    </>
  );
}
