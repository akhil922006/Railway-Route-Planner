# Project Learning Log - Railway Route Planner

This document serves as your learning journal and interview preparation resource. Every phase's learnings, key concepts, folder structures, commands, and potential interview questions are recorded here.

---

## Phase 1: Project Planning and Setup

### What was built
- Initialized the workspace folder structure.
- Explored Vite commands and created the React application skeleton inside `client/`.
- Designed the initial static layout for the Search Page with the search form and placeholder search results.

### Folder Structure
```text
trains/
├── PROJECT_PROGRESS.md
├── PROJECT_LEARNING_LOG.md
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        └── pages/
            ├── SearchPage.jsx
            └── SearchPage.css
```

### Files Created & Purpose
1. `PROJECT_PROGRESS.md`: Project status and technical decision tracker.
2. `PROJECT_LEARNING_LOG.md`: Learning journal and interview preparation logs.
3. `client/src/pages/SearchPage.jsx`: The React component representing our main search view, rendering the form and results sections.
4. `client/src/pages/SearchPage.css`: Vanilla CSS stylesheet for styling the search forms, result cards, and layout elements.
5. `client/src/App.jsx`: The main React component that integrates the SearchPage.

### New React Concepts Learned
- **Components**: Self-contained, reusable building blocks of user interfaces.
- **JSX (JavaScript XML)**: A syntax extension that allows us to write HTML-like elements inside JavaScript.
- **Single Page Application (SPA)**: A web app that loads a single HTML page and dynamically updates it as the user interacts, without page refreshes.

### New Node.js/Express Concepts Learned
- *None in this phase (Backend is introduced in Phase 3)*.

### New MySQL Concepts Learned
- *None in this phase (Database is introduced in Phase 5)*.

### Commands Used
- `npx -y create-vite@latest client --template react`: To initialize a new React client with Vite.
- `npm install`: To install package dependencies.
- `npm run dev`: To start the local Vite development server.

### Common Mistakes to Avoid
- **Confusing JSX with HTML**: JSX has subtle differences like using `className` instead of `class` and `htmlFor` instead of `for`, because `class` and `for` are reserved keywords in JavaScript.
- **Putting all UI code in a single file**: Keep things modular by creating page components inside `src/pages/`.

### Key Interview Points
- **Vite vs Create React App (CRA)**: Vite uses native ES modules (ESM) in the browser during development. It doesn't bundle the whole app before serving, making startup and updates near-instantaneous. CRA uses Webpack, which bundles the entire application before it can be served, leading to slow start times as the app grows.
- **Component-Based UI**: Explain how modular UI helps in team collaboration, reusability, testability, and separation of concerns.

---

## Phase 2: React Fundamentals (State, Props, and Form Logic)

### What was built
- Replaced the static layout of the Search Page with a fully interactive form.
- Bound all form input fields (Source, Destination, Interchanges, and Buffer Time) to React component state.
- Implemented client-side validations to ensure source and destination are different, there are no duplicates in selection, and buffer boundaries are maintained.
- Built client-side search logic executing on a mock dataset representing stations, trains, and schedule stops.
- Created route calculators to find Direct Trains, Connecting Trains matching minimum layover, and sort results by waiting time in ascending order.

### Folder Structure
```text
trains/
├── PROJECT_PROGRESS.md
├── PROJECT_LEARNING_LOG.md
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.css
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        └── pages/
            ├── SearchPage.jsx
            └── SearchPage.css
```

### Files Created & Purpose
- *No new files were created in this phase.*
- `client/src/pages/SearchPage.jsx` was modified to transition from a static mockup to a dynamic, state-controlled page using React Hooks and custom route-search algorithms.

### New React Concepts Learned
- **State Hooks (`useState`)**: React's built-in Hook to declare reactive variable states in functional components. Updating the state triggers a re-render.
- **Controlled Components**: Binding form input values to React state and synchronizing input changes with React state via `onChange` events.
- **Dynamic Array Rendering**: Using `.map()` inside JSX to loop through search results and render UI cards dynamically, using a unique `key` attribute for list reconciliation.
- **Conditional Rendering**: Using ternary operators (`condition ? JSX1 : JSX2`) or logical AND (`condition && JSX`) to render elements based on state (e.g. displaying search results or showing empty/initial state placeholders).

