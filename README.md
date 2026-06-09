# MentorMind 2.0 – AI Assisted Project Management System

MentorMind is a modern, AI-powered project management application designed to automate and streamline software development workflows. By leveraging Google's Gemini LLMs, MentorMind automates requirements breakdown, suggests team allocations, matches developers with appropriate tasks using workload and skill-matching formulas, and provides multimodal evaluation of task submissions.

---

## 🌟 Key Features

*   **Requirements Analyzer & Task Generator**: Upload or write project requirements and let Google Gemini AI automatically parse them into granular, actionable tasks with prioritized urgency levels and skill requirements.
*   **AI Team Allocation**: Automatically suggests specific roles, headcounts, and role descriptions based on the requirements of the project.
*   **Intelligent Auto-Assignment**: Automatically matches tasks to the most suitable team members using a hybrid algorithm combining LLM reasoning and a custom workload-balancing/skill-matching formula:
    $$\text{Score} = (\text{Skill Match} \times 5) + (\text{Workload Factor} \times 3)$$
*   **Multimodal Task Evaluation**: Evaluate task submissions (both textual notes and file uploads like screenshots, resumes, or code logs) against the task description. The AI returns a quality score, confidence, and detailed feedback.
*   **Interactive Kanban Board**: Fully responsive drag-and-drop workflow board using `@dnd-kit` to track tasks across stages (To Do, In Progress, In Review, Completed).
*   **Dynamic Analytics & Charts**: Rich visual dashboards tracking project completion status, workload distribution, and role charts using Chart.js.
*   **Automated Background Notifications**: Cron-scheduled alerts and notifications regarding task deadlines, updates, and feedback.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework**: [React](https://react.dev/) (v18) with [Vite](https://vite.dev/) (v7)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/) (v4) for styling and custom animations
*   **Navigation**: [React Router DOM](https://reactrouter.com/) (v7)
*   **Drag and Drop**: [@dnd-kit/core](https://dnd.kit.com/)
*   **Charts**: [Chart.js](https://www.chartjs.org/) & [React ChartJS 2](https://react-chartjs-2.js.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)

### Backend
*   **Runtime**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
*   **AI Integration**: [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini API)
*   **Authentication**: JSON Web Token (JWT) & `bcryptjs`
*   **Utilities**: `multer` (file uploads), `pdf-parse` (resume parsing), `natural` (NLP tools), `node-cron` (scheduled notifications)

---

## 📂 Project Structure

```text
MentorMind – AI Assisted Project Management System/
├── backend/
│   ├── config/             # DB & configuration setup
│   ├── controllers/        # Express route controllers
│   ├── middleware/         # Auth, validation, & logging middlewares
│   ├── models/             # Mongoose schemas (User, Project, Task, Notification)
│   ├── routes/             # Express routes
│   ├── services/           # Business logic (aiService.js, cronService.js)
│   ├── uploads/            # Temporary directories for user files
│   ├── seed.js             # Initial database seed script
│   └── server.js           # Server entry point
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI elements (Kanban board, charts, forms)
│   │   ├── pages/          # Layouts & Pages (Dashboard, Project Details, Login)
│   │   ├── utils/          # API services & helpers
│   │   ├── App.jsx         # App router and component tree
│   │   └── main.jsx        # Entry point
│   ├── tailwind.config.js  # Styling settings
│   └── vite.config.js      # Build configurations
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB (running locally or a cloud MongoDB Atlas instance)
*   Google Gemini API Key (Optional, fallback simulations will run if missing)

### 1. Clone & Prepare the Project
```bash
cd "MentorMind – AI Assisted Project Management System"
```

### 2. Configure Backend
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install backend dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend/` directory with the following variables:
    ```env
    PORT=5001
    MONGODB_URI=mongodb://127.0.0.1:27017/mentormind
    JWT_SECRET=your_super_secret_jwt_key
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
4.  Seed the Database:
    Populate your database with default dummy projects, tasks, and users:
    ```bash
    npm run seed
    ```

### 3. Configure Frontend
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

The backend server runs on `http://localhost:5001` and the React web app runs on `http://localhost:5173`.

---

## 🔑 Pre-seeded Login Credentials

The `npm run seed` command automatically populates the system with these credentials:

| Email | Password | Role |
| :--- | :--- | :--- |
| `suresh@company.com` | `password123` | Project Manager |
| `arun@company.com` | `password123` | Senior Developer |
| `priya@company.com` | `password123` | UI/UX Designer |
| `kumar@company.com` | `password123` | Backend Developer |
| `anitha@company.com` | `password123` | DevOps Engineer |
| `vijay@company.com` | `password123` | QA Engineer |
| `divya@company.com` | `password123` | Frontend Developer |

---

## 📝 License
This project is proprietary and for educational/assessment purposes.
