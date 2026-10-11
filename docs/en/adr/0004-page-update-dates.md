# ADR-0004 · Displaying page update dates

- Date: 2026-10-12
- Status: Implemented on the site

## Context

As the collection of lessons and supplementary materials grows, readers need a way to see when each page was last updated. Manually maintaining dates in every page can leave stale dates after edits and can make dates inaccurate on pages that did not change.

## Decision

Enable VitePress's last-updated display and show each page's latest Git change date. Use “最終更新” on Japanese pages and “Last updated” on English pages. The date follows the commit that changed the page. Configure the GitHub Pages build to fetch the full repository history.

## Alternatives

Manually adding dates to every Markdown file is simple, but makes omissions and inconsistencies harder to prevent. Showing the build date on every page would make unchanged pages appear to have been updated, so that approach is rejected.

## Consequences and review

Update dates depend on Git history. Environments without repository history cannot calculate them correctly, so the published build must retain full history. A page's displayed date advances after its creation or update is committed.

[Back to ADR index](./)