### New Node.js/Express Concepts Learned
- *None in this phase (Backend is introduced in Phase 3)*.

### New MySQL Concepts Learned
- *None in this phase (Database is introduced in Phase 5)*.

### Commands Used
- `npm run build`: To verify frontend JSX compiling and assets bundling.

### Common Mistakes to Avoid
- **Direct State Mutation**: Never mutate state variables directly (e.g., `directResults.push(newRoute)`). Always use the set state functions (e.g., `setDirectResults([...direct, newRoute])`) to notify React of changes so it updates the browser DOM.
- **Missing `key` Prop in Lists**: Forgetting to add a unique `key` prop when rendering arrays in JSX causes React warning logs and inefficient DOM updates.
- **Incorrect Time Wrap-Arounds**: Assuming arrivals always happen on the same calendar day. The calculation must account for "+1 day" overnight layovers by wrapping hours using module math `(departure + 1440) - arrival`.

### Key Interview Points
- **Controlled vs. Uncontrolled Components**: A Controlled Component relies on React state as its single source of truth for input values, updating via event handlers. An Uncontrolled Component retains state in the browser DOM and is accessed via React refs.
- **Why is `key` necessary in lists?**: React uses the `key` attribute to identify which items have changed, been added, or been removed. It optimizes the reconciliation process, avoiding full-list re-renders and preserving state for specific sub-components.
- **React State Updates are Asynchronous**: React batches state updates for performance. Calling a setter function doesn't instantly change the variable on the next line of code, but schedules a re-render.

---

## Phase 3: Node.js and Express Fundamentals

### What was built
- Initialized a Node.js server inside the `server/` directory.
- Installed Express.js, CORS, dotenv, and nodemon.
- Designed a clean layered architecture with Models, Controllers, and Routes.
- Created REST API endpoints:
  - `GET /api/stations`: Returns list of available stations.
  - `POST /api/search`: Accepts JSON payload `{ source, destination, interchanges, buffer }` and calculates direct and connecting train combinations with layover buffer validation and sorting.
- Verified REST endpoints using API client calls.

### Folder Structure
```text
trains/
├── PROJECT_PROGRESS.md
├── PROJECT_LEARNING_LOG.md
├── client/
└── server/
    ├── package.json
    ├── server.js
    ├── models/
    │   └── mockData.js
    ├── controllers/
    │   └── trainController.js
    └── routes/
        └── trainRoutes.js
```

### Files Created & Purpose
1. `server/package.json`: Server package manifest configured with `"type": "module"` for ES import/export syntax and dev scripts.
2. `server/server.js`: Server entry point that initializes the Express app, mounts CORS and JSON middlewares, connects routes, and listens on port 5000.
3. `server/models/mockData.js`: Centralized mock dataset for stations, trains, and schedule stops.
4. `server/controllers/trainController.js`: Controller functions containing backend validation, direct route matching, layover calculation, and sorting logic.
5. `server/routes/trainRoutes.js`: Express Router instance mapping HTTP methods and endpoints (`GET /stations`, `POST /search`) to controller handlers.

### New React Concepts Learned
- *None in this phase (Focus was on Backend)*.

### New Node.js Concepts Learned
- **Node Runtime**: Executing JavaScript on the server environment using `node server.js`.
- **ES Modules (`import/export`)**: Modern module system enabled via `"type": "module"` in `package.json`.

### New Express Concepts Learned
- **Express App & Server Listener**: Creating a web server instance using `express()` and opening port sockets with `app.listen(PORT)`.
- **Middleware (`app.use`)**: Functions that execute during the Request-Response lifecycle before reaching route controllers (e.g. `cors()` for cross-origin permissions and `express.json()` for parsing incoming JSON request bodies).
- **Express Router (`express.Router()`)**: Modular, mini-Express routing instances that keep endpoints organized across separate files.
- **Request (`req`) & Response (`res`) Objects**: `req.body` accesses incoming payload data; `res.status(code).json(data)` sends HTTP status codes and JSON payloads back to the client.

### New MySQL Concepts Learned
- *None in this phase (Database is introduced in Phase 5)*.

### Commands Used
- `npm install express cors dotenv nodemon`: Installs Express framework and helper utilities.
- `node server.js`: Runs the Express API server.

