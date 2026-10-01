# ConnectCircle

### *From Isolation to Interaction*

> **"Less technology. More connection."**

ConnectCircle is a senior-first, accessible, bilingual (English & authentic Urdu) mobile-first web application and Progressive Web App (PWA) designed primarily for senior citizens aged 65+, including retired seniors and seniors who live alone or experience social isolation.

Built as a comprehensive Human-Computer Interaction (HCI) university project, ConnectCircle addresses the barrier between modern smartphones and senior usability. It replaces confusing multi-layer menus and tiny buttons with generous touch targets, clear icons paired with plain-language labels, an encouraging hobby streak system, authentic Urdu script support with RTL layout, voice command navigation, an assistive companion AI helper, and simulated calling.

---

## 🌟 Key Features

1. **First-Screen Bilingual Experience**:
   - Immediate language choice: **🇬🇧 English** or **🇵🇰 اردو (Urdu)**.
   - Authentic Nastaliq / Arabic typography with full Right-to-Left (RTL) mirroring and respectful wording (no Roman Urdu).
2. **Optional Senior-Friendly Tutorial**:
   - 5 simple step cards explaining calls, messages, photos, communities, and the AI helper with "Skip" and "Next" controls.
3. **Simulated Calling System**:
   - Realistic outgoing and incoming phone calls with contact avatar, dialing and ringing audio feedback via Web Audio API, active call duration timer, visual audio waves, mute, speaker, video toggle, and an unmistakable red "End Call" button.
4. **Senior-First Messaging**:
   - High-contrast chat bubbles, simulated audio message recording with waveform preview, photo attachments, delivery/read ticks, and one-tap emoji reactions (👍 ❤️ 😊 🌸 🙏).
5. **Large Photo Gallery**:
   - Senior-friendly single-photo viewer with large "Previous" and "Next" buttons, heart reactions with celebration confetti, and an upload modal with audience privacy controls ("Family Only", "Friends & Family", "All Connections").
6. **Interest-Based Communities**:
   - 8 active senior communities: 🌱 *Gardening & Nature*, 🧶 *Knitting & Crafts*, ♟️ *Chess & Mind Games*, 📚 *Book Club & Stories*, 🍳 *Home Cooking*, 🎵 *Golden Oldies Music*, ✍️ *Poetry & Ghazals*, 🚶 *Walking & Fresh Air*.
   - Join/leave groups, read posts, share community updates, and leave heartwarming comments.
7. **Suite of 9 Engaging Activities & Games**:
   - 🧶 **Knitting & Hobby Streaks** (*Special Feature*): Track projects like "My Blue Scarf" with positive non-punitive reinforcement ("Wonderful! You continued your project today"), photo journal, and daily note logger.
   - 🃏 **Memory Game**: Gentle 12-card matching game with fruits and flowers, turn counter, and victory confetti.
   - 🧩 **Picture Tile Puzzle**: 3x3 nature slide puzzle with tap-to-slide movement.
   - ♟️ **Gentle Chess**: Interactive demonstration chessboard with move logging.
   - 💡 **Daily Fun Quiz**: General-knowledge trivia with immediate friendly explanations.
   - 🎨 **Coloring & Drawing Canvas**: Easy color selection, adjustable brush sizes, clear canvas, and save to memories.
   - 📖 **Short Stories**: Heartwarming readable stories with Text-To-Speech (TTS) audio narration.
   - 🎵 **Music Melodies**: Nostalgic classic sound pattern matching using Web Audio synthesizer chimes.
   - 🌱 **Virtual Garden**: Daily flower care (water 💧, sunlight ☀️, blooming stages).
8. **ConnectCircle Helper (AI Assistant)**:
   - Assistive guide for app usage, navigation, everyday conversation, and English ↔ Urdu translation.
   - Equipped with Text-To-Speech ("Read Answer Aloud") and a clear non-medical disclaimer.
9. **Bilingual Voice Commands**:
   - Web Speech API integration supporting English (`en-US`) and Urdu (`ur-PK`).
   - Supports voice commands: *"Call my daughter"*, *"Open my messages"*, *"Show my photos"*, *"Play a game"*, *"Open communities"*, and Urdu equivalents (*"میری بیٹی کو کال کریں"*, *"میرے پیغامات دکھائیں"*).
   - Confirmation dialog before executing sensitive actions.
10. **Emergency SOS & Caregiver Flow**:
    - High-visibility 🆘 Help button on all screens connecting to Family Emergency Contact (Sarah), Caregiver/Doctor (Dr. Arshad), or simulated emergency services.
11. **Accessibility Suite**:
    - Adjustable font sizes: Small (16px), Standard (18px), Large (21px - Senior Default), Extra Large (25px).
    - High-contrast themes: Standard Soft Warm, High Contrast Dark, High Contrast Amber-on-Black.
    - Reduced motion toggle and screen reader friendly HTML landmarks.
12. **Dual-Mode Backend Architecture**:
    - Zero-configuration local demonstration mode out-of-the-box (pre-seeded with Maggie, Sarah, Robert, and Ahmed).
    - Full PostgreSQL Supabase schema with Row Level Security (RLS) for cloud deployment.

---

## 💻 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom senior design tokens and typography scaling
- **Icons**: Lucide React
- **Audio Feedback**: HTML5 Web Audio API synthesizer (pleasant clicks, ringing tones, connected chimes)
- **Speech**: Web Speech Recognition API (STT) + Web SpeechSynthesis (TTS)
- **Visual Feedback**: Canvas Confetti
- **Backend / Database**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **Hosting / Deployment**: GitHub + Vercel

---

## 🚀 Step-by-Step Instructions: Running and Deploying ConnectCircle

### Step 1: Install Node.js
If not already installed, download and install Node.js (version 18 or newer) from [nodejs.org](https://nodejs.org/).

### Step 2: Clone or Download the Project
```bash
git clone https://github.com/your-username/connectcircle.git
cd connectcircle
```

### Step 3: Open the Project Folder
Open the project folder in Visual Studio Code or your preferred code editor.

### Step 4: Install Dependencies
Open your terminal in the project directory and run:
```bash
npm install
```
*(No heavy tools required: no Docker, no Android Studio, no local database needed).*

### Step 5: (Optional) Create Supabase Project
> **Note**: ConnectCircle runs completely in **Zero-Config Demonstration Mode** without Supabase. If you want persistent cloud storage, follow Steps 5 to 7.
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and choose a project name (e.g., `connectcircle-db`).
3. Note your project URL and anonymous public API key (`anon` key) from **Project Settings > API**.

### Step 6: Run the SQL Schema in Supabase
1. In your Supabase dashboard, navigate to the **SQL Editor** tab on the left sidebar.
2. Open the file `supabase/schema.sql` from this repository.
3. Paste the entire contents into the SQL Editor and click **Run**.
4. This creates all tables (`profiles`, `connections`, `messages`, `photos`, `communities`, `community_posts`, `hobby_projects`, `emergency_contacts`), enables Row Level Security (RLS) policies, and inserts seed data.

### Step 7: Add Supabase Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### Step 8: Run the Development Server
```bash
npm run dev
```

### Step 9: Open the Local URL in a Browser
Vite will start the development server. Open your web browser and navigate to:
```
http://localhost:3000
```
or the port displayed in your terminal.

### Step 10: Push the Project to GitHub
1. Create a new repository on [github.com](https://github.com).
2. Initialize git and push your files:
```bash
git init
git add .
git commit -m "Initial commit: Complete ConnectCircle App"
git branch -M main
git remote add origin https://github.com/your-username/connectcircle.git
git push -u origin main
```

### Step 11: Connect the GitHub Repository to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New > Project**.
3. Import your `connectcircle` repository from GitHub.

### Step 12: Add Environment Variables in Vercel
Under the **Environment Variables** section on Vercel:
- Add `VITE_SUPABASE_URL` with your Supabase URL.
- Add `VITE_SUPABASE_ANON_KEY` with your anon key.
*(If you are evaluating in standalone demo mode, you can leave these blank and Vercel will build the zero-config demo).*

### Step 13: Deploy
Click **Deploy**. Vercel will run `npm run build` and provision your public HTTPS URL in under a minute.

### Step 14: Open the Generated Public URL
Open the URL provided by Vercel on your desktop, tablet, Android phone, or iPhone.

---

## 🧪 Demonstration & HCI Evaluation Guide

For evaluators, university professors, and testers:

1. **First Screen (Language Selection)**:
   - Select **English** or **اردو**. Verify that all UI elements, navigation labels, and RTL layouts adapt.
2. **Onboarding Tutorial**:
   - Review the 5 senior-friendly cards with "Next" or "Skip Tutorial".
3. **Simulated Calling**:
   - On the Home screen, tap **"Call Family"** or choose Sarah from Family connections.
   - Listen to the synthesized telephone ringing tone and see the connected timer and audio waves.
4. **Messaging & Voice Notes**:
   - Open **Messages**, select Sarah, tap the microphone to record a voice note, attach a simulated photo, or send an emoji reaction.
5. **Hobby Streaks (Knitting & Crafts)**:
   - Go to **Activities > 🧶 Knitting Streak**.
   - Review the 12-day streak on "My Blue Scarf". Enter a daily note and tap **"Mark Today's Progress"** to trigger encouraging positive feedback and celebration confetti.
6. **Games & Activities**:
   - Try the **Memory Game** (matching fruit cards), **Picture Tile Puzzle**, **Gentle Chess**, **Daily Fun Quiz**, **Coloring Canvas**, or listen to a **Short Story** via Text-To-Speech.
7. **ConnectCircle Helper (AI Assistant)**:
   - Tap **"Ask for Help"** on the Home screen.
   - Tap a quick prompt such as *"How do I make a call to my family?"* or *"Translate: Good morning in Urdu"*.
   - Tap **"Read Answer Aloud"** to hear the answer spoken.
8. **Voice Commands**:
   - Tap the microphone icon in the top header. Speak *"Call my daughter"* or *"Open my messages"*, or tap the prompt pills.
   - Notice the confirmation modal before the action is executed.
9. **Accessibility & High Contrast**:
   - Tap the eye icon (👁️) in the top header.
   - Toggle between **Large**, **Extra Large**, **High Contrast Dark**, and **High Contrast Amber-on-Black**.
10. **Emergency SOS**:
    - Tap the red **🆘 Help** button in the header or home banner to review the emergency contact flow.
11. **Perspective Switcher**:
    - Go to **Settings** and tap **"Sarah (Daughter / Family)"** to experience how the companion user views the app.

---

## 🛡️ Privacy & Security Design

- **Private Connection Codes**: Seniors cannot be contacted or searched by strangers; connections require sharing an explicit 6-character connection code (e.g. `MAG-72`).
- **Row Level Security (RLS)**: PostgreSQL tables are guarded with user and connection ownership policies.
- **Zero Raw Technical Errors**: Errors are surfaced as calm, reassuring advice rather than stack traces.

---

## 📄 License & Credits

Developed as an HCI University Capstone Project focusing on Gerontechnology and Senior Accessibility.  
Built with love for grandmothers, grandfathers, and families everywhere.
