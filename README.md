# Noto QA

End-to-end test suite and QA documentation for **[Noto](https://github.com/mangoPixel1/react-notes-app)**, a React/Supabase note-taking app — built to demonstrate real-world manual and automated testing practice, from test planning through bug reporting.

![Playwright](https://img.shields.io/badge/tested%20with-Playwright-2EAD33?logo=playwright&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)

<!-- IMAGE PLACEHOLDER: hero screenshot or GIF of a test run (e.g. Playwright UI mode / trace viewer) -->
![Project preview placeholder](docs/images/hero-placeholder.png)

---

## About This Project

This repository is a QA portfolio project centered on **[Noto](https://github.com/mangoPixel1/react-notes-app)**, a single-user note-taking app (React + Tailwind + Vite, with Supabase for auth and storage). Rather than building the app's features, this repo focuses on *testing* them: writing a test plan, automating coverage with Playwright, and documenting real bugs found along the way.

It's meant to give recruiters and hiring managers a quick, honest look at how I approach QA:

- Reading a spec and turning it into concrete, checkable test cases
- Automating the highest-value paths instead of testing everything by hand
- Writing bug reports a developer can act on without back-and-forth

## What This Demonstrates

| Skill | Where to see it |
| --- | --- |
| Test planning from requirements | [`REQUIREMENTS.md`](./REQUIREMENTS.md) |
| Automated E2E testing (Playwright) | [`tests/`](./tests) |
| Root-cause bug investigation & reporting | [`bug-reports/`](./bug-reports) |
| Product/domain understanding | [`PRODUCT_OVERVIEW.md`](./PRODUCT_OVERVIEW.md) |

<!-- IMAGE PLACEHOLDER: screenshot of the Playwright HTML report showing passing/failing tests -->
![Playwright report placeholder](docs/images/playwright-report-placeholder.png)

---

## Tech Stack

| Area | Technology |
| --- | --- |
| Test framework | [Playwright](https://playwright.dev/) |
| Language | JavaScript |
| App under test | React, Tailwind CSS, Vite, Supabase |

## Test Coverage

| Test file | Focus area | Status |
| --- | --- | --- |
| `tests/authentication.spec.js` | Login, signup, logout, session persistence, route protection | 15 tests |
| `tests/notes.spec.js` | Note creation, editing, pinning, archive/trash | In progress |
| `tests/search.spec.js` | Search behavior and result filtering | Planned |
| `tests/ui.spec.js` | Responsive layout, dark/light mode | Planned |

Covered scenarios in authentication include valid/invalid login, empty-field validation, "Remember Me" persistence, logout, and a security check that an authenticated route can't be accessed after logout.

## Bugs Found

Real bugs discovered through testing, documented with repro steps, expected vs. actual behavior, and the failing Playwright output.

| ID | Title | Severity |
| --- | --- | --- |
| [BUG-001](./bug-reports/BUG-001.md) | Race condition allows a logged-out user to briefly access `/dashboard` | High |
| [BUG-002](./bug-reports/BUG-002.md) | Signup shows a success confirmation when registering with an already-used email | Medium |

<!-- IMAGE PLACEHOLDER: screenshot of a bug report rendered on GitHub -->
![Bug report placeholder](docs/images/bug-report-placeholder.png)

---

## Getting Started

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run the full test suite (headless)
npx playwright test

# Run tests with the interactive UI mode
npx playwright test --ui

# View the last HTML report
npx playwright show-report
```

Tests expect the Noto app running locally at `http://localhost:5173` (see `playwright.config.js`) and Supabase credentials supplied via a local `.env` file (not committed).

## Project Structure

```
noto-qa/
├── bug-reports/           # Documented bugs with repro steps & evidence
├── tests/                 # Playwright end-to-end test specs
├── playwright.config.js   # Playwright configuration
├── PRODUCT_OVERVIEW.md    # Summary of the app under test
└── REQUIREMENTS.md        # Functional requirements used to derive test cases
```

---

## About the App Under Test

Noto is a single-user note-taking app: create, organize, and search notes, with support for folders, colors, pinning, archiving, and trash.

- App repo: [github.com/mangoPixel1/react-notes-app](https://github.com/mangoPixel1/react-notes-app)
- Full feature breakdown: [`PRODUCT_OVERVIEW.md`](./PRODUCT_OVERVIEW.md)

## Contact

Built by Miguel Cavada as a QA/testing portfolio project.
