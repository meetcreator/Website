# ArchShield Project Architecture

## 1. Project Overview
ArchShield is a web application designed to analyze Infrastructure-as-Code (IaC) files (specifically Terraform) for security vulnerabilities, cost estimations, and reliability improvements. It features a modern dashboard for managing projects, viewing analysis history, and designing architectures visually.

## 2. Technology Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (based on Radix UI)
- **Icons:** Lucide React
- **Diagramming:** React Flow (@xyflow/react)

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **Language:** Python 3.x
- **ORM:** SQLAlchemy (with Pydantic for validation)
- **Database:** SQLite (default) / PostgreSQL (supported via `psycopg2`)
- **Authentication:** OAuth2 with Password Flow (JWT)

---

## 3. Project Structure

### 📂 Backend (`/backend`)
The backend is organized following the Hexagonal Architecture (Ports and Adapters) pattern to keep business logic separated from API and Database concerns.

| Path | Description |
| :--- | :--- |
| `app/` | Main application source code. |
| `app/main.py` | **Entry Point**. Initializes the FastAPI app, CORS settings, and routes. |
| `app/api/` | Contains API route definitions. |
| `app/api/api.py` | Central router that aggregates all endpoints. |
| `app/api/endpoints/` | Specific API controllers: |
| &nbsp;&nbsp; ├─ `login.py` | Handles User Signup and Login (JWT generation). |
| &nbsp;&nbsp; ├─ `projects.py` | CRUD operations for Projects. |
| &nbsp;&nbsp; └─ `analysis.py` | Logic for parsing files and running analysis rules. |
| `app/core/` | Core configuration settings. |
| &nbsp;&nbsp; ├─ `config.py` | Environment variables and app settings. |
| &nbsp;&nbsp; └─ `security.py` | Password hashing (bcrypt) and Token generation logic. |
| `app/db/` | Database connection handling. |
| &nbsp;&nbsp; └─ `session.py` | Creates the database session. |
| `app/models/` | **SQLAlchemy Models** (Database Tables). |
| &nbsp;&nbsp; └─ `models.py` | Defines `User`, `Project`, and `Analysis` tables. |
| `app/schemas/` | **Pydantic Models** (Data Validation). |
| &nbsp;&nbsp; └─ `schemas.py` | Request/Response schemas (e.g., `UserCreate`, `Project`). |
| `app/services/` | Business Logic independent of the API. |
| &nbsp;&nbsp; └─ `parser.py` | `ArchitectureParser` class. Contains Regex logic to parse Terraform files and generate recommendations. |
| `requirements.txt` | Python dependencies list. |

### 📂 Frontend (`/frontend`)
The frontend uses the Next.js App Router structure where the directory hierarchy determines the URL routes.

| Path | Description |
| :--- | :--- |
| `app/` | Application pages and routing configuration. |
| `app/page.tsx` | **Landing Page**. The public home page of the website. |
| `app/(auth)/` | Route group for authentication pages (URL doesn't include `(auth)`). |
| &nbsp;&nbsp; ├─ `login/` | Login page. |
| &nbsp;&nbsp; └─ `signup/` | Signup page. |
| `app/dashboard/` | **Protected Application Area**. Requires login. |
| &nbsp;&nbsp; ├─ `page.tsx` | Main Dashboard overview. |
| &nbsp;&nbsp; ├─ `analyze/` | File upload and analysis interface. |
| &nbsp;&nbsp; ├─ `designer/` | Drag-and-drop architecture designer (React Flow). |
| &nbsp;&nbsp; ├─ `history/` | List of past analyses. |
| &nbsp;&nbsp; └─ `recommendations/`| Detailed view of security/reliability findings. |
| `components/` | Reusable UI elements. |
| `components/ui/` | **Generic UI Components** (Buttons, Inputs, Cards, etc.) - mostly from Shadcn UI. |
| `components/layout/`| Layout components like Sidebar and Header. |
| `lib/` | Utility functions (API clients, helpers). |
| `package.json` | Node.js dependencies and scripts. |

---

## 4. Key Data Entities
These are the core objects managed by the system (defined in `backend/app/models/models.py`):

1.  **User**: Represents a registered account.
    -   Has `email`, `hashed_password`, `plan_type`.
    -   Owns multiple `Projects`.
2.  **Project**: A workspace for organizing analyses.
    -   Has `name`, `description`, `cloud_provider`.
    -   Belongs to a `User`.
    -   Contains multiple `Analyses`.
3.  **Analysis**: A single run of the security scanner.
    -   Stores `raw_content` (the IaC code).
    -   Calculates `security_score` and `cost_estimate`.
    -   Stores JSON `results` (the structured data from the parser).

---

## 5. How to Compile and Run

### Prerequisites
-   **Python 3.10+** (for Backend)
-   **Node.js 18+** (for Frontend)
-   **Git**

### Step 1: Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the server:

    ```bash
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ```
    *The API will be available at `http://localhost:8000`. API Docs at `http://localhost:8000/docs`.*

### Step 2: Frontend Setup
1.  Open a **new terminal** and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    npm install --force  # if you encounter dependency conflicts
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    *The Frontend will be available at `http://localhost:3000`.*

### Step 3: Usage
1.  Open `http://localhost:3000` in your browser.
2.  Go to **Sign Up** to create an account (data is stored locally in `archshield.db`).
3.  Log in to access the **Dashboard**.
4.  Create a **Project** and start analyzing your Terraform files!
