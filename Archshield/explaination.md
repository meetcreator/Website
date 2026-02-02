# ArchShield File Explanations

This document provides a brief explanation of each file in the project to help developers understand the codebase structure and purpose.

## 📂 Root Directory
- **`Architecture.md`**: High-level documentation of the project architecture, tech stack, and setup instructions.
- **`explaination.md`**: This file. A granular guide to every file in the repository.

---

## 📂 Backend (`/backend`)
The backend is built with FastAPI and handles API requests, database operations, and IaC parsing.

### Root Files
- **`.env`**: Stores environment variables (e.g., database URL, secret keys). *Note: Should not be committed to version control.*
- **`archshield.db`**: SQLite database file (if using SQLite). Stores all user and project data locally.
- **`requirements.txt`**: Lists all Python libraries required to run the backend (install with `pip install -r requirements.txt`).

### App Directory (`/backend/app`)
- **`main.py`**: The entry point of the application. Initializes the FastAPI app, sets up CORS, and includes the API router.

#### API (`/backend/app/api`)
- **`api.py`**: Central router file that groups all endpoint routers (login, projects, analysis) together.
- **`endpoints/analysis.py`**: Handles file uploads for analysis (`/upload`), retrieving analysis history, and processing design-tool inputs.
- **`endpoints/login.py`**: Manages user authentication. Includes endpoints for `login` (token generation) and `signup`.
- **`endpoints/projects.py`**: API endpoints for creating, reading, and listing user projects.

#### Core (`/backend/app/core`)
- **`config.py`**: Loads and validates environment variables using Pydantic `BaseSettings`. Defines constraints like `API_V1_STR`.
- **`security.py`**: Contains utility functions for security: verifying passwords (bcrypt) and creating access tokens (JWT).

#### DB (`/backend/app/db`)
- **`session.py`**: Configures the SQLAlchemy database engine and creates the `SessionLocal` class for database connections.
- **`init_db.py`**: (Optional) Script to initialize the database with initial data or tables.

#### Models (`/backend/app/models`)
- **`models.py`**: Defines the database schema using SQLAlchemy. Contains classes for `User`, `Project`, and `Analysis` that map to database tables.

#### Schemas (`/backend/app/schemas`)
- **`schemas.py`**: Defines Pydantic models for data validation. These determine what data is expected in API requests and what is returned in responses (e.g., `UserCreate`, `ProjectBase`).

#### Services (`/backend/app/services`)
- **`parser.py`**: Contains the core logic for parsing Terraform files. Uses regex or logic to extract resources and generate security/cost recommendations.

---

## 📂 Frontend (`/frontend`)
The frontend is a Next.js application using the App Router and Tailwind CSS.

### Root Files
- **`package.json`**: Defines frontend dependencies (React, Next.js, etc.) and scripts (`dev`, `build`, `lint`).
- **`package-lock.json`**: Locks dependency versions to ensure consistent installs.
- **`next.config.ts`**: Configuration file for Next.js (e.g., image domains, compiler options).
- **`tsconfig.json`**: Configuration for the TypeScript compiler.
- **`postcss.config.mjs`**: Configuration for PostCSS (used by Tailwind CSS).
- **`eslint.config.mjs`**: Configuration for ESLint to maintain code quality.
- **`components.json`**: Configuration for existing shadcn/ui components.

### App Directory (`/frontend/app`)
- **`layout.tsx`**: The root layout that wraps the entire application. Defines global fonts and providers.
- **`page.tsx`**: The Landing Page. This is the first page users see (`/`).
- **`globals.css`**: Global CSS styles, including Tailwind directives and generic theme variables.

#### Auth Routes (`/frontend/app/(auth)`)
*(The parentheses mean "auth" is not part of the URL path)*
- **`layout.tsx`**: Specific layout for auth pages (e.g., centering the form).
- **`login/page.tsx`**: The user login page.
- **`signup/page.tsx`**: The user registration page.

#### Dashboard (`/frontend/app/dashboard`)
- **`layout.tsx`**: Layout for the logged-in area. Includes the sidebar navigation and user profile header.
- **`page.tsx`**: The main dashboard overview (charts, recent activity).
- **`analyze/page.tsx`**: Page for analyzing new files. Contains the file upload form.
- **`designer/page.tsx`**: Drag-and-drop architecture designer using React Flow.
- **`history/page.tsx`**: A list view of all previous analysis runs.
- **`recommendations/page.tsx`**: Detailed view of specific analysis results and improvement suggestions.
- **`settings/page.tsx`**: User settings page (profile update, password change).
- **`help/page.tsx`**: Help documentation or support contact page.

### Components (`/frontend/components`)
- **`ui/`**: Directory containing generic, reusable UI components (e.g., `button.tsx`, `card.tsx`, `input.tsx`).
- **`layout/`**: Components specific to page structures (e.g., `Sidebar.tsx`, `Header.tsx`).

### Lib (`/frontend/lib`)
- **`utils.ts`**: Helper functions (e.g., class name merging for Tailwind).
- **`api.ts`** (or similar): specific logic for making API calls to the backend using Axios or Fetch.
