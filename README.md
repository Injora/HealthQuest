# 🧠 AI Health Symptom Checker & Wellness Tracker

![React](https://img.shields.io/badge/Frontend-React-blue)
![n8n](https://img.shields.io/badge/Automation-n8n-orange)
![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-green)

An AI-powered health assistant that analyzes symptoms, predicts possible conditions, and helps users build healthy habits through personalized tasks and gamification.

---

## 🚀 Overview

This project enables users to:

- Submit symptoms via a form
- Get AI-based condition predictions
- Receive personalized remedies and wellness tips
- Track health trends over time
- Complete daily tasks and earn EXP points

---

## 🏗️ Architecture
```text
Google Forms → Google Sheets → n8n → AI Model → Google Sheets → React Dashboard
```

### 🔄 Workflow

1. User submits symptoms via Google Form
2. Data is stored in Google Sheets
3. n8n triggers on new entry
4. AI processes symptoms and returns:
   - Conditions (with probability)
   - Remedies
   - Tasks & tips
5. Results are stored back in Google Sheets
6. React dashboard fetches and displays data

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧾 **Symptom Analysis** | AI-based condition prediction with confidence scores |
| 🤖 **AI Recommendations** | Personalized tips and preventive advice |
| ✅ **Task & Habit Tracker** | AI-generated tasks, mark complete, earn EXP |
| 🎮 **Gamification** | EXP system with level progression |
| 📊 **Analytics** | Sleep, stress & activity trends |
| 🔔 **Notifications** | Task reminders and health alerts |

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite / Next.js)
- **Automation:** n8n
- **AI:** LLM (ChatGPT API)
- **Database:** Google Sheets
- **Forms:** Google Forms

---

## 🔌 API Endpoints (n8n Webhooks)

| Endpoint | Method | Description |
|---|---|---|
| `/user-data` | GET | Fetch user dashboard data |
| `/health-logs` | GET | Get symptom history |
| `/tasks` | GET | Get user tasks |
| `/complete-task` | POST | Mark task complete |
| `/ai-recommendations` | GET | Fetch AI tips |
| `/analytics` | GET | Fetch analytics |

---

## 📂 Project Structure
```
.
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── hooks/
│
├── n8n-workflows/
│   └── workflow.json
│
└── docs/
    └── architecture.md
```

---

## ⚙️ Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/HealthQuest.git
cd HealthQuest
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Run Frontend
```bash
npm run health
```

### 🔗 n8n Setup

1. Create a workflow in n8n
2. Add trigger: Google Sheets (new row)
3. Add AI processing node
4. Save results back to Google Sheets
5. Create webhook endpoints

---

## 📊 Google Sheets Schema

**Health Logs**

| Email | Date | Symptoms | Condition | Confidence | Remedy |
|---|---|---|---|---|---|

**Tasks**

| Email | Task | EXP | Status | Date |
|---|---|---|---|---|

**User Stats**

| Email | Total EXP | Level |
|---|---|---|

---

## ⚠️ Disclaimer

> This project is for **educational purposes only**.  
> It does **NOT** provide medical advice. Always consult a professional.

---

## 🔮 Future Improvements

- [ ] OAuth authentication
- [ ] Mobile app
- [ ] Health score system
- [ ] Weekly AI reports
- [ ] Streak tracking

---

## 👨‍💻 Authors

**Injora**

**Kartik Tripathi**

**Soham Dhande**

---


---

## 📜 License

[MIT](LICENSE)
