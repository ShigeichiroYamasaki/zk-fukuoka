# ADR-0001 · Bilingual documentation on VitePress

- Date: 2026-09-24
- Status: implemented for the site; community ratification pending

## Context

We need an approachable home page and maintainable learning materials, whitepaper, and decision records, with Japanese and English navigation.

## Decision

Use Markdown and VitePress in one GitHub repository. Publish static output to GitHub Pages via Actions. Japanese lives at the root; English lives under `/en/`. Language tabs preserve the current document.

## Alternatives

A CMS offers browser-based editing but adds another operational system. A custom application gives more freedom but requires additional maintenance for documentation features.

## Consequences

Changes are reviewable as diffs. Contributors need basic Git knowledge. Translations must be reviewed together. Configure the Pages base path for each deployment; this site uses `/zk-fukuoka/`.

[Back to ADRs](./)