### Common Mistakes to Avoid
- **Missing `express.json()` Middleware**: Without `app.use(express.json())`, accessing `req.body` in `POST` routes results in `undefined`.
- **Omitting CORS**: Browsers block frontend apps (`http://localhost:5173`) from making fetch calls to a backend running on a different port (`http://localhost:5000`) unless `cors()` middleware is active on Express.
- **Monolithic File Structure**: Placing all server configuration, route definitions, and calculation logic in a single file instead of decoupling them into Routes, Controllers, and Models.

### Key Interview Points
- **What is Express Middleware?**: Middleware functions are functions that have access to the request object (`req`), response object (`res`), and the `next` function in the application's request-response cycle. They can execute code, modify request/response objects, end the request-response cycle, or call `next()`.
- **HTTP Status Codes**:
  - `200 OK`: Successful request execution.
  - `400 Bad Request`: Client sent invalid data (e.g., missing required fields).
  - `500 Internal Server Error`: Unexpected server-side failure.
- **Why separate Routes and Controllers?**: Decoupling routing definitions from execution logic makes code testable, maintainable, and easy to scale.

---

## Phase 4: Frontend and Backend Integration

### What was built
- Created an API Service layer at `client/src/services/api.js` using native JavaScript Fetch API.
- Refactored `SearchPage.jsx` to fetch station options dynamically from `GET /api/stations` on component mount.
- Connected the search form to perform asynchronous HTTP `POST` requests to `http://localhost:5000/api/search`.
- Added dynamic loading UI spinners and network error message banners.

### Folder Structure
```text
trains/
├── PROJECT_PROGRESS.md
├── PROJECT_LEARNING_LOG.md
├── client/
│   └── src/
│       ├── services/
│       │   └── api.js
│       └── pages/
│           ├── SearchPage.jsx
│           └── SearchPage.css
└── server/
    ├── package.json
    ├── server.js
    ├── models/
    │   └── mockData.js
    ├── controllers/
    │   └── trainController.js
    └── routes/
        └── trainRoutes.js
```

### Files Created & Purpose
1. `client/src/services/api.js`: Centralized service file defining `fetchStations` and `searchTrainRoutes` network helper functions.
2. `client/src/pages/SearchPage.jsx`: Modified to remove static mock arrays and trigger dynamic API calls using `useEffect` and `async`/`await`.

### New React Concepts Learned
- **`useEffect` Hook**: Executes side-effects in functional components. Passing an empty dependency array `[]` ensures the effect runs only once when the component mounts.
- **Asynchronous State Management**: Updating UI state flags (`loading`, `apiError`, `stations`, `directResults`) based on asynchronous API responses.

### New JavaScript Concepts Learned
- **Fetch API**: Modern native browser API for making HTTP requests (`fetch(url, options)`).
- **`async` / `await` Syntax**: Cleaner, readable syntax for consuming Promises without chaining `.then()` callbacks.
- **Error Boundaries with `try` / `catch` / `finally`**: Safely handling network failures and guaranteeing loading state resets.

### New Node.js/Express Concepts Learned
- Verified Cross-Origin Resource Sharing (CORS) in live action between frontend (`port 5173`) and backend (`port 5000`).

### New MySQL Concepts Learned
- *None in this phase (Database is introduced in Phase 5)*.

### Commands Used
- `npm run build`: To verify frontend JSX compiling and service imports.

### Common Mistakes to Avoid
- **Hardcoding API Base URLs Across Multiple Components**: Spreading `http://localhost:5000` across individual JSX files makes deployment difficult. Centralize base URLs inside `services/api.js`.
- **Forgetting Dependency Array in `useEffect`**: Omitting `[]` causes `useEffect` to fire on every single component render, causing infinite network loops.
- **Not Resetting Loading States in `finally`**: If an API call fails and `setLoading(false)` is only inside `try`, the UI spinner locks forever. Always put state cleanups inside a `finally` block.

