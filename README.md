# 🚀 AI-Powered Resume Builder

A modern, full-stack web application designed to help users create, customize, and export professional, ATS-friendly resumes. Featuring advanced AI-driven features like automated resume parsing from PDFs and intelligent content enhancements.

---

## ⚡ Tech Stack & Badges

![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.9-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Tooling-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Framework-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![OpenAI API](https://img.shields.io/badge/OpenAI%20API-Compatible-412991?style=for-the-badge&logo=openai&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)

---

## 🌟 Key Features

*   **🔒 Secure Authentication**: JWT-based user login, registration, and email-based password reset flows (utilizing Nodemailer).
*   **✍️ Dynamic Resume Builder**: Form-driven sections for Personal Info, Professional Summary, Work Experience, Education, Projects, and Skills.
*   **🎨 Live Customization**: Real-time CSS theme color selection and live preview templates.
*   **🤖 AI Resume Enhancer**: Boost your resume's writing with AI-optimized professional summaries and work experience descriptions.
*   **📄 AI PDF Parser**: Upload your existing PDF resume, and the client-side text extractor (`react-pdftotext`) coupled with the backend LLM will extract structured JSON details to automatically populate the builder.
*   **🖼️ Profile Picture Uploads**: Upload profile photos seamlessly stored and delivered via ImageKit CDN.
*   **📥 PDF Export**: Clean, printable PDF layout downloads of the finished resume.

---

## 📐 System Architecture

```
                                 +--------------------------------+
                                 |         React Frontend         |
                                 |  (Vite + Tailwind CSS + Redux) |
                                 +---------------+----------------+
                                                 |
                                     HTTP / REST | (Axios)
                                                 v
                                 +---------------+----------------+
                                 |        Express Backend         |
                                 |     (Node.js + Middleware)     |
                                 +----+----------+------------+---+
                                      |          |            |
                     Mongoose / MongoDB       |          | OpenAI / Gemini SDK
                                      |          |            |
                                      v          v            v
                               +------+--+ +-----+----+ +-----+-----+
                               | MongoDB | | ImageKit | | OpenAI/Gemini|
                               | Database| | (Images) | | AI Engine  |
                               +---------+ +----------+ +------------+
```

---

## 📂 Project Structure

```
resume-builder/
├── backend/                  # Node.js + Express Backend
│   ├── configs/              # DB & AI configurations
│   ├── controllers/          # Request handler functions
│   ├── middlewares/          # Auth & rate-limiting middlewares
│   ├── models/               # MongoDB Mongoose Schemas
│   ├── routes/               # API route definitions
│   ├── server.js             # Entry point
│   └── package.json
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── Components/       # Modular UI blocks (Forms, Navbar, etc.)
│   │   ├── pages/            # Page layouts (Dashboard, Builder, Login, etc.)
│   │   ├── app/              # Redux Store config
│   │   ├── config/           # API baseUrl config
│   │   ├── App.jsx           # Routing paths
│   │   └── main.jsx          # Render entry point
│   ├── public/               # Static assets
│   ├── index.html
│   ├── server.js             # Production static server
│   └── package.json
├── package.json              # Monorepo task runner configuration
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.x or higher)
*   [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)

### Quick Start (Unified Workspace Commands)

This project has been set up with a root [package.json](file:///d:/Resume-Builder/package.json) to let you install and execute scripts from a single directory.

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd resume-builder
    ```

2.  **Install All Dependencies**:
    ```bash
    npm run install:all
    ```
    This will install both backend and frontend dependencies in one go.

3.  **Configure Environment Variables**:
    *   Create a `.env` file in the `backend` folder.
    *   You can copy the template from [backend/.env.example](file:///d:/Resume-Builder/backend/.env.example):
        ```bash
        cp backend/.env.example backend/.env
        ```
    *   Fill in your API keys (MongoDB, ImageKit, OpenAI/Gemini, SMTP details).

4.  **Start Development Servers**:
    ```bash
    npm run dev
    ```
    This launches both the backend and frontend simultaneously with live-reload.
    *   **Frontend**: `http://localhost:5173`
    *   **Backend**: `http://localhost:5000`

---

## 🔑 Environment Variables Configuration

Create a `.env` file inside `backend/` with the following variables:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `MONGODB_URL` | MongoDB connection URL | `mongodb://localhost:27017` |
| `JWT_SECRET` | Secret key used to sign JWT tokens | `your_secret_key` |
| `IMAGEKIT_PUBLIC_KEY` | Public key from ImageKit dashboard | `your_public_key` |
| `IMAGEKIT_PRIVATE_KEY`| Private key from ImageKit dashboard | `your_private_key` |
| `IMAGEKIT_URL_ENDPOINT`| ImageKit URL endpoint | `https://ik.imagekit.io/project` |
| `GEMINI_API_KEY` | Key for Google Gemini / OpenAI-compatible API | `your_api_key` |
| `OPENAI_BASE_URL` | Base API URL endpoint | `https://api.openai.com/v1` |
| `OPENAI_MODEL` | AI model to target for completions | `gpt-4o-mini` |
| `EMAIL_USER` | SMTP email username for password reset | `noreply@gmail.com` |
| `EMAIL_PASS` | App password (not regular password) for SMTP | `xxxx xxxx xxxx xxxx` |
| `FRONTEND_URL` | URL of the frontend (for CORS verification) | `http://localhost:5173` |
| `PORT` | Local port for Express server | `5000` |

---

## 🔗 API Endpoints

### 🔑 Authentication (`/api/users`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user | No |
| `POST` | `/login` | Log in and get JWT token | No |
| `POST` | `/forgot-password` | Sends password reset email | No |
| `POST` | `/reset-password/:token`| Completes password reset flow | No |
| `GET` | `/data` | Get authenticated user info | **Yes** |

### 📄 Resume Management (`/api/resumes`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/create` | Create a new blank or custom resume | **Yes** |
| `PUT` | `/update` | Update details of a resume | **Yes** |
| `DELETE` | `/delete/:resumeId` | Delete a specific resume | **Yes** |
| `GET` | `/get/:resumeId` | Retrieve resume details by ID | **Yes** |
| `GET` | `/public/:resumeId` | Publicly viewable resume by ID | No |

### 🤖 AI Utilities (`/api/ai`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/enhance-pro-sum` | Enhances professional summary text | **Yes** |
| `POST` | `/enhance-job-desc` | Enhances job responsibilities bullet points | **Yes** |
| `POST` | `/upload-resume` | Extracts JSON fields from parsed PDF text | **Yes** |

---

## 🤖 Deep Dive: AI Parsing Workflow

```
[User PDF Upload] ---> [react-pdftotext Client Parser] ---> [Plain Text Resume]
                                                                  |
                                                                  v
[Mongoose Record] <--- [Create Resume] <--- [JSON Output] <--- [/api/ai/upload-resume]
```

1.  **Client-Side Processing**: The user uploads their existing resume in PDF format. The frontend extracts all readable text locally using `react-pdftotext` to minimize payload sizes and prevent resource consumption on the server.
2.  **API Transport**: The raw text content is transmitted to the backend API (`/api/ai/upload-resume`).
3.  **Structured JSON Generation**: The backend prompts the LLM (using the OpenAI SDK configured with the chosen endpoint/model) with a strict system schema instructions. The LLM extracts the text and maps it directly into standard fields (`personal_info`, `experience`, `projects`, `education`, `skills`).
4.  **Database Sync**: The returned JSON structure is parsed, saved under the user's database records in MongoDB, and the new resume ID is returned to the user, immediately loading it into the builder workspace.

---

## 🚀 Building & Deploying for Production

### Frontend Build
To compile the Vite SPA assets into a lightweight static bundle:
```bash
npm run build:frontend
```
This produces optimized files in `frontend/dist/`.

### Deployment Steps (e.g., Render, Heroku)
1.  **Frontend Static Hosting**: Deploy the `frontend/` directory. Set build command to `npm run build` and publish directory to `dist`. Ensure the fallback route is directed to `index.html` (or host it with the provided `frontend/server.js`).
2.  **Backend Web Service**: Deploy `backend/`. Configure all environment variables in your hosting settings dashboard. Start command should be `npm start` (or `node server.js`).
3.  **CORS & Base URLs**: Make sure the backend `FRONTEND_URL` is set to the frontend deployment domain and the frontend's API config points to the backend server URL.

---

## 🤝 Contributing

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the **ISC License**. See the package configs for details.
