# Project Progress - Railway Route Planner

This document tracks features, phase progression, and architecture decisions.

## Current Phase
- **Phase 11: Deployment & Resume Preparation** (Completed - Project Complete! 🎉)

## Completed Features
- [x] Dynamic Search Form (Inputs for Source, Destination, Interchanges, and Buffer Time)
- [x] Form Validation (Ensure source and destination are different, check buffer hours)
- [x] Mock Data Integration (Test UI search behavior before backend is ready)
- [x] Route Waiting Time Calculation and Sorting Logic (SQL `ORDER BY waiting_time_mins ASC` $O(N \log N)$)
- [x] Express API Server setup with Search API endpoint (`GET /api/stations` & `POST /api/search`)
- [x] Frontend to Backend Integration using Fetch API (`services/api.js` & `useEffect`)
- [x] MySQL Database Schema Setup (`stations`, `trains`, `train_stops` in 3NF & `mysql2` pooling)
- [x] Direct Train Search DB Queries (SQL Self-JOIN & Parameterized Security)
- [x] Connecting Train Route Matching Algorithm (Multi-Table Relational JOINs)
- [x] Buffer Time Validation Algorithm (SQL `TIME_TO_SEC`, `CASE` wrap-arounds, & `HAVING` clause)
- [x] Loading, Skeleton Shimmer Loaders, Error, and Empty states on UI
- [x] Responsive Layout refinement & CSS badges using Vanilla CSS
- [x] Comprehensive Project README.md & Deployment setup guide
- [x] Resume Bullet Points and Technical Interview Q&A Preparation

## Pending Features
- *None! All 11 Phases have been successfully completed.*

## Technical Decisions
- **Monorepo Layout**: Separation of client and server code into `client/` and `server/` directories.
- **Frontend Stack**: React (Functional Components, Hooks) using Vite as build system, with Vanilla CSS.

## Known Issues
- None (Fresh setup)
