# WP Core Connectors

A unified **Settings » Connectors** page for WordPress Core — a central keychain and connection manager for API keys, OAuth flows, and external service integrations.

## Overview

Matt Mullenweg's [vision for WordPress 7.0](https://make.wordpress.org/core/2026/02/03/proposal-for-merging-wp-ai-client-into-wordpress-7-0/#comment-48384): instead of merging just the AI client, think bigger. Give WordPress a proper Connectors settings page where users manage all their external service connections in one place — API keys, OAuth, everything.

This project designs and builds that feature for WordPress Core.

## Quick Start

```bash
cd ~/Developer/Projects/wp-core-connectors
# Setup commands TBD
```

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/overview.md](docs/overview.md) | Full project overview, goals, architecture |
| [docs/](docs/) | All project documentation |

## Structure

```
wp-core-connectors/
├── docs/          # Documentation
├── logs/          # Development logs (git-ignored)
└── README.md      # This file
```

## Related

- [Matt's comment (#48384)](https://make.wordpress.org/core/2026/02/03/proposal-for-merging-wp-ai-client-into-wordpress-7-0/#comment-48384)
- [WP AI Client proposal](https://make.wordpress.org/core/2026/02/03/proposal-for-merging-wp-ai-client-into-wordpress-7-0/)
- [Trac ticket #64591](https://core.trac.wordpress.org/ticket/64591)
- [Claude Connectors UI](https://claude.ai/settings/connectors) (design reference)
