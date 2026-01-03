import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ReporterManagement from './pages/ReporterManagement';
import NewsManagement from './pages/NewsManagement';
import CommunityManagement from './pages/CommunityManagement';
import ReporterEvents from './pages/ReporterEvents';
import ActivityManagement from './pages/ActivityManagement';
import Reports from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="reporters" element={<ReporterManagement />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="communities" element={<CommunityManagement />} />
          <Route path="events" element={<ReporterEvents />} />
          <Route path="activity" element={<ActivityManagement />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