### Key Interview Points
- **What is the purpose of `useEffect`'s dependency array?**: The dependency array controls when the effect runs. An empty array `[]` means it runs once on mount. Including variables `[source, destination]` causes the effect to re-run whenever those specific variables change.
- **Why use a Service Layer in React?**: A service layer separates business logic and API configurations from UI presentation. It makes components clean, reusable, easy to test, and simplifies changing API base endpoints.
- **How does `async/await` work under the hood?**: `async/await` is syntactic sugar built on top of JavaScript Promises. An `async` function always returns a Promise, and `await` pauses execution until the Promise settles.

---

## Phase 5: MySQL Fundamentals and Database Setup

### What was built
- Designed relational database tables in 3NF: `stations`, `trains`, and `train_stops`.
- Created SQL initialization script (`server/database/schema.sql`) declaring Primary Keys, Foreign Keys, `ON DELETE CASCADE` rules, and performance indexes.
- Created SQL seed script (`server/database/seed.sql`) inserting station master records, train names, and timetable schedules.
- Installed `mysql2` driver package and built a promise-based connection pool module (`server/config/db.js`).

### Folder Structure
```text
trains/
├── PROJECT_PROGRESS.md
├── PROJECT_LEARNING_LOG.md
├── client/
└── server/
    ├── package.json
    ├── server.js
    ├── .env.example
    ├── config/
    │   └── db.js
    ├── database/
    │   ├── schema.sql
    │   └── seed.sql
    ├── models/
    ├── controllers/
    └── routes/
```

### Files Created & Purpose
1. `server/database/schema.sql`: DDL script defining database creation, tables, column data types, constraints, and index optimizations.
2. `server/database/seed.sql`: DML script populating initial stations (`CLT`, `CLX`, `MAS`, `SBC`, `BZA`), trains, and scheduled stops.
3. `server/config/db.js`: Connection pool initialization script using `mysql2/promise` with automatic fallback handling.
4. `server/.env.example`: Environment variables template documenting database connection parameters.

### New React Concepts Learned
- *None in this phase (Focus was on Database Architecture)*.

### New Node.js/Express Concepts Learned
- Integrating database connection pooling into Express server startup lifecycle.

### New MySQL Concepts Learned
- **Primary Key (PK)**: Unique column constraint ensuring row identity (e.g. `station_code`, `train_no`).
- **Foreign Key (FK)**: Referencing constraint linking child records (`train_stops.station_code`) to parent master tables (`stations.station_code`).
- **Database Normalization (3NF)**: Eliminating data redundancy by isolating station details and train metadata into separate entities linked via junction tables.
- **Connection Pooling**: Managing reusable database connection sockets (`mysql.createPool`) to handle concurrent web traffic efficiently.
- **Indexes**: Composite column indexes (`idx_station_train`) to optimize SQL search lookup times.

### Commands Used
- `npm install mysql2`: Installs Promise-compatible MySQL database driver.

### Common Mistakes to Avoid
- **Violating 3NF**: Duplicating `station_name` inside `train_stops`. If a station name changes, updating it in multiple places leads to data inconsistency.
- **Missing Foreign Key Indexes**: Forgetting to index columns used in `JOIN` conditions causes MySQL to perform full table scans on large datasets.
- **Single Un-pooled Connections**: Opening and closing individual database connections on every API request causes connection bottlenecks under heavy load.

### Key Interview Points
- **What is 3NF (Third Normal Form)?**: A database table is in 3NF if it is in 2NF and all non-key attributes are dependent only on the Primary Key, not on other non-key attributes. This removes transitive dependencies and data duplication.
- **What is a Foreign Key and why use `ON DELETE CASCADE`?**: A Foreign Key maintains referential integrity between linked tables. `ON DELETE CASCADE` ensures that if a parent record (e.g., a train) is deleted, all related child records (e.g., its schedule stops) are automatically deleted.
- **Why is Connection Pooling essential in Express?**: A connection pool maintains a cache of open database connections that can be reused for future requests, avoiding the overhead of establishing a new TCP connection every time an API endpoint is hit.

---

## Phase 6: Direct Train Search SQL Queries

### What was built
- Designed and implemented a high-performance **SQL Self-JOIN** query on the `train_stops` table to search for Direct Trains between Source and Destination.
- Implemented sequence order verification (`s1.stop_order < s2.stop_order`) to ensure correct directional travel.
- Secured query execution using Parameterized Placeholders (`?`) against SQL Injection attacks.
- Integrated `getDirectTrainsFromDB()` helper function into `trainController.js`.

