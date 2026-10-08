# Ping coming soon page

An implementation of the [Frontend Mentor Ping coming soon page challenge](https://www.frontendmentor.io/challenges/ping-single-column-coming-soon-page-5cadd051fec04111f7b848da), using its supplied logo, dashboard illustration, copy and design references.

## Development

Node 22.13 or later. Use `npm ci`, `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`. Browser tests use installed Chrome and own port 4536.

Next 16.3.6, React 19.2.8, TypeScript 5.9.3, Tailwind 4.2.1, TanStack Form 1.33.5 and Zod 4.4.3 are pinned to the family baseline.

## Sources

Original challenge files are preserved under `reference/`; supplied images moved byte-for-byte to `public/images/`. Geometry and colors follow the decoded Figma frames (Mobile, Tablet and Desktop, their error states and Desktop - Active States). Libre Franklin 300/600/700 loads through `next/font`. The challenge supplies no social icons, so the three small icons are drawn inline.

## Implementation choices

- The form is honest: it says "Demo only: nothing is sent." and, after a valid address, "That address looks right. Demo only: nothing was sent or saved." There is no network request, so there is no pending state; the button is never disabled.
- TanStack Form validates with a Zod schema on submit, then on every change after the first submit. Empty and malformed addresses get the challenge's two messages, the field is marked invalid and described by the message, and focus returns to it.
- The input has no `name`, so with JavaScript off a native submit carries no address into the URL or anywhere else.
- The mobile design sets the form, subtitle, error and copyright at 10–12px. They rise to the family 16px floor (which also stops iOS zooming into the field), and the mobile controls grow from 40px to 48px tall. Small gray copy uses #767676 instead of #969696 for contrast; the heading keeps the design's gray.
