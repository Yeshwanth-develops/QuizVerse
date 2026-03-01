# QuizVerse

A full-stack quiz application with role-based access control, admin dashboard, restricted quiz assignment, attempt limits, and performance analytics.

Built using React + Firebase (Auth + Firestore).

## 🚀 Features

### 👤 User Features

Register using 5-digit PSID

Secure login using PSID + password

Attempt quizzes with timer

Auto-submit on timeout

Attempt limit enforcement

View performance dashboard:

Total attempts

Average score

Best score

Recent attempts

Restricted quizzes hidden automatically

###🛡️ Admin Features

Admin dashboard with:

Total Users

Total Quizzes

Total Attempts

Average Score Analytics

Create, update, delete quizzes

Set time limit per quiz

Restrict quizzes to selected users

Assign users to quizzes

Reset attempts per user

Promote / demote users to admin

Delete users

Role-based Firestore security rules

## 🏗️ Tech Stack

### Frontend

React

React Router

Context API

Modern UI (custom styled components)

### Backend

Firebase Authentication

Cloud Firestore

Firestore Security Rules

## 🔐 Role-Based Access Control

Role	Permissions

User	Attempt quizzes, view own dashboard

Admin	Manage users, manage quizzes, assign restrictions

Security is enforced using Firestore Rules — not just frontend logic.

## ⏱️ Quiz Flow

User selects quiz

Attempt limit checked

Timer starts

Auto-submit on time expiry

Attempt stored in Firestore

Dashboard updates in real-time

## 📊 Admin Dashboard Overview

User count

Quiz count

Attempt count

Average system score

Manage users panel

Manage quizzes panel

##🔒 Firestore Data Structure

users
users/{uid}
  - name
  - psid
  - email
  - role (user | admin)
quizzes
quizzes/{quizId}
  - title
  - description
  - questions[]
  - timeLimit
  - isRestricted
  - assignedUsers[]
attempts
attempts/{attemptId}
  - userId
  - quizId
  - score
  - percentage
  - createdAt
    
psidIndex
psidIndex/{psid}

  - uid
  - email

## 🔧 Installation

### 1️⃣ Clone the repository
git clone https://github.com/Yeshwanth-develops/QuizVerse.git

cd quizmaster

### 2️⃣ Install dependencies

npm install

### 3️⃣ Configure Firebase

Create a .env file:

VITE_FIREBASE_API_KEY=your_key

VITE_FIREBASE_AUTH_DOMAIN=your_domain

VITE_FIREBASE_PROJECT_ID=your_project_id

VITE_FIREBASE_STORAGE_BUCKET=your_bucket

VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender

VITE_FIREBASE_APP_ID=your_app_id

### 4️⃣ Run the project

npm run dev

## 🛡️ Security Highlights

PSID-based authentication layer

Role-based Firestore access control

Admin-only write access

Attempt limit enforcement

Restricted quiz visibility control

Self-role modification protection

## 📈 Future Improvements

Email notifications

Quiz scheduling (start/end time)

CSV export of results

Leaderboard

Analytics charts

Super-admin role

Soft delete users

Password reset via PSID

## 📸 Screenshots

<img width="613" height="425" alt="Welcome Page" src="https://github.com/user-attachments/assets/30220ad8-2046-4704-97e6-45a31567ae90" />

<img width="434" height="315" alt="Login Page" src="https://github.com/user-attachments/assets/e3a333c9-90d7-4e8f-80ff-7af289e06b8d" />

<img width="944" height="460" alt="Dashboard" src="https://github.com/user-attachments/assets/8d0a20fc-0762-4257-95ce-a9674ab1183a" />

## 🎓 Learning Outcomes

This project demonstrates:

Full-stack architecture with Firebase

Role-based security implementation

Scalable Firestore design

Complex UI state management

Real-world LMS-style access control

## 👨‍💻 Author

Yeshwanth Sunkara
B.Tech Student | Full Stack & AI Enthusiast
