# RoboAdvisorApp
## 📂 Project Structure

This project is organized into two main parts:

### Backend (`backend/`)

- `gmpv.py`: Python scripts for financial data processing and portfolio optimization.
- `fund_info.csv`: Fund data description.

### Frontend (`frontend/`)

A Vite-powered frontend with modular React components:

- Components such as `EfficientFrontier.jsx`, `PortfolioPerformanceChart.jsx`, and `FundsTable.jsx` suggest financial portfolio analytics.
- `NavBar.jsx`, `heatmap.jsx`, and others handle UI and visualizations.

## 📦 Usage 
This project implements a basic robo-advisory platform, combining a Python backend for financial computation and a modern React frontend for user interaction and visualization.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/roboadvisor.git
cd roboadvisor
```

### 2. Backend Setup
```bash
cd backend
python gmpv.py
```

### 3. Frontend Setup
Install dependencies
```bash
cd ../frontend
npm install
```

Start the development server
```bash
npm run dev
```

This will start the app on http://localhost:5173 and it will proxy requests to the Flask backend.
