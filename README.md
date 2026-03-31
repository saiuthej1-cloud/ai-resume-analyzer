# 🤖 AI Resume Analyzer

A full-stack web application for uploading and analyzing candidate resumes.

**Stack:** Java 21 + Spring Boot 3.5 (backend) · React 18 (frontend)

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/example/resumeanalyzer/
│       │   ├── ResumeanalyzerApplication.java   ← Spring Boot entry point
│       │   ├── model/Resume.java                ← Resume data model
│       │   └── controller/ResumeController.java ← REST API endpoints
│       └── resources/
│           └── application.properties
└── frontend/
    ├── package.json
    ├── public/index.html
    └── src/
        ├── index.js
        ├── App.js
        ├── App.css
        └── components/
            ├── UploadResume.js
            └── ViewResumes.js
```

---

## 🚀 Running the Project

### Prerequisites
- Java 21+ (`java -version`)
- Maven 3.8+ (`mvn -version`)
- Node.js 18+ and npm (`node -v`, `npm -v`)

---

### 1. Start the Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend starts on **http://localhost:8080**

---

### 2. Start the Frontend (React)

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

The frontend starts on **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| POST   | /api/resumes/add       | Upload a new resume      |
| GET    | /api/resumes/all       | Get all resumes          |
| GET    | /api/resumes/{id}      | Get resume by ID         |
| DELETE | /api/resumes/{id}      | Delete resume by ID      |
| GET    | /api/resumes/health    | Health check             |

---

## 📦 Sample Resume JSON

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "skills": "Java, Spring Boot, React",
  "experience": "3 years of full-stack development",
  "education": "B.Tech CS, NIT Warangal",
  "summary": "Passionate engineer with a focus on clean architecture"
}
```

### Test with curl

```bash
# Add a resume
curl -X POST http://localhost:8080/api/resumes/add \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","skills":"Java, React"}'

# Get all resumes
curl http://localhost:8080/api/resumes/all

# Health check
curl http://localhost:8080/api/resumes/health
```

---

## ✨ Features

- **Upload resumes** via form UI or raw JSON paste
- **View all resumes** in a searchable list with click-to-expand detail panel
- **Delete resumes** individually
- **Sample data loader** for quick testing
- **CORS enabled** for localhost:3000 and localhost:5173
- **In-memory storage** (restarts clear data — swap ArrayList for a DB in production)

---

## 🛠 Troubleshooting

| Issue | Fix |
|-------|-----|
| `Cannot reach backend` | Ensure `mvn spring-boot:run` completed without errors |
| Port 8080 in use | Change `server.port` in `application.properties` |
| Port 3000 in use | React will prompt to use a different port |
| CORS error | Confirm backend `@CrossOrigin` includes your frontend URL |
| Maven build fails | Confirm `java -version` shows 21+ |

---

## 📈 Extending the Project

- Swap `ArrayList` with a JPA repository + H2/PostgreSQL for persistence
- Add file upload support (PDF parsing with Apache PDFBox)
- Integrate OpenAI API for skill gap analysis
- Add authentication with Spring Security + JWT
