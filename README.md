# 🏥 Health Quest
An AI-powered gamified health tracking app that turns your wellness journey into an adventure — log habits, earn XP, and get personalized AI insights.
 
---
 
## 🚀 Overview
This project lets users:
- 🔐 Log in securely using Google OAuth
- 📋 Submit health data through Google Sheets
- 🤖 Get AI-powered wellness insights via Groq
- 💡 Receive personalized remedies & daily tips
- 🎮 Complete health tasks and earn EXP points
- 📊 Track progress on a real-time React dashboard
---
 
## 🏗️ Architecture
```text
Google Sheets
   ↓
n8n Trigger
   ↓
Groq AI Processing
   ↓
Supabase Database
   ↔
React Dashboard (Vite)
```
 
---
 
## 🔄 Workflow
1. User logs health data via Google Sheets
2. n8n detects new entry and triggers the workflow
3. Groq AI processes the data and returns:
   - Personalized wellness tips
   - Daily health tasks
   - EXP rewards
4. Data is stored in Supabase (PostgreSQL)
5. User logs into the React dashboard
6. Dashboard fetches and displays data in real-time
---
 
## ✨ Features
| Feature | Description |
|--------|------------|
| 🔐 Secure Auth | Google OAuth with Supabase session management |
| 🤖 AI Insights | Personalized health tips powered by Groq AI |
| ✅ Task Tracker | Complete daily tasks & earn EXP |
| 🎮 Gamification | Persistent lifetime EXP system |
| 📊 Analytics | Track sleep, stress & activity over time |
| ⚡ Real-time Updates | Live data sync via Supabase |
| 🔔 Notifications | Task reminders & health alerts |
 
---
 
## 🛠️ Tech Stack
- **Frontend:** React (Vite)
- **Automation:** n8n (Webhooks / ngrok)
- **AI:** Groq API
- **Database:** Supabase (PostgreSQL + RLS)
- **Data Input:** Google Sheets
---
 
## 🗄️ Supabase Schema
 
### `user_profiles`
| Column | Type | Description |
|--------|------|------------|
| id | uuid | Primary key (auth.users) |
| email | text | User email |
| total_exp | int8 | Lifetime EXP points |
| tasks_completed | int8 | Total completed tasks |
 
### `health_responses`
| Column | Type | Description |
|--------|------|------------|
| id | uuid | Primary key |
| user_id | uuid | References user_profiles.id |
| ai_data | jsonb | Stores tips, tasks & insights |
| created_at | timestamptz | Timestamp of entry |
 
---
 
## 📂 Project Structure
```
├── frontend/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── lib/
│       └── supabase.js
├── n8n-workflows/
│   └── workflow.json
└── docs/
    └── architecture.md
```
 
---
 
## ⚙️ Setup
 
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/HealthQuest.git
cd HealthQuest
```
 
### 2️⃣ Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
 
### 3️⃣ Install Dependencies
```bash
npm install
```
 
### 4️⃣ Run the App
```bash
npm run health
```
 
---
 
## 🔗 n8n Setup
1. Create a new workflow in n8n
2. Add the following nodes:
   - **Google Sheets Trigger** — fires on new rows
   - **Groq AI Node** — generates health insights
   - **HTTP Request** — sends data to Supabase API
### Local Testing with ngrok
```bash
ngrok http 5678
```
 
---
 
## 🔮 Future Improvements
- [ ] OAuth authentication
- [ ] Persistent EXP system
- [ ] Mobile app version
- [ ] Weekly AI health reports
- [ ] Streak tracking
---
 
## ⚠️ Disclaimer
This project is for **educational purposes only**. It does **not** provide medical advice. Always consult a qualified healthcare professional for health-related decisions.
 
---
 
## 👨‍💻 Authors
- **Injora**
- **Kartik Tripathi**
- **Soham Dhande**
---
 
## 📜 License
This project is licensed under the [MIT License](LICENSE).
 

