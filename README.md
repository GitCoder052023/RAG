# 🧠 RAG-Powered AI PDF Chat

A modern, high-performance Retrieval-Augmented Generation (RAG) application that allows users to upload PDF documents and engage in context-aware conversations with an AI assistant. Built with **Next.js 16**, **Express 5**, and **Google Gemini**.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black)
![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey)
![LLM](https://img.shields.io/badge/AI-Google_Gemini-orange)
![VectorDB](https://img.shields.io/badge/VectorDB-Qdrant-red)

---

## 🚀 Features

- **📄 PDF Ingestion**: Advanced PDF parsing using LangChain's `PDFLoader` and `pdf-parse`.
- **🔍 Semantic Search**: Uses **Qdrant Vector Store** with **Gemini Embedding 001** for high-accuracy retrieval.
- **💬 Streaming Chat**: Real-time interaction with **Google Gemini 3 Flash** for ultra-fast reasoning.
- **🛡️ Strict Grounding**: Ensures AI responses stay within the document's context to prevent misinformation.
- **🎨 Modern UI/UX**: Sleek, animated interface built with **Shadcn UI**, **Tailwind CSS v4**, and **Framer Motion**.
- **🚀 Scalable Backend**: Built with **Express 5** for modern, asynchronous request handling and **Zod** for strict type safety.

---

## 🏗️ Tech Stack

### Frontend (`/client`)
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4 + PostCSS
- **Animations**: Framer Motion
- **Components**: Shadcn UI + Lucide React
- **Data Fetching**: Axios + Streaming API Support
- **Feedback**: Sonner (Toasts)

### Backend (`/server`)
- **Runtime**: Node.js + TypeScript
- **Framework**: Express 5 (Alpha)
- **Orchestration**: LangChain
- **AI Model**: Google Generative AI (Gemini 3 Flash)
- **Vector Database**: Qdrant
- **Embeddings**: Google Gemini Embedding (001)
- **Validation**: Zod (for Environment and API Schema)
- **Security**: Helmet, CORS, Rate Limiting

---

## 🏗️ System Architecture

```mermaid
graph TB
    %% Styling
    classDef client fill:#2563eb,stroke:#1e40af,color:#fff,rx:10,ry:10;
    classDef server fill:#059669,stroke:#065f46,color:#fff,rx:10,ry:10;
    classDef ai fill:#7c3aed,stroke:#5b21b6,color:#fff,rx:10,ry:10;
    classDef db fill:#d97706,stroke:#92400e,color:#fff,rx:10,ry:10;
    classDef user fill:#475569,stroke:#1e293b,color:#fff,rx:20,ry:20;

    User([👤 User]):::user

    subgraph Frontend [Next.js Client]
        UI[Chat Interface]:::client
        UP[Upload Panel]:::client
    end

    subgraph Backend [Express Server]
        API[API Gateway]:::server
        SVC[RAG Service]:::server
    end

    subgraph AI_Engine [AI Core]
        LC[LangChain]:::ai
        GEM_L[Gemini 3 Flash]:::ai
        GEM_E[Gemini Embedding]:::ai
    end

    subgraph Storage [Vector Store]
        QD[(Qdrant DB)]:::db
    end

    %% Ingestion Flow
    User -.->|Upload PDF| UP
    UP -.->|Document| API
    API -.->|Processing| LC
    LC -.->|Embed| GEM_E
    GEM_E -.->|Index| QD

    %% Inference Flow
    User ==>|Query| UI
    UI ==>|Stream| API
    API ==>|Search| SVC
    SVC ==>|Retrieve| QD
    QD ==>|Context| SVC
    SVC ==>|Prompt| GEM_L
    GEM_L ==>|Response| UI

    %% Aesthetics
    linkStyle 0,1,2,3,4 stroke:#f59e0b,stroke-width:2px,stroke-dasharray: 5 5;
    linkStyle 5,6,7,8,9,10,11 stroke:#2563eb,stroke-width:2.5px;
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v20+)
- Qdrant Instance (Local or Cloud)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GitCoder052023/RAG.git
   cd RAG
   ```

2. **Setup Backend**
   ```bash
   cd server
   pnpm install
   cp .env.example .env
   # Add your credentials to .env (see below)
   npm dev
   ```

3. **Setup Frontend**
   ```bash
   cd client
   pnpm install
   pnpm dev
   ```

---

## 📖 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/docs/upload` | Upload and vectorize a PDF file |
| `GET` | `/api/chat/stream` | Stream a chat response based on query |
| `GET` | `/api/health` | Check server status |

---

## 🛡️ Environment Variables

### Server
- `PORT`: Server port (default: 8000)
- `GOOGLE_API_KEY`: Your Google AI API key
- `QDRANT_URL`: URL to your Qdrant instance
- `QDRANT_COLLECTION`: Collection name for vectors
- `QDRANT_API_KEY`: (Optional) Qdrant Cloud API key
- `NODE_ENV`: development | production | test
- `ALLOWED_ORIGINS`: CORS configuration (default: *)

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed with ❤️ by [Your Name/Team]
