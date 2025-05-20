# 🧩 SoloCMR

**SoloCMR** is a lightweight and modular CRM (Customer Relationship Manager) built with **Flask + React**.  
It's tailored for solopreneurs and small service-based businesses to manage clients, track due dates, send reminders, and visualize workload — all in one place.

---

## 🚀 Features

- 🗂️ Full **CRUD** for client records (name, email, service, due date, notes)
- 📅 **Calendar View** using React Big Calendar
- ✉️ **Automated Email Alerts** (upcoming, due today, overdue)
- 🌓 **Light/Dark Mode Toggle**
- 🔍 **Client Search & Filters**
- 📊 **Analytics Dashboard** with charts and overdue stats
- 🖨️ **Print to PDF** feature *(coming soon)*
- 🔐 **JWT Authentication** (Login/Register with token-based access)
- ⚙️ **Notification Settings** per user (custom alert timing, snooze)

---

## 🧰 Tech Stack

**Frontend:**
- React 19
- Bootstrap 5
- Framer Motion
- Recharts
- React Big Calendar
- Axios

**Backend:**
- Flask (with Blueprints)
- Flask-JWT-Extended
- Flask-Mail
- APScheduler (for daily alerts)
- SQLite (dev) / PostgreSQL (deploy-ready)

**Tooling:**
- Git & GitHub
- VS Code
- Postman (for API testing)

---

## 🛠️ Installation

### 1. Clone the Repo

```bash
git clone https://github.com/grisottoc/SoloCMR.git
cd SoloCMR
```

---

### 2. Backend Setup (Flask)

```bash
cd solocmr/backend
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate on mac/Linux
pip install -r requirements.txt
```

#### ✅ Environment Variables

Create a `.env` file in `solocmr/backend/`:

```env
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_password
JWT_SECRET_KEY=supersecretkey
```

Run the backend:

```bash
set FLASK_APP=main.py && flask run  # Windows
# OR
export FLASK_APP=main.py && flask run  # macOS/Linux
```

---

### 3. Frontend Setup (React)

```bash
cd ../../frontend
npm install
npm start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Auth Demo

- Register a user at `/register`
- Login at `/login`
- Access dashboard, calendar, notifications, and analytics
- Token is stored in `localStorage` for protected routes

---

## 🧪 Tests

Unit tests for email logic are located in:

```bash
solocmr/backend/tests/
```
Run with:

```bash
python -m unittest discover tests
```

---

## 📸 Screenshots (optional)

_Add screenshots of your dashboard, calendar, or login page here if desired._

---

## 📌 Roadmap

- [x] JWT Auth
- [x] Email Reminder System
- [x] Notification Settings Panel
- [ ] Print to PDF
- [ ] Drag-and-drop calendar
- [ ] Stripe/Payments integration

---

## 📄 License

MIT © [Claudio Grisotto](https://github.com/grisottoc)

---

## 🙌 Contribute or Feedback?

Feel free to open an issue or pull request. Feedback is always welcome!
