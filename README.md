# 🚄 Railway Route Planner & Interchange Optimizer

A full-stack railway route planning application designed to search direct train schedules and compute 2-leg connecting train combinations with customizable layover buffer validations and optimal waiting time sorting.

Built with **React (Vite)**, **Node.js / Express.js**, and a **MySQL** relational database in 3rd Normal Form (3NF).

---

## 🌟 Features

- **Direct Route Discovery**: SQL self-JOIN query matching direct trains with sequence order validation.
- **Connecting Train Engine**: Relational multi-table JOIN algorithm discovering 2-leg transit routes through interchange stations.
- **Midnight Wrap-Around Calculation**: SQL arithmetic handling overnight layovers spanning midnight using `TIME_TO_SEC()` and conditional `CASE` expressions.
- **Layover Buffer Filtering**: Configurable minimum layover buffer validation enforced inside MySQL via `HAVING waiting_time_mins >= (? * 60)`.
- **Optimal Route Sorting**: $O(N \log N)$ sorting directly in SQL (`ORDER BY waiting_time_mins ASC`) guaranteeing the fastest connection appears first.
- **Modern Responsive UX**: Dark-mode glassmorphic theme, custom skeleton shimmer loaders, dynamic `"✨ Fastest Option"` badges, and mobile-friendly layouts.
- **Resilient Backend Architecture**: Express database pool initialization with seamless fallback to mock datasets when offline.

---

## 🛠️ Tech Stack

| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Component-based dynamic SPA interface |
| **Styling** | Vanilla CSS3 | Custom design system, glassmorphism, responsive breakpoints |
| **Backend** | Node.js, Express.js | Modular REST API with layered Routes/Controllers |
| **Database** | MySQL 8.0, `mysql2/promise` | 3NF normalized relational schema & connection pooling |
| **Security** | CORS, Parameterized SQL | Protection against SQL Injection and cross-origin security |

---

## 📐 System Architecture

```text
+-------------------------------------------------------------------+
|                        React Frontend (Vite)                      |
|                  http://localhost:5173 (Port 5173)                |
|                                                                   |
| [ Search Form ] ---> [ Services / API Layer ] ---> [ Render UI ]  |
+----------------------------------|--------------------------------+
                                   | HTTP REST (JSON)
                                   v
+-------------------------------------------------------------------+
|                       Express Backend Server                      |
|                  http://localhost:5000 (Port 5000)                |
|                                                                   |
|   [ CORS Middleware ] -> [ Train Routes ] -> [ Controller Logic ] |
+----------------------------------|--------------------------------+
                                   | SQL Parameterized Queries (?)
                                   v
+-------------------------------------------------------------------+
|                         MySQL Database                            |
|             Schema: stations, trains, train_stops (3NF)           |
|                                                                   |
| [ Self-JOINs ] <-> [ Relational 4-Way JOINs ] <-> [ HAVING Filter ]|
+-------------------------------------------------------------------+
```

---

## 🗄️ Database Schema (3NF)

### 1. `stations` (Master Entity)
- `station_code` (VARCHAR(10), PRIMARY KEY)
- `station_name` (VARCHAR(100))
- `state` (VARCHAR(50))

### 2. `trains` (Master Entity)
- `train_no` (VARCHAR(10), PRIMARY KEY)
- `train_name` (VARCHAR(100))
- `train_type` (VARCHAR(50))

### 3. `train_stops` (Junction Table)
- `id` (INT, PRIMARY KEY AUTO_INCREMENT)
- `train_no` (VARCHAR(10), FOREIGN KEY -> `trains.train_no` ON DELETE CASCADE)
- `station_code` (VARCHAR(10), FOREIGN KEY -> `stations.station_code` ON DELETE CASCADE)
- `stop_order` (INT)
- `arrival_time` (TIME)
- `departure_time` (TIME)
- **Composite Index**: `idx_station_train (station_code, train_no)`

---

## 🔌 API Endpoints

### 1. `GET /api/stations`
- **Description**: Returns the list of all master stations for search dropdowns.
- **Response**: `200 OK`
```json
[
  { "station_code": "CLT", "station_name": "Calicut", "state": "Kerala" },
  { "station_code": "MAS", "station_name": "Chennai Central", "state": "Tamil Nadu" }
]
```

### 2. `POST /api/search`
- **Description**: Searches for direct and 2-leg connecting train routes matching user criteria.
- **Request Body**:
```json
{
  "source": "CLT",
  "destination": "CLX",
  "interchanges": ["MAS"],
  "buffer": 2
}
```
- **Response**: `200 OK`
```json
{
  "directResults": [ ... ],
  "connectingResults": {
    "MAS": [
      {
        "trainA": { "train_no": "12686", "train_name": "Mangalore-Chennai SF Exp", ... },
        "trainB": { "train_no": "12711", "train_name": "Pinakini SF Express", ... },
        "interchangeCode": "MAS",
        "arrA": "08:05:00",
        "depB": "14:10:00",
        "waitingTimeMins": 365,
        "waitingTimeFormatted": "6h 5m"
      }
    ]
  }
}
```

---

## 🚀 Quick Start & Local Installation

### Prerequisites
- **Node.js**: v18.x or higher
- **MySQL Server**: v8.0 or higher (Optional: system falls back to mock data if MySQL service is offline)

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/railway-route-planner.git
cd railway-route-planner
```

### Step 2: Database Setup (MySQL)
1. Log into your MySQL console:
   ```bash
   mysql -u root -p
   ```
2. Execute the DDL and DML scripts located in `server/database/`:
   ```sql
   SOURCE server/database/schema.sql;
   SOURCE server/database/seed.sql;
   ```

### Step 3: Backend Setup (Express)
1. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create `.env` file based on `.env.example`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=train_planner
   ```
3. Start the API server:
   ```bash
   node server.js
   ```

### Step 4: Frontend Setup (React)
1. In a new terminal, navigate to the client folder and install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 📝 Resume Bullet Points (For Internships)

- **Full-Stack Railway Route Planner**: Architected a monorepo Web Application using React, Node.js, Express, and MySQL to query direct and 2-leg connecting train schedules across complex relational timetables.
- **Relational SQL Optimization**: Designed a 3rd Normal Form (3NF) relational schema (`stations`, `trains`, `train_stops`) with composite indexes, reducing query lookup latency for multi-table JOIN operations.
- **Overnight Time Calculation Algorithm**: Developed SQL arithmetic utilizing `TIME_TO_SEC()` and conditional `CASE` statements to handle overnight layover time calculations (+86,400s wrap-around across midnight).
- **Backend Performance & Security**: Built parameterized database queries (`?` placeholders) preventing SQL Injection and utilized connection pooling (`mysql2`) for high-concurrency request handling.
- **Responsive UX & Perceived Speed**: Enhanced user experience by implementing skeleton shimmer loaders, dynamic layout badges, and glassmorphic UI components with mobile responsive breakpoints.

---