### Folder Structure
```text
trains/
├── PROJECT_PROGRESS.md
├── PROJECT_LEARNING_LOG.md
├── client/
└── server/
    ├── controllers/
    │   └── trainController.js
    └── database/
        ├── schema.sql
        └── seed.sql
```

### Files Created & Purpose
- `server/controllers/trainController.js`: Updated to incorporate parameterized SQL self-JOIN logic for direct train searches.

### New React Concepts Learned
- *None in this phase (Focus was on SQL Query Architecture)*.

### New Node.js/Express Concepts Learned
- Handling database query Promises and formatting MySQL `TIME` column strings for JSON responses.

### New MySQL & SQL Concepts Learned
- **SQL Self-JOIN**: Joining `train_stops` table with itself (`train_stops s1 JOIN train_stops s2 ON s1.train_no = s2.train_no`) to evaluate two distinct stop events for the same train.
- **Sequence Constraints**: Filtering rows where `s1.stop_order < s2.stop_order` so departure station always precedes arrival station.
- **SQL Injection Prevention**: Binding query parameters `dbPool.query(sql, [source, destination])` so user input strings are automatically sanitized by the MySQL driver.

### Commands Used
- `Invoke-RestMethod`: Tested direct train API search responses.

### Common Mistakes to Avoid
- **Concatenating SQL Input Strings**: Writing `WHERE station_code = '` + source + `'` leaves your database exposed to SQL Injection. Always use `?` placeholders.
- **Omitting `stop_order` Verification**: Forgetting `s1.stop_order < s2.stop_order` causes the query to match trains moving in the reverse direction.

### Key Interview Points
- **How does a SQL Self-JOIN work?**: A self-JOIN joins a table to itself as if it were two separate tables. In our case, `s1` represents the source stop row and `s2` represents the destination stop row for the same `train_no`.
- **How do Parameterized Queries prevent SQL Injection?**: Parameterized queries send the SQL statement template and the user data parameters separately to the database engine. The database treats user data strictly as literal values rather than executable SQL code, making payload injection impossible.

---

## Phase 7: Connecting Train Search SQL Queries

### What was built
- Designed and implemented a multi-table SQL query joining 4 instances of `train_stops` and 2 instances of `trains` to match 2-leg connecting journeys.
- Validated sequence order constraints for both leg 1 (`startA.stop_order < midA.stop_order`) and leg 2 (`midB.stop_order < endB.stop_order`).
- Implemented `getConnectingTrainsFromDB(source, destination, interchangeCode, buffer)` helper function in `trainController.js`.
- Mapped SQL row outputs into structured JSON route pairs containing Train A data, Train B data, and waiting times.

### Folder Structure
```text
trains/
├── PROJECT_PROGRESS.md
├── PROJECT_LEARNING_LOG.md
├── client/
└── server/
    ├── controllers/
    │   └── trainController.js
    └── database/
        ├── schema.sql
        └── seed.sql
```

### Files Created & Purpose
- `server/controllers/trainController.js`: Updated to execute multi-table relational join queries for connecting trains.

### New React Concepts Learned
- *None in this phase (Focus was on SQL Relational Joins)*.

### New Node.js/Express Concepts Learned
- Processing complex multi-table SQL query arrays and mapping flat database fields into nested object representations.

### New MySQL & SQL Concepts Learned
- **Multi-Table Relational JOINs**: Joining multiple table aliases in a single query statement to query multi-step transit routes.
- **Junction Condition Matching**: Linking Leg 1's destination stop (`midA.station_code`) to Leg 2's departure stop (`midB.station_code`).
- **Data Mapping**: Transforming relational flat rows (`trainA_no`, `trainB_no`) into nested domain objects (`{ trainA: {...}, trainB: {...} }`).

### Commands Used
- `Invoke-RestMethod`: Tested connecting train API search responses.

### Common Mistakes to Avoid
- **Omitting Stop Order Check on Leg 2**: Verifying `stop_order` on Train A but forgetting it on Train B, causing Train B to match stations in reverse order.
- **Un-indexed Junction Queries**: Executing multi-table joins without indexes on `station_code` and `train_no`, leading to high CPU usage and slow queries.

