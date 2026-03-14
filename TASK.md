# Test Assignment: Migration to React Router 7 Framework Mode

## Overview

The goal of this assignment is to migrate a legacy React project to [React Router 7 Framework Mode](https://reactrouter.com/start/modes#framework) with Server-Side Rendering (SSR), while preserving the original visual appearance and functionality.

## Source Project

The original project is a stripped-down version of a past revision of the <https://kotlinlang.org> website. It contains only a single page — the homepage.

**Repository:** <https://github.com/JetBrains/kotlin-web-site-jetsites-internship-2026>

Setup and run instructions are provided in the repository's `README.md`.

> **Note:** Since the project contains only one page, navigation links are non-functional by design — this is expected and does not need to be fixed.

## Requirements

1. Migrate the project to a **React Router 7 Framework Mode** setup with **Server-Side Rendering**.
2. Preserve the **original visual appearance** of the page.
3. Preserve the **interactive functionality**: tab switching and any other interactive elements present on the page must work as in the original.

> **Note:** You are free to start the new project from scratch — for example, it is not required to preserve the current Flask backend.

## Evaluation Criteria

- **Correctness of SSR** — the page renders on the server and is fully functional after hydration.
- **Visual accuracy** — the migrated page matches the original.
- **Maintainability** — continued use of `@rescui` components is expected. Upgrading to newer versions is optional; if you do, minor visual differences caused by component version changes are acceptable.
- **Code quality** — clean, readable code with a clear project structure.

## Deliverable

A **public GitHub repository** containing the migrated project with instructions on how to build and run it.
