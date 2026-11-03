import {useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode} from 'react';
import clsx from 'clsx';
import {useHistory, useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {hitMatches, queryWords, titleRank, useRosterHits, type RosterHit} from '@site/src/components/useRoster';
import styles from './styles.module.css';

const MAX_RESULTS = 7;

function Option({hit, active, id, onPick}: {hit: RosterHit; active: boolean; id: string; onPick: () => void}): ReactNode {
  const icon = useBaseUrl(hit.icon ?? '/img/logo.png');
  return (
    <li
      id={id}
      role="option"
      className={clsx(styles.option, 'toum-role-scope', active && styles.optionActive)}
      aria-selected={active}
      style={{'--role': hit.color} as CSSProperties}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onPick}>
      <img src={icon} alt="" width={28} height={28} />
      <span className={styles.optionName}>{hit.title}</span>
      <span className={styles.optionMeta}>
        {hit.faction.replace(/s$/, '')} · {hit.group}
      </span>
    </li>
  );
}

export default function SearchBar(): ReactNode {
  const {pathname} = useLocation();
  const history = useHistory();
  const home = useBaseUrl('/');
  const hits = useRosterHits();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const isHome = pathname === home || `${pathname}/` === home;

  const words = queryWords(query);
  const results =
    words.length === 0
      ? []
      : hits
          .filter((hit) => hitMatches(hit, words))
          .map((hit, order) => ({hit, rank: titleRank(hit, words) * 1000 + order}))
          .sort((a, b) => a.rank - b.rank)
          .slice(0, MAX_RESULTS)
          .map(({hit}) => hit);
  const expanded = open && words.length > 0;

  useEffect(() => {
    if (isHome) {
      return undefined;
    }
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key !== '/' || target.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isHome]);

  if (isHome) {
    return null;
  }

  const pick = (hit: RosterHit) => {
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
    history.push(hit.permalink);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      if (results.length > 0) {
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setCursor((current) => (current + step + results.length) % results.length);
      }
    } else if (event.key === 'Enter' && results[cursor]) {
      event.preventDefault();
      pick(results[cursor]);
    } else if (event.key === 'Escape') {
      if (query) {
        setQuery('');
      } else {
        inputRef.current?.blur();
      }
    }
  };

  return (
    <div className={styles.finder}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.6" />
        <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        role="combobox"
        aria-label="Find a role or modifier"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={expanded && results[cursor] ? `${listId}-${cursor}` : undefined}
        value={query}
        placeholder="Find a role"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="go"
        onChange={(event) => {
          setQuery(event.target.value);
          setCursor(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      <kbd className={clsx('toum-kbd', styles.kbd)}>/</kbd>
      <ul id={listId} role="listbox" aria-label="Matching roles and modifiers" className={styles.list} hidden={!expanded}>
        {results.map((hit, index) => (
          <Option
            key={hit.id}
            id={`${listId}-${index}`}
            hit={hit}
            active={index === cursor}
            onPick={() => pick(hit)}
          />
        ))}
        {results.length === 0 && <li className={styles.empty}>Nobody aboard answers to that.</li>}
      </ul>
    </div>
  );
}
