-- ============================================================================
-- Database Schema: Railway Route Planner
-- Phase 5: MySQL Database Setup
-- Description: Creates Database, Tables, Primary Keys, Foreign Keys, & Indexes
-- ============================================================================

CREATE DATABASE IF NOT EXISTS railway_planner;
USE railway_planner;

-- ----------------------------------------------------------------------------
-- 1. STATIONS TABLE
-- Stores unique railway stations with station code (e.g. CLT, MAS, CLX)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stations (
  station_code VARCHAR(10) NOT NULL,
  station_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (station_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 2. TRAINS TABLE
-- Stores train numbers and official designations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trains (
  train_no VARCHAR(10) NOT NULL,
  train_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (train_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 3. TRAIN_STOPS TABLE
-- Schedules stops for trains at stations with order, arrival & departure times.
-- Links trains and stations together via Foreign Keys (3NF Relational Junction).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS train_stops (
  id INT AUTO_INCREMENT NOT NULL,
  train_no VARCHAR(10) NOT NULL,
  station_code VARCHAR(10) NOT NULL,
  stop_order INT NOT NULL,
  arrival_time TIME NULL,
  departure_time TIME NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_train_stops_train 
    FOREIGN KEY (train_no) 
    REFERENCES trains (train_no) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT fk_train_stops_station 
    FOREIGN KEY (station_code) 
    REFERENCES stations (station_code) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  INDEX idx_station_code (station_code),
  INDEX idx_train_no (train_no),
  INDEX idx_station_train (station_code, train_no),
  INDEX idx_train_stop_order (train_no, stop_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
