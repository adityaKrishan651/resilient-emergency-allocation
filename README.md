# Resilient Emergency Resource Allocation System

A decentralized system for emergency resource management with blockchain-based immutable logging and fallback mechanisms.

## Architecture

- **Frontend**: React dashboard for real-time monitoring
- **Backend**: Node.js/Express API with intelligent allocation algorithms
- **Blockchain**: Ethereum/Hardhat smart contracts for immutable logging
- **Database**: PostgreSQL with PostGIS for geospatial queries

## Prerequisites

- Node.js (v18+)
- PostgreSQL (with PostGIS extension)
- npm or yarn

## Setup Instructions

### 1. Database Setup
```bash
# Create a PostgreSQL database
createdb emergency_db

# Enable PostGIS extension
psql -d emergency_db -c "CREATE EXTENSION postgis;"

### 2. Backend Setup


