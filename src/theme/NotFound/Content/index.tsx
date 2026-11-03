import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/NotFound/Content';
import Starfield from '@site/src/components/Starfield';
import CrewBean from '@site/src/components/CrewBean';
import styles from './styles.module.css';

const VERDICT = 'This page was not The Impostor.';

export default function NotFoundContent({className}: Props): ReactNode {
  return (
    <main className={clsx(styles.space, className)}>
      <Starfield />
      <div className={styles.drift} aria-hidden="true">
        <CrewBean className={styles.bean} color="#d6e0f0" shade="#8394bf" dapper />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.verdict} aria-label={VERDICT}>
          {[...VERDICT].map((char, index) => (
            <span key={index} aria-hidden="true" style={{'--i': index} as CSSProperties}>
              {char}
            </span>
          ))}
        </h1>
        <p className={styles.remains}>404 · 1 Impostor remains</p>
        <p className={styles.body}>
          The link you followed leads nowhere. Head back to the ship and search for the role you wanted.
        </p>
        <div className={styles.actions}>
          <Link className="toum-btn toum-btn--role" to="/">
            Back to the ship
          </Link>
          <Link className={clsx('toum-btn', styles.ghost)} to="/docs/install/intro">
            Install guide
          </Link>
        </div>
      </div>
    </main>
  );
}
