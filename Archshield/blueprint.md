# ArchShield Blueprint

This document serves as the comprehensive structure and file guide for the ArchShield project.

## 📂 Project Root
- **`Architecture.md`**: High-level system architecture and technical stack documentation.
- **`explaination.md`**: Detailed file-by-file explanation of the project.
- **`blueprint.md`**: This file (Project Blueprint).

---

## 📂 Backend (`/backend`)
**Framework**: FastAPI (Python)
**Database**: SQLite (`archshield.db`)
**Dependency Management**: `requirements.txt`

### Core Structure
| Path | Type | Description |
| :--- | :--- | :--- |
| `app/` | Directory | Main application logic. |
| `app/main.py` | File | **Entry Point**. Initializes FastAPI, CORS, and Routes. |
| `app/api/` | Directory | API Route definitions. |
| `app/core/` | Directory | Configuration and Security (Auth/JWT). |
| `app/db/` | Directory | Database connection session and initialization. |
| `app/models/` | Directory | SQLAlchemy ORM Models (DB Tables). |
| `app/schemas/` | Directory | Pydantic Schemas (Request/Response Validation). |
| `app/services/` | Directory | Business logic (e.g., IaC Parser). |
| `.env` | File | Environment variables (Secrets). |
| `requirements.txt` | File | Python dependencies. |

### Key Modules
- **API Router** (`app/api/api.py`): Aggregates all endpoints.
- **Security** (`app/core/security.py`): Handles Password hashing and JWT tokens.
- **Parser** (`app/services/parser.py`): Core logic for parsing Terraform files.
- **Models** (`app/models/models.py`): Defines `User`, `Project`, and `Analysis` entities.

---

## 📂 Frontend (`/frontend`)
**Framework**: Next.js 16 (React)
**Styling**: Tailwind CSS v4, Shadcn UI
**State Management**: React Hooks

### Configuration & Build
| Path | Type | Description |
| :--- | :--- | :--- |
| `package.json` | File | Dependencies and Scripts (`dev`, `build`). |
| `next.config.ts` | File | Next.js Configuration. |
| `tsconfig.json` | File | TypeScript Configuration. |
| `public/` | Directory | Static assets (Images, Fonts). |
| `.next/` | Directory | Build output (Auto-generated). |
| `out/` | Directory | Static Export output. |

### Application Source (`/frontend/app`)
*Note: This specific source directory structure is defined in the project architecture but was not visible in the current file scan. It typically contains:*

- **Routes**:
  - `/` -> `page.tsx` (Landing Page)
  - `/login` -> `(auth)/login/page.tsx`
  - `/signup` -> `(auth)/signup/page.tsx`
  - `/dashboard` -> `dashboard/page.tsx` (Main User Interface)
  
- **Features**:
  - `dashboard/analyze/`: File upload and analysis.
  - `dashboard/designer/`: Architecture designer (React Flow).
  - `dashboard/history/`: Past analysis records.

### Components (`/frontend/components`)
- `ui/`: Reusable primitives (Buttons, Cards, Inputs).
- `layout/`: App shell components (Sidebar, Navbar).

---

## 🔗 Connection Points
1.  **API Communication**: Frontend calls Backend via `http://localhost:8000` (proxied or direct).
2.  **Authentication**: Frontend exchanges credentials for a JWT token from Backend (`/api/login/access-token`).
3.  **Data Flow**: 
    - User uploads TF file (Frontend) -> 
    - Parser service processes it (Backend) -> 
    - JSON Result stored in DB (Backend) -> 
    - Displayed in Dashboard (Frontend).
