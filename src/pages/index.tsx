import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={clsx('container', styles.heroCopy)}>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title} docs
        </Heading>
        <p className={styles.heroSubtitle}>
          Everything you need to get the most out of NeatContext — the local-first
          context workspace for LLM tools.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Read the docs →
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://www.neatcontext.com">
            neatcontext.com
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Official documentation for NeatContext, a local-first context workspace for LLM tools.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
