import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import Layout from './components/Layout';

import DashboardOverview from './views/DashboardOverview';
import SymptomHistory from './views/SymptomHistory';
import TaskTracker from './views/TaskTracker';

function App() {
  const { user } = useAppContext();

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="history" element={<SymptomHistory />} />
        <Route path="tasks" element={<TaskTracker />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
