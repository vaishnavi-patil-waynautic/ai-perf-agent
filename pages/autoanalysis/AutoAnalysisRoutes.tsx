import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { ConfigDetailsPage } from './pages/ConfigDetailsPage';
import { ResultPage } from './pages/ResultPage';

export const AutoAnalysisRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path=":id" element={<ConfigDetailsPage />} />
      <Route path=":id/result/:buildId" element={<ResultPage />} />
    </Routes>
  );
};