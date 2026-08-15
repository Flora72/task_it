# Task_It 

A focused, lightweight, and modern task management workspace built with React, Vite, Tailwind CSS, and Firebase Firestore. Task_It streamlines daily task organization with PIN-protected notes, custom color theming, online cloud backup, and PDF export.

**Live Application:** [https://task0it.netlify.app/](https://task0it.netlify.app/)

---

## App Previews

|  ||
| :---: | :---: |
| <img src="./public/screenshots/screen1.png" alt="Landing Page" width="450" /> | <img src="./public/screenshots/screen2.png" alt="Workspace Dark Mode" width="450" /> |
| ||
| <img src="./public/screenshots/screen3.png" alt="Task Creation Modal" width="450" /> | <img src="./public/screenshots/screen4.png" alt="Workspace Light Mode" width="450" /> |
| ||
| <img src="./public/screenshots/screen5.png" alt="Account Settings Modal" width="450" /> | <img src="./public/screenshots/screen6.png" alt="Change Password View" width="450" /> |
|  | |
| <img src="./public/screenshots/screen7.png" alt="Initial Workspace View" width="450" /> |<img src="./public/screenshots/screen8.png" alt="Initial Workspace View" width="450" /> |

---

## Features

- **Intuitive Task Management**: Create, edit, prioritize, pin, and organize tasks with custom color spines and tags.
- **PIN-Protected Notes**: Lock sensitive notes and to-dos behind a secure 4-digit PIN lock.
- **Custom Color Engine**: Dark/Light mode support with a real-time color wheel picker and preset palettes.
- **Cloud Backup & Sync**: One-click manual online workspace backup to Cloud Firestore with live sync indicators.
- **Print & PDF Export**: Integrated print styling optimized for clean, distraction-free document export.
- **Instant Search & Filter**: Real-time search by keywords, status filters (Pending, In Progress, Done), and custom tag labels.
- **Keyboard Shortcuts**: Built-in shortcuts for fast workflow (`N` for new task, `/` for search bar).
- **Responsive Layout**: Fluid grid and list views across mobile, tablet, and desktop screens.

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Icons**: Lucide React
- **Authentication & Database**: Firebase Auth & Cloud Firestore
- **Deployment**: Netlify 

---

## Project Structure

```text
task_it/
├── public/
│   ├── screenshots/            # App preview images (screen1.png to screen8.png)
│   ├── _redirects              # Netlify client-side routing redirect rules
│   ├── favicon.png             # Workspace favicon
│   └── hero-character.png      # 3D landing page hero character
├── src/
│   ├── components/
│   │   ├── AccountModal.jsx        # User profile & password management
│   │   ├── Auth.jsx                # Login / Registration with password strength meter
│   │   ├── ColorWheelPicker.jsx    # Custom hex palette engine
│   │   ├── ConfirmDeleteModal.jsx  # Task deletion confirmation dialog
│   │   ├── LandingPage.jsx         # 3D character hero welcome screen
│   │   ├── LockPinModal.jsx        # 4-digit PIN lock interface
│   │   ├── TaskCard.jsx            # Interactive task/note component
│   │   └── TaskModal.jsx           # Task creation & editing interface
│   ├── context/
│   │   ├── AuthContext.jsx         # Firebase authentication state provider
│   │   └── ThemeContext.jsx        # Theme & accent color state provider
│   ├── services/
│   │   ├── firebase.js             # Firebase initialization & configuration
│   │   └── taskService.js          # Firestore CRUD & cloud backup operations
│   ├── App.jsx                     # Core workspace dashboard & route handling
│   ├── index.css                   # Custom keyframes, utility classes & print styles
│   └── main.jsx                    # Application entry point
├── .env.example                    # Environment variable template
├── .gitignore                      # Git ignored files & dependencies
├── firestore.rules                 # Cloud Firestore security rules
├── package.json
└── vite.config.js

```

---

## Getting Started

### 1. Prerequisites

* Node.js (v18+)
* npm (v9+)

### 2. Clone the Repository

```bash
git clone [https://github.com/Flora72/task_it](https://github.com/Flora72/task_it)
cd task_it

```

### 3. Install Dependencies

```bash
npm install

```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

```

### 5. Run Locally

```bash
npm run dev

```

Open `http://localhost:5173` in your browser.

---

## Architecture & Design Decisions

* **State Management**: Built on React Context (`AuthContext`, `ThemeContext`) to isolate authentication, theme toggles, and accent color preferences cleanly without heavy external state libraries.


* **Real-Time Data Layer**: Utilizes Firestore's `onSnapshot` listener in `App.jsx` for instant bi-directional updates across user sessions.
* **Component Modularity**: Modal operations (`TaskModal`, `ConfirmDeleteModal`, `LockPinModal`, `AccountModal`) are separated into standalone components to enforce clean single-responsibility boundaries.


* **SPA Routing Support**: Includes a `public/_redirects` file (`/* /index.html 200`) to guarantee browser refreshes on Netlify do not result in 404 errors.

---

## Security & Data Access Control

Firebase Firestore security rules ensure that authenticated users can only read, create, update, or delete their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /user_backups/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

```

---

## Assumptions & Limitations

* **Task Media**: Task cover photos accept base64 image strings or direct URLs to avoid additional cloud storage overhead.
* **PIN Verification**: The 4-digit PIN lock is verified on the client interface; enterprise implementations would benefit from server-side cryptographic hashing via Cloud Functions.
* **Offline Persistence**: Continuous syncing relies on an active internet connection, backed by Firestore’s built-in offline caching for temporary connectivity interruptions.

---

## If I Had More Time

* **Automated Testing**: Write automated unit tests for utility functions with Vitest and end-to-end flows with Playwright.


* **Subtasks & Nested Checklists**: Allow multi-step task breakdowns within individual task cards.
* **Drag-and-Drop Kanban View**: Support moving cards between status columns using `@hello-pangea/dnd`.
* **Offline PWA Support**: Implement service worker background sync for offline capability.

---

## Deployment (Netlify)

1. Connect the GitHub repository to **Netlify**.


2. Set build command to `npm run build` and publish directory to `dist`.
3. Add the `VITE_FIREBASE_*` environment variables in **Site configuration > Environment variables**.
4. In the **Firebase Console**, register your Netlify domain under **Authentication > Settings > Authorized Domains**.

---

## License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

```

```
