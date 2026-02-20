# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Design and build a **Settings » Connectors** page for WordPress Core (targeting WP 7.0). This is a centralized keychain and connection manager for API keys, OAuth flows, and external service integrations — not just for AI, but for *all* external services WordPress connects to.

## Context

This project responds to Matt Mullenweg's directive (comment #48384 on the WP AI Client proposal) to "think bigger" than just an AI client merge. The Connectors page is envisioned as a headline feature for WordPress 7.0.

## Key Requirements (from Matt)

1. **Settings » Connectors** — new admin page between General and Writing
2. **Unified keychain** — OAuth flows + API key storage in one place
3. **Plugin registration** — Akismet and other plugins register their keys here
4. **Default connectors** — Ship with Google, OpenAI, Anthropic, OpenRouter, Grok
5. **Admin-only** — restricted to admin role
6. **Help text** — description underneath each field explaining where to get a key and what it unlocks
7. **Design reference** — Claude's connectors UI (card-based, clean, modern)

## Architecture

- PHP settings page registered via WordPress Settings API
- Connector registry (PHP API for plugins to register connectors)
- Credential storage (encrypted options or similar)
- REST API endpoints for JS-driven UI components
- React/JS admin UI (modern WordPress admin patterns)

## Documentation

The `/docs/` folder contains:
- `overview.md` — Full project overview with goals, architecture, stakeholders
- Reference screenshots from Matt's comment saved locally

## Scope

- **In scope**: Connectors settings page, connector registry API, credential storage, default AI provider connectors, plugin integration hooks
- **Out of scope**: Actual AI inference, provider-specific SDK implementations, AI features/UI beyond connection management
