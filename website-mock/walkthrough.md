# Olympiad Platform Project Walkthrough

This project is a modern, responsive, and high-converting website for an international Olympiad platform built with **Next.js**, **Tailwind CSS**, and **Firebase**.

## 🚀 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
3.  **View the site**: Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

*   `src/app/`: App Router containing all pages.
    *   `page.tsx`: Premium Homepage with all content sections.
    *   `register/page.tsx`: Student & School registration forms.
    *   `login/page.tsx`: Glassmorphism-styled login.
    *   `dashboard/page.tsx`: User dashboard placeholder with stats and mock tests.
*   `src/components/`: Reusable UI components.
    *   `Navbar.tsx`: Sticky, responsive navigation with glassmorphism.
    *   `Hero.tsx`: High-impact landing section with animations.
    *   `Stats.tsx`, `About.tsx`, `Subjects.tsx`, `HowItWorks.tsx`, `ExamLevels.tsx`, `Awards.tsx`, `Pricing.tsx`, `StudyMaterials.tsx`, `Footer.tsx`.
*   `src/lib/`:
    *   `firebase.ts`: Firebase Auth & Firestore connection (configured with placeholders).
    *   `utils.ts`: Tailwind utility for cleaner class names.
*   `src/app/globals.css`: Custom design system with blue/green gradients and theme tokens.

## ✨ Key Features

*   **Responsive Design**: Fully mobile-first layout using Tailwind CSS.
*   **Modern Aesthetics**: Blue/Green gradients, glassmorphism, and smooth Framer Motion animations.
*   **Lead Generation**: High-converting CTAs throughout the homepage.
*   **Scalable Core**: Prepared structure for Firebase Auth and Firestore registration data.
*   **Student Dashboard**: Professional interface for mock tests, results, and rankings.

## 🛠️ Technology Stack

*   **Framework**: Next.js 15+ (App Router)
*   **Styling**: Tailwind CSS 4+
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **Backend**: Firebase (Auth + Firestore)