### Key Interview Points
- **How do you query multi-leg transit routes in SQL?**: Multi-leg transit routes are queried by joining table aliases representing each leg of the trip. In a 2-leg search, Leg 1 joins the source stop to the interchange stop for Train A, and Leg 2 joins the interchange stop to the destination stop for Train B, linked where `midA.station_code = midB.station_code`.
- **Why convert flat SQL rows to nested JSON objects?**: Relational SQL databases return flat 2D table structures (rows and columns). Node.js APIs map these flat fields into structured nested objects (`{ trainA: {...}, trainB: {...} }`) so frontend clients can render clean component trees easily.

---

## Phase 8: Buffer Time Validation

### What was built
- Implemented SQL time arithmetic using `TIME_TO_SEC()` to compute layover waiting times inside MySQL.
- Handled overnight layovers spanning midnight using SQL `CASE` expressions adding `86400` seconds when Departure B < Arrival A.
- Enforced minimum layover buffer constraints using `HAVING waiting_time_mins >= (? * 60)`.
- Verified edge cases via REST API testing (`buffer: 2` vs `buffer: 3` hours).

### Folder Structure
```text
trains/
├── PROJECT_PROGRESS.md
├── PROJECT_LEARNING_LOG.md
├── client/
└── server/
    ├── controllers/
    │   └── trainController.js
    └── database/
        ├── schema.sql
        └── seed.sql
```

### Files Created & Purpose
- `server/controllers/trainController.js`: Updated to incorporate SQL `TIME_TO_SEC`, `CASE` wrap-around calculations, and `HAVING` clause buffer filters.

### New React Concepts Learned
- *None in this phase (Focus was on SQL Time Logic & Buffer Validation)*.

### New Node.js/Express Concepts Learned
- Binding numeric parameters (`bufferHours`) into SQL `HAVING` clause templates.

### New MySQL & SQL Concepts Learned
- **`TIME_TO_SEC()`**: SQL function converting `TIME` datatypes into total seconds from midnight.
- **Conditional `CASE` Expressions**: Writing inline logic (`CASE WHEN ... THEN ... ELSE ... END`) inside SELECT projections to handle midnight wrap-around arithmetic.
- **SQL `HAVING` Clause**: Filtering calculated alias expressions (`waiting_time_mins`) after SQL projections are computed.

### Commands Used
- `Invoke-RestMethod`: Tested edge case buffer parameters on the search REST endpoint.

### Common Mistakes to Avoid
- **Attempting `WHERE` on Calculated Aliases**: Writing `WHERE waiting_time_mins >= 120` causes SQL syntax errors because `WHERE` executes before projection aliases exist. Use `HAVING`.
- **Negative Time Anomalies**: Subtracting `02:15` departure from `23:30` arrival without adding `86,400` seconds results in negative layover times.

### Key Interview Points
- **Difference between `WHERE` and `HAVING` in SQL**: The `WHERE` clause filters individual rows before grouping or column alias projections are calculated. The `HAVING` clause filters calculated column aliases or aggregated expressions after projection evaluation.
- **How to handle overnight time calculations in SQL**: When calculating layover time across midnight (where Departure Time < Arrival Time), we use a `CASE` expression to add `86,400` seconds (24 hours) to Departure Time before subtracting Arrival Time.

---

## Phase 9: Route Sorting Logic

### What was built
- Instructed MySQL to sort connecting route queries directly by waiting time ascending using `ORDER BY waiting_time_mins ASC`.
- Instructed MySQL to sort direct train queries chronologically using `ORDER BY s1.departure_time ASC`.
- Analyzed sorting algorithm time complexity $O(N \log N)$ and index optimizations.
- Verified display order guarantees (the route with the least waiting time appears first).

### Folder Structure
```text
trains/
├── PROJECT_PROGRESS.md
├── PROJECT_LEARNING_LOG.md
├── client/
└── server/
    ├── controllers/
    │   └── trainController.js
    └── database/
        ├── schema.sql
        └── seed.sql
```

### Files Created & Purpose
- `server/controllers/trainController.js`: Updated SQL query helpers to incorporate `ORDER BY` sorting clauses.

### New React Concepts Learned
- *None in this phase (Focus was on SQL Sorting & Algorithm Complexity)*.

### New Node.js/Express Concepts Learned
- Offloading sorting logic to the database layer to reduce Application Tier memory usage.

