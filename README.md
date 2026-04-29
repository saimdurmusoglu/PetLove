# PetLove 🐾

PetLove is a responsive web application for pet lovers — browse pet adoption notices, manage your own pets, read the latest news, and find nearby pet-friendly services.

## Live Demo

🔗 [PetLove on Netlify / GitHub Pages](#) ← _deploy linkini buraya ekle_

## Features

- **Authentication** — register, login, logout with persistent session (JWT)
- **Notices** — browse and filter pet adoption listings by category, species, sex, location, and price
- **Favorites** — save and manage your favorite notices (requires login)
- **Profile** — view and edit your profile, upload avatar, manage your own pets
- **Add Pet** — add a new pet with photo, species, birthday, and sex
- **News** — latest pet-related news feed
- **Friends** — discover nearby pet-friendly places with working hours and contact info
- **404 Page** — custom not-found page

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Bundler | Vite |
| State Management | Redux Toolkit |
| Routing | React Router DOM v7 |
| Forms | React Hook Form + Yup |
| HTTP | Axios |
| Styling | CSS Modules |
| UI Extras | React Toastify, React Datepicker, React Select |

## Design

🎨 [Figma Design](#) ← _tasarım linkini buraya ekle_

## Technical Specification

📄 [Technical Specification](#) ← _teknik görev linkini buraya ekle_

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/petlove.git
cd petlove

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your credentials in .env

# Start development server
npm run dev
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Project Structure

```
src/
├── components/       # Reusable UI components (Header, Modals, Loader...)
├── pages/            # Page-level components (Home, Notices, Profile...)
├── redux/            # Redux store and slices
├── services/         # API service functions
├── types/            # TypeScript type definitions
├── hooks/            # Custom React hooks
└── utils/            # Utility functions
```
