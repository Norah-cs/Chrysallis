# 🦋 Chrysallis

> **Omegle for interview prep**: a peer-matching platform where undergraduate students in tech practice interviews, share goals, and grow together in real time.

**🏆 Best Use of Gemini API** — [TechNova Hackathon](https://itstechnova.org/) @ University of Waterloo, hosted by [Major League Hacking](https://mlh.io/)

---

<img width="1280" height="743" alt="image" src="https://github.com/user-attachments/assets/5883fbf5-8fe5-44b1-88b2-42c89a6b8002" />

---

## The Problem

Breaking into tech is overwhelming without mentorship, practice, or a supportive peer network. Most students either prep alone or lack access to structured, low-stakes environments to practice interviews with peers who *get it*.

Chrysallis bridges that gap.

---

## What It Does

Chrysallis matches undergraduate students in **themed practice rooms** for real-time peer sessions, powered by AI guidance and structured feedback.

| Feature | Description |
|---|---|
| **Themed Rooms** | Coding challenges, elevator pitches, behavioural questions, system design |
| **Goal Sharing** | View each other's focus areas and goals before every session |
| **AI Assistant** | Gemini-powered prompts and live note-taking during sessions |
| **Structured Feedback** | Clear post-session feedback to track growth over time |

---

## ⚙️ Tech Stack

**Frontend**
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

**Backend**
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) — real-time data syncing

**AI & Communication**
- [Google Gemini API](https://ai.google.dev/) — contextual prompts & live notes
- [WebRTC](https://webrtc.org/) — peer-to-peer video communication

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

```bash
# Clone the repo
git clone https://github.com/Norah-cs/Chrysallis.git
cd Chrysallis

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the root and in `/backend`:

```env
# Root .env
VITE_GEMINI_API_KEY=your_gemini_api_key

# backend/.env
MONGODB_URI=your_mongodb_connection_string
PORT=3001
```

### Running the App

```bash
# Start the backend (from /backend)
npm run dev

# Start the frontend (from root)
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## What's Next

We're actively working on expanding Chrysallis:

- **Smarter matching** based on skills and goals
- **AI-powered session replays** with feedback highlights
- **Sentiment analysis** for tone and body language improvements
- **Alumni mentor integration** to connect students with industry professionals

---

## 👥 Team

Built with ❤️ at TechNova 2025 by Norah, Kavya, Mahati, and Aaisha.