### New MySQL & SQL Concepts Learned
- **SQL `ORDER BY ... ASC / DESC`**: Sorting database query result sets.
- **Sorting on Calculated Column Aliases**: Ordering by computed expressions (`ORDER BY waiting_time_mins ASC`).
- **Algorithmic Time Complexity $O(N \log N)$**: Understanding how databases sort records efficiently using Merge Sort / Quicksort variants and B-Tree indexes.

### Commands Used
- `Invoke-RestMethod`: Verified JSON payload response ordering.

### Common Mistakes to Avoid
- **In-Memory App Sorting vs Database Sorting**: Fetching thousands of unsorted rows from MySQL and sorting them manually in JavaScript arrays wastes Node.js RAM and CPU cycles. Use `ORDER BY` in SQL.

### Key Interview Points
- **Why perform sorting in SQL rather than JavaScript?**: Databases are optimized for sorting operations using C++ compiled code, memory buffers (`sort_buffer_size`), and indexes. Offloading sorting to MySQL reduces Node.js memory overhead, minimizes network payload sizes when using `LIMIT`, and executes significantly faster.
- **What is the Time Complexity of SQL sorting?**: General database sorting operates in $O(N \log N)$ time complexity. If a database index exists on the sorting column, MySQL can retrieve rows pre-sorted in $O(N)$ or $O(1)$ time.

---

## Phase 10: UI Improvements and Polish

### What was built
- Added skeleton shimmer loader animations for initial station fetching and route searches.
- Designed visual highlighting badges (`"✨ Fastest Option"`) on top-ranked connecting train routes.
- Enhanced form icon positioning in CSS to prevent overlap with station text in `<select>` elements.
- Implemented mobile responsive media query breakpoints for smooth multi-column to single-column stacking on mobile devices.
- Refined dark theme styling, glassmorphic container cards, gradients, and micro-interactions.

### Folder Structure
```text
trains/
├── PROJECT_PROGRESS.md
├── PROJECT_LEARNING_LOG.md
├── client/
│   └── src/
│       ├── App.jsx
│       └── pages/
│           ├── SearchPage.jsx
│           └── SearchPage.css
└── server/
```

### Files Created & Purpose
- `client/src/pages/SearchPage.css`: Updated with skeleton keyframe animations (`@keyframes shimmer`), responsive media queries (`@media (max-width: 900px)`), badge styles, and adjusted icon paddings (`.input-container select { padding-left: 42px; }`).
- `client/src/pages/SearchPage.jsx`: Added index-based badge rendering (`index === 0 && <span className="badge-fastest">✨ Fastest Option</span>`) and conditional skeleton render blocks.

### New React Concepts Learned
- **Perceived Performance & UX**: Improving perceived loading speed using skeleton components instead of raw text placeholders.
- **Conditional Class Names & Badges**: Dynamically injecting CSS classes or elements based on array iteration indexes (`index === 0`).

### New CSS Concepts Learned
- **CSS Animations & Keyframes (`@keyframes shimmer`)**: Creating smooth background position shifts to simulate loading shimmers without external libraries.
- **Form Select Alignment & Box Model**: Using absolute positioning for icons inside `.input-container` combined with `padding-left` on `<select>` elements to keep text aligned cleanly.
- **Mobile Responsive Breakpoints (`@media`)**: Reflowing multi-column grid layouts into fluid single-column stacks when viewport width shrinks below `900px`.

### New Node.js/Express Concepts Learned
- *None in this phase (Focus was on UX & Frontend Styling)*.

### New MySQL Concepts Learned
- *None in this phase (Focus was on UX & Frontend Styling)*.

### Commands Used
- `npm run build`: Verified zero warnings/errors during production bundle generation.

### Common Mistakes to Avoid
- **Overlapping Absolute Icons**: Placing an icon inside an input container using `position: absolute` without adding `padding-left` to the `<select>` or `<input>` element causes text to overlap the icon.
- **Relying Solely on Text Spinners**: Plain "Loading..." text feels sluggish to users. Skeleton loaders give immediate spatial feedback of the layout being loaded.

