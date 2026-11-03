import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const linkGroups = [
  {
    label: 'Project',
    links: [
      {label: 'AGPLv3 Licensed', href: 'https://parcelis.dev/licensing'},
      {label: 'Live Demo', href: 'https://demo.parcelis.dev/'},
      {label: 'Buy us a coffee!!', href: 'https://buymeacoffee.com/parcelis'},
    ],
  },
  {
    label: 'Contribute',
    links: [
      {label: 'Suggest a feature', href: 'https://github.com/parcelis/parcelis/issues/new?template=feature_request.yml'},
      {label: 'Report a bug', href: 'https://github.com/parcelis/parcelis/issues/new?template=bug_report.yml'},
      {label: 'Update Documentation', href: 'https://github.com/parcelis/parcelis/issues/new?template=documentation_template.yml'},
      {label: 'Contributor License Agreement (CLA)', href: 'https://cla-assistant.io/parcelis/parcelis'},
    ],
  },
  {
    label: 'Community',
    links: [
      {label: 'View Documentation', href: '/docs/platform-user-guide'},
      {label: 'GitHub', href: 'https://github.com/parcelis/parcelis'},
      {label: 'Join us on Discord', href: 'https://discord.com/invite/fQACQU8qdz'},
      {label: 'Conventional Commits', href: 'https://www.conventionalcommits.org/en/v1.0.0/'},
    ],
  },
];

export default function Footer(): ReactNode {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <nav className={styles.links} aria-label="Footer navigation">
          {linkGroups.map(({label, links}) => (
            <ul key={label} className={styles.group} aria-label={label}>
              {links.map(({label: text, href}) => (
                <li key={text}>
                  <Link to={href}>{text}</Link>
                </li>
              ))}
            </ul>
          ))}
        </nav>
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Parcelis. Open source. Open future.</p>
          <p>The open-source platform for property management.</p>
        </div>
      </div>
    </footer>
  );
}
