# SpaceX Launch Viewer

This is an Angular application designed to display launch data from the SpaceX API. It serves as a demonstration of modern, senior-level Angular development practices, focusing on clean architecture, reactive state management, and a professional user interface built with Angular Material.

## Features

- **View SpaceX Launches**: Displays a list of SpaceX launches in a clean, sortable, and paginated table.
- **Reactive UI**: Built with signals, featuring loading indicators, an empty state and a clear error state with a retry button.
- **Sortable Data**: Click on any column header to sort the launch data (including the nested rocket and launch site columns).
- **Paginated Table**: Easily navigate through large sets of launch data using the paginator.

## Tech Stack

- **Angular 22**: Standalone components, zoneless change detection, signals and the built-in control flow (`@if`).
- **Angular Material 22**: For a high-quality, pre-built set of UI components.
- **TypeScript 6**: For strong typing and improved code quality (strict mode, strict templates).
- **RxJS 7**: For the HTTP layer.
- **GraphQL**: The application communicates with a GraphQL API to fetch data.
- **Vitest + jsdom**: Unit tests via the Angular `unit-test` builder.
- **ESLint (angular-eslint)**: Linting for TypeScript and templates, including accessibility rules.

## Architecture Highlights

- **State Management**: A service-based state store (`LaunchStateService`) exposes read-only signals (`launches`, `loading`, `error`, `hasError`) as the single source of truth. A new fetch cancels a still running previous request.
- **Global Error Handling**: A functional HTTP interceptor (`errorInterceptor`) logs all API errors in one place. GraphQL-level errors (HTTP 200 with an `errors` array or no data) are turned into a `GraphqlError` by `GraphqlService`.
- **Clean Architecture**: A clear separation of concerns between components (UI), state services (state management), and data services (API communication).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `^22.22.3`, `^24.15.0` or `>=26` (which includes npm).
- The Angular CLI is installed locally as a dev dependency; use `npx ng ...` or the npm scripts below. A global install is optional.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd <project-directory>
    ```
3.  **Install dependencies:**
    ```bash
    npm ci
    ```

### Configuration

The GraphQL endpoint is configured in `src/environments/environment.ts` (development) and `src/environments/environment.prod.ts` (production build):

| Setting      | Description                                   |
| ------------ | --------------------------------------------- |
| `apiUrl`     | URL of the SpaceX GraphQL endpoint (root URL) |
| `production` | Whether this is a production build            |

No secrets or API keys are required.

### Running the Development Server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/space-x/` directory.

## Running Unit Tests

Run `npm test` to execute the unit tests with [Vitest](https://vitest.dev/) in watch mode, or `npm test -- --watch=false` for a single run. No browser is required, tests run in jsdom.

## Linting

Run `npm run lint` to lint TypeScript sources and templates.

## Continuous Integration

GitHub Actions (`.github/workflows/ci.yml`) runs lint, unit tests and a production build on every push to `main` and on every pull request.

## Legacy Prototype

The `index.html` in the repository root is the original single-file React/GraphiQL prototype this project was refactored from. It is not part of the Angular build.
