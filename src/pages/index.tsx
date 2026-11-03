import type {CSSProperties, ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Manifest from '@site/src/components/Manifest';
import CrewBean from '@site/src/components/CrewBean';
import styles from './index.module.css';

const PLATFORMS = [
  {name: 'Windows', detail: 'Epic Games, Itch.io, Microsoft Store, Steam', to: '/docs/category/windows-install'},
  {name: 'macOS', detail: 'Heroic Launcher, Steam', to: '/docs/category/macos'},
  {name: 'Linux / Steam Deck', detail: 'Heroic Launcher, Steam', to: '/docs/category/linux--steam-deck-install'},
  {name: 'Android', detail: 'Starlight mod launcher', to: '/docs/category/android'},
];

const PLAYER_COLORS = [
  ['#c51111', '#7a0838'],
  ['#132ed1', '#09158e'],
  ['#117f2d', '#0a4d2e'],
  ['#ed54ba', '#ab2bad'],
  ['#ef7d0d', '#b33e15'],
  ['#f5f557', '#c38823'],
  ['#3f474e', '#1e1f26'],
  ['#d6e0f0', '#8394bf'],
  ['#6b2fbb', '#3b177c'],
  ['#71491e', '#5e2615'],
  ['#38fedc', '#24a8be'],
  ['#50ef39', '#15a742'],
  ['#6b2b3c', '#41131f'],
];

const DEVELOPERS = [
  'Atony',
  'AlchlcSystm',
  'anglewtf',
  'DigiWorm',
  'Donners',
  'K3ndo',
  'MyDragonBreath',
  'Pietro',
  'twix',
  'xerminator',
  'SigmaCube',
  'Zeo (the Unc)',
  'Nix',
];

export default function Home(): ReactNode {
  return (
    <Layout description="Every role, modifier and lobby setting in Town of Us: Mira, the Among Us mod.">
      <main>
        <Manifest />

        <section className={styles.board} aria-labelledby="board-title">
          <div className={styles.boardIntro}>
            <p className={styles.kicker}>Get aboard</p>
            <h2 id="board-title" className={styles.boardTitle}>
              Board the ship
            </h2>
            <p className={styles.lede}>
              Town Of Us: Mira is a reimagining of Town of Us: Reactivated, introducing new roles and modifiers, as
              well as visual and codebase overhauls. Join the TOU Discord for daily lobbies, feedback and suggestions!
            </p>
            <Link className="toum-btn" href="https://discord.gg/ugyc4EVUYZ">
              Join the Discord
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <ul className={styles.platforms}>
            {PLATFORMS.map((platform) => (
              <li key={platform.name}>
                <Link className={styles.tile} to={platform.to}>
                  <span className={styles.tileKicker}>Install on</span>
                  <span className={styles.tileName}>{platform.name}</span>
                  <span className={styles.tileDetail}>{platform.detail}</span>
                </Link>
              </li>
            ))}
            <li className={styles.wide}>
              <Link className={styles.tile} to="/docs/category/settings">
                <span className={styles.tileKicker}>Hosting a lobby</span>
                <span className={styles.tileName}>Settings</span>
                <span className={styles.tileDetail}>Game mechanics, timers, postmortem, roleblocks, Better Maps</span>
              </Link>
            </li>
            <li className={styles.wide}>
              <Link className={styles.tile} to="/blog">
                <span className={styles.tileKicker}>What changed</span>
                <span className={styles.tileName}>Changelog</span>
                <span className={styles.tileDetail}>Release notes for every Mira update</span>
              </Link>
            </li>
          </ul>
        </section>

        <section className={styles.crew} aria-labelledby="crew-title">
          <h2 id="crew-title" className={styles.crewTitle}>
            Development crew
          </h2>
          <ul className={styles.crewList}>
            {DEVELOPERS.map((name, index) => {
              const [color, shade] = PLAYER_COLORS[index % PLAYER_COLORS.length];
              return (
                <li key={name} className={styles.member} style={{'--bob': `${(index % 5) * -0.7}s`} as CSSProperties}>
                  <CrewBean className={styles.bean} color={color} shade={shade} />
                  <span>{name}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </Layout>
  );
}
