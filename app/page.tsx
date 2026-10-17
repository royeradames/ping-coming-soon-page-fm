/* eslint-disable @next/next/no-img-element -- next/image added client JavaScript here without optimizing anything (SVGs, data URLs or unoptimized files). */
import { NotifyForm } from "./components/notify-form";

const socials = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    icon: <path d="M13.4 21v-7.6H16l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6V21z" />,
  },
  {
    name: "Twitter",
    href: "https://x.com/",
    icon: <path d="M22 5.9c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5 0 2 1.4 3.7 3.3 4.1-.6.2-1.2.2-1.9.1a4.1 4.1 0 0 0 3.8 2.8A8.2 8.2 0 0 1 2 18.3 11.6 11.6 0 0 0 8.3 20c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2z" />,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: <><rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="16.6" cy="7.4" r="1.1" /></>,
  },
];

export default function Home() {
  return (
    <>
      <main>
        <header className="brand">
          <img src="/images/logo.svg" width={86} height={26} alt="Ping" fetchPriority="high" decoding="async" />
        </header>
        <h1><span className="light">We are launching </span><strong>soon!</strong></h1>
        <p className="subtitle">Subscribe and get notified</p>
        <NotifyForm />
        <img className="dashboard" src="/images/illustration-dashboard.png" width={1280} height={782} alt="Preview of the Ping dashboard: a sidebar and four analytics cards with line charts." fetchPriority="high" decoding="async" />
      </main>
      <footer>
        <ul className="socials">
          {socials.map(social => (
            <li key={social.name}>
              <a href={social.href} aria-label={social.name}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">{social.icon}</svg>
              </a>
            </li>
          ))}
        </ul>
        <p className="copyright">&copy; Copyright Ping. All rights reserved.</p>
        <p className="credit">Challenge by <a href="https://www.frontendmentor.io/challenges/ping-single-column-coming-soon-page-5cadd051fec04111f7b848da">Frontend Mentor</a>. Built by <a href="https://royeradames.com">Royer Adames</a>.</p>
      </footer>
    </>
  );
}
