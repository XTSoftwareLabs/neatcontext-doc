import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Local-first',
    emoji: '🗂️',
    description: (
      <>
        Your domain profiles, knowledge folders, and model configuration stay on
        your own machine.
      </>
    ),
  },
  {
    title: 'Domain-aware context',
    emoji: '🧠',
    description: (
      <>
        Organize the context you feed to LLM tools so each task gets exactly what
        it needs.
      </>
    ),
  },
  {
    title: 'Bring your own tools',
    emoji: '🔌',
    description: (
      <>
        Connect the models and MCP-compatible tools you already use, without hosted
        inference lock-in.
      </>
    ),
  },
];

function Feature({title, emoji, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.card}>
        <span className={styles.featureEmoji} role="img" aria-hidden="true">
          {emoji}
        </span>
        <Heading as="h3" className={styles.cardTitle}>
          {title}
        </Heading>
        <p className={styles.cardText}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