### Key Interview Points
- **What is Perceived Performance and why use Skeleton Loaders?**: Perceived performance is how fast an application feels to the user. Skeleton loaders reduce user anxiety and cognitive load by displaying structural placeholders that mimic the content layout while asynchronous requests complete.
- **How do CSS `@keyframes` animations work without JavaScript?**: CSS keyframes define visual property states (e.g., `background-position`) at intermediate steps of an animation cycle. The browser's GPU renders these animations smoothly on the compositor thread without blocking JavaScript execution.

---

## Phase 11: Deployment & Resume Preparation

### What was built
- Created root `.gitignore` to prevent tracking of `node_modules`, production build artifacts (`dist`), system logs, and environment secrets (`.env`).
- Authored comprehensive root `README.md` containing dynamic badges, system architecture diagrams, database 3NF schema tables, REST API contracts, setup steps, and resume points.
- Prepared production deployment guidelines for Vercel/Netlify (Frontend), Render/Railway (Backend API), and PlanetScale/Aiven/Railway (MySQL Database).
- Drafted resume bullet points and technical interview Q&A for SWE internship applications.

### Folder Structure
```text
trains/
├── README.md
├── PROJECT_PROGRESS.md
├── PROJECT_LEARNING_LOG.md
├── .gitignore
├── client/
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── services/
│       │   └── api.js
│       └── pages/
│           ├── SearchPage.jsx
│           └── SearchPage.css
└── server/
    ├── .env.example
    ├── package.json
    ├── server.js
    ├── config/
    │   └── db.js
    ├── controllers/
    │   └── trainController.js
    ├── database/
    │   ├── schema.sql
    │   └── seed.sql
    ├── models/
    │   └── mockData.js
    └── routes/
        └── trainRoutes.js
```

### Files Created & Purpose
- `README.md`: Master project documentation and setup manual.
- `.gitignore`: Workspace file exclusion tracking rules.

### New Git & DevOps Concepts Learned
- **Git Ignoring Patterns**: Ignoring build artifacts (`dist/`), dependencies (`node_modules/`), and sensitive keys (`.env`).
- **Production Deployment Separation**: Hosting static frontend assets (Vercel/Netlify) separately from server runtimes (Render) and managed relational databases (Aiven/PlanetScale).
- **Monorepo Management**: Managing `client/` and `server/` subdirectories with independent `package.json` manifests.

### Resume Highlights (For Internships)
- **Full-Stack Architecture**: Built monorepo React + Express + MySQL web app querying complex 2-leg transit schedules.
- **Advanced SQL Query Engineering**: Written 4-way relational JOIN queries, self-JOINs, composite indexes, and `TIME_TO_SEC` overnight layover wrap-around arithmetic.
- **Performance & Security**: Implemented parameterized query protection (`?`), database connection pooling (`mysql2`), and $O(N \log N)$ sorting directly inside MySQL (`ORDER BY`).
- **User Interface & UX**: Implemented skeleton shimmer loaders, glassmorphism design tokens, badges, and responsive media queries.

### Key Interview Questions & Answers
- **Q1: How does your connecting train algorithm work in SQL?**
  - *Answer*: It performs a multi-table relational join between 4 instances of the `train_stops` table (`startA`, `midA`, `midB`, `endB`) and 2 instances of `trains`. It connects Train A from source to interchange station, and Train B from interchange station to destination.
- **Q2: How do you handle overnight layovers across midnight?**
  - *Answer*: Standard time subtraction yields negative minutes when Departure B is after midnight (e.g., 01:30) and Arrival A is before midnight (e.g., 23:00). We use SQL `TIME_TO_SEC()` with a conditional `CASE` expression: `WHEN dep < arr THEN ((dep + 86400) - arr) / 60`, adding 24 hours (86,400 seconds) to Departure B before subtracting.
- **Q3: Why filter layover buffer time in `HAVING` instead of `WHERE`?**
  - *Answer*: `WHERE` filters raw table rows *before* column projections and calculations happen. `HAVING` filters calculated column aliases (`waiting_time_mins`) *after* the SQL projection calculations evaluate.
- **Q4: How does connection pooling improve Express performance?**
  - *Answer*: Creating a new MySQL connection socket for every HTTP request incurs heavy TCP handshake and authentication overhead. A connection pool pre-allocates reusable database connections, increasing throughput and lowering latency under high concurrency.

---


