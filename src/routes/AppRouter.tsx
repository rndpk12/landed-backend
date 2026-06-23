import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { ApplicationDetailsPage } from '../pages/ApplicationDetailsPage';
import { ApplicationsPage } from '../pages/ApplicationsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { InterviewNotesPage } from '../pages/InterviewNotesPage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ResumeVaultPage } from '../pages/ResumeVaultPage';
import { SettingsPage } from '../pages/SettingsPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage />, handle: { title: 'Dashboard' } },
          { path: '/applications', element: <ApplicationsPage />, handle: { title: 'Applications' } },
          { path: '/applications/:id', element: <ApplicationDetailsPage />, handle: { title: 'Application Details' } },
          { path: '/resumes', element: <ResumeVaultPage />, handle: { title: 'Resume Vault' } },
          { path: '/interview-notes', element: <InterviewNotesPage />, handle: { title: 'Interview Notes' } },
          { path: '/analytics', element: <AnalyticsPage />, handle: { title: 'Analytics' } },
          { path: '/settings', element: <SettingsPage />, handle: { title: 'Settings' } }
        ]
      }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);

export const AppRouter = () => <RouterProvider router={router} />;
