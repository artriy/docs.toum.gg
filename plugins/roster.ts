import fs from 'node:fs';
import path from 'node:path';
import type {LoadContext, Plugin} from '@docusaurus/types';
import sidebars from '../sidebars';
import roleColors from '../src/data/roleColors.json';

type Rgb = [number, number, number];

export type RosterEntry = {
  id: string;
  title: string;
  tagline: string;
  icon: string | null;
  abilities: string;
  color: string;
  permalink: string;
};

export type RosterGroup = {label: string; entries: RosterEntry[]};

export type RosterFaction = {
  key: string;
  label: string;
  color: string;
  description: string;
  groups: RosterGroup[];
};

export type RosterData = {
  roles: RosterFaction[];
  modifiers: RosterFaction[];
  latestPost: {title: string; permalink: string; date: string} | null;
};

type SidebarItem =
  | string
  | {type?: string; label?: string; items?: SidebarItem[]; link?: {description?: string}};

const colors = roleColors as Record<string, Rgb>;

const FACTIONS: Record<string, {key: string; color: Rgb}> = {
  Crewmates: {key: 'crew', color: colors.CrewmateWiki},
  Impostors: {key: 'imp', color: colors.ImpWiki},
  Neutrals: {key: 'neut', color: colors.NeutralWiki},
};

const MODIFIER_FALLBACK: Record<string, Rgb> = {
  Crewmate: colors.CrewmateWiki,
  Impostor: colors.ImpWiki,
};

const COLOR_ALIASES: Record<string, string> = {Lovers: 'Lover'};

const rgb = (c: Rgb) => c.join(' ');

function readFrontMatter(source: string, key: string): string {
  const block = source.match(/^---\s*\n([\s\S]*?)\n---/);
  const line = block?.[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return line ? line[1].trim().replace(/^["']|["']$/g, '') : '';
}

function readDoc(siteDir: string, id: string) {
  const file = ['.md', '.mdx']
    .map((ext) => path.join(siteDir, 'docs', id + ext))
    .find((candidate) => fs.existsSync(candidate));
  if (!file) {
    throw new Error(`roster: sidebar doc "${id}" has no file`);
  }
  const source = fs.readFileSync(file, 'utf8');
  return {
    title: readFrontMatter(source, 'title') || path.basename(id),
    tagline: readFrontMatter(source, 'description'),
    icon: source.match(/\/img\/Icons\/[^'")\s]+\.png/)?.[0] ?? null,
    abilities: [...source.matchAll(/^\|\s*<img[^|]*\|\s*\*\*([^*|]+)\*\*\s*\|([^|]*)\|/gm)]
      .map((row) => `${row[1].trim()} ${row[2].replace(/[*_`]/g, '').trim()}`)
      .join(' '),
  };
}

function docIds(items: SidebarItem[] = []): string[] {
  return items.flatMap((item) => (typeof item === 'string' ? [item] : docIds(item.items)));
}

export default function rosterPlugin(context: LoadContext): Plugin {
  let roleCss = '';

  return {
    name: 'toum-roster',

    getPathsToWatch() {
      return [path.join(context.siteDir, 'docs/**/*.{md,mdx}')];
    },

    async allContentLoaded({allContent, actions}) {
      const docsContent = allContent['docusaurus-plugin-content-docs']?.default as {
        loadedVersions: {docs: {id: string; permalink: string}[]}[];
      };
      const permalinks = new Map(docsContent.loadedVersions[0].docs.map((doc) => [doc.id, doc.permalink]));

      const entry = (id: string, fallback: Rgb): RosterEntry => {
        const doc = readDoc(context.siteDir, id);
        const permalink = permalinks.get(id);
        if (!permalink) {
          throw new Error(`roster: no permalink for doc "${id}"`);
        }
        const colorKey = doc.title.replace(/[^A-Za-z]/g, '');
        const color = colors[COLOR_ALIASES[colorKey] ?? colorKey] ?? fallback;
        return {id, ...doc, color: rgb(color), permalink};
      };

      const roles = (sidebars.rolesSidebar as SidebarItem[]).flatMap((faction): RosterFaction[] => {
        if (typeof faction === 'string' || !faction.label || !FACTIONS[faction.label]) {
          return [];
        }
        const {key, color} = FACTIONS[faction.label];
        return [
          {
            key,
            label: faction.label,
            color: rgb(color),
            description: faction.link?.description ?? '',
            groups: (faction.items ?? []).map((group) => ({
              label: typeof group === 'string' ? '' : (group.label ?? '').replace(/^(Crew|Imp|Neut)\s+/, ''),
              entries: (typeof group === 'string' ? [group] : docIds(group.items)).map((id) =>
                key === 'imp' ? {...entry(id, color), color: rgb(color)} : entry(id, color),
              ),
            })),
          },
        ];
      });

      const modifierGroups = (sidebars.modifiersSidebar as SidebarItem[]).flatMap((group): RosterGroup[] =>
        typeof group === 'string' || !group.label
          ? []
          : [
              {
                label: group.label,
                entries: docIds(group.items).map((id) =>
                  entry(id, MODIFIER_FALLBACK[group.label as string] ?? colors.NeutralWiki),
                ),
              },
            ],
      );

      const blogContent = allContent['docusaurus-plugin-content-blog']?.default as {
        blogPosts: {metadata: {title: string; permalink: string; date: string | Date}}[];
      };
      const latest = blogContent?.blogPosts[0]?.metadata;

      const data: RosterData = {
        roles,
        modifiers: [
          {
            key: 'mod',
            label: 'Modifiers',
            color: rgb(colors.NeutralWiki),
            description:
              'Modifiers stack on top of a role. One player can carry an Alliance, a Faction and a Universal modifier at once.',
            groups: modifierGroups,
          },
        ],
        latestPost: latest
          ? {title: latest.title, permalink: latest.permalink, date: new Date(latest.date).toISOString()}
          : null,
      };

      const all = [...roles, ...data.modifiers].flatMap((f) => f.groups.flatMap((g) => g.entries));
      roleCss = all
        .map((e) => {
          const hrefs = new Set([e.permalink, encodeURI(e.permalink)]);
          const selectors = [...hrefs].map((href) => `a[href="${href}"]`).join(',');
          return `${selectors}{--role:${e.color};--has-role:1}`;
        })
        .join('');

      actions.setGlobalData(data);
    },

    injectHtmlTags() {
      return {headTags: [{tagName: 'style', attributes: {id: 'toum-role-colors'}, innerHTML: roleCss}]};
    },
  };
}
