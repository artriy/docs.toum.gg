import {useMemo} from 'react';
import {usePluginData} from '@docusaurus/useGlobalData';
import type {RosterData, RosterEntry, RosterFaction} from '@site/plugins/roster';

export type {RosterData, RosterEntry, RosterFaction};

export type RosterHit = RosterEntry & {faction: string; group: string};

export function useRoster(): RosterData {
  return usePluginData('toum-roster') as RosterData;
}

export function useRosterHits(): RosterHit[] {
  const roster = useRoster();
  return useMemo(
    () =>
      [...roster.roles, ...roster.modifiers].flatMap((faction) =>
        faction.groups.flatMap((group) =>
          group.entries.map((entry) => ({...entry, faction: faction.label, group: group.label})),
        ),
      ),
    [roster],
  );
}

export function useRosterLookup(): Map<string, RosterEntry> {
  const hits = useRosterHits();
  return useMemo(() => new Map(hits.flatMap((hit) => [[hit.id, hit] as const, [hit.permalink, hit] as const])), [hits]);
}

export function queryWords(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

export function hitMatches(hit: RosterHit, words: string[]): boolean {
  const tokens = `${hit.title} ${hit.tagline} ${hit.abilities} ${hit.group} ${hit.faction}`
    .toLowerCase()
    .split(/[^a-z0-9]+/);
  return words.every((word) => tokens.some((token) => token.startsWith(word)));
}

export function titleRank(hit: {title: string}, words: string[]): number {
  const title = hit.title.toLowerCase();
  const needle = words.join(' ');
  return title === needle ? 0 : title.startsWith(needle) ? 1 : title.includes(needle) ? 2 : 3;
}
