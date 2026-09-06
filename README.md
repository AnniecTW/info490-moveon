# MoveOn (INFO 490 - Project 1)

This repository contains the initial Django project scaffolding for the MoveOn application.

---

## Local Environment Setup

Please follow the steps below to set up your local development environment. We are standardizing on **Python 3.12** across all machines to prevent dependency discrepancies.

### Prerequisites
* Git installed and configured
* Python 3.12 (via Conda or native Python)

---

### Getting Started

#### 1. Clone the Repository
```bash
git clone [https://github.com/AnniecTW/info490-moveon.git](https://github.com/AnniecTW/info490-moveon.git)
cd info490-moveon
```

#### 2. Create and Activate Virtual Environment

* **Option A: Using Conda (Recommended)**
  ```bash
  conda create -n moveon-env python=3.12 -y
  conda activate moveon-env
  ```
  
* **Option B: Using Native Python `venv`**
  ```bash
  # macOS / Linux
  python3.12 -m venv .venv
  source .venv/bin/activate

  # Windows (Command Prompt / PowerShell)
  python -m venv .venv
  .venv\Scripts\activate
  ```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Run Migrations & Start Dev Server
Run the built-in system migrations to create your local database, then start the server:

```bash
python manage.py migrate
python manage.py runserver
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in your browser. If you see the Django rocket launch page, your setup is complete!

---

### 📌 Development Notes
* **Never commit local databases or environment secrets:** `db.sqlite3` and `.env` are already excluded via `.gitignore`.
* **Branching Strategy:** Please create feature branches off `main` rather than committing directly to `main`.
