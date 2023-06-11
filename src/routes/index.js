import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import MainLayout from '../layouts/main';
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  // Auth
  LoginPage,
  VerifyCodePage,
  NewPasswordPage,
  ResetPasswordPage,
  // Dashboard: General
  GeneralAppPage,
  // Dashboard: User
  UserProfilePage,
  UserAccountPage,
  // Dashboard: Team
  TeamListPage,
  TeamCreatePage,
  TeamDetailsPage,
  TeamAddUserPage,
  // Dashboard: Task
  TaskListPage,
  TaskCreatePage,
  TaskDetailsPage,
  // Dashboard: Question
  QuestionListPage,
  QuestionCreatePage,
  QuestionDetailsPage,
  QuestionEditPage,
  // Dashboard: Invoice
  InvoiceListPage,
  InvoiceDetailsPage,
  InvoiceCreatePage,
  InvoiceEditPage,
  // Dashboard: App
  ChatPage,
  CalendarPage,
  KanbanPage,
  //
  PermissionDeniedPage,
  //
  Page500,
  Page403,
  Page404,
  HomePage,
  FaqsPage,
  AboutPage,
  Contact,
  ComingSoonPage,
  MaintenancePage,
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'new-password', element: <NewPasswordPage /> },
            { path: 'verify', element: <VerifyCodePage /> },
          ],
        },
      ],
    },

    // Dashboard
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        // Dashboard: App
        { path: 'app', element: <GeneralAppPage /> },
        // Dashboard: User
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfilePage /> },
            { path: 'account', element: <UserAccountPage /> },
          ],
        },
        // Dashboard: Team
        {
          path: 'team',
          children: [
            { element: <Navigate to="/dashboard/team/list" replace />, index: true },
            { path: 'list', element: <TeamListPage /> },
            { path: 'new', element: <TeamCreatePage /> },
            { path: ':id', element: <TeamDetailsPage /> },
            { path: ':id/addUser', element: <TeamAddUserPage /> },
          ],
        },
        // Dashboard: Task
        {
          path: 'task',
          children: [
            { element: <Navigate to="/dashboard/task/list" replace />, index: true },
            { path: 'list', element: <TaskListPage /> },
            { path: 'new', element: <TaskCreatePage /> },
            { path: ':id', element: <TaskDetailsPage /> },
          ],
        },
        // Dashboard: Question
        {
          path: 'question',
          children: [
            { element: <Navigate to="/dashboard/question/list" replace />, index: true },
            { path: 'list', element: <QuestionListPage /> },
            { path: 'new', element: <QuestionCreatePage /> },
            { path: ':id', element: <QuestionDetailsPage /> },
            { path: ':id/edit', element: <QuestionEditPage /> },
          ],
        },
        // Dashboard: Invoice
        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
            { path: 'list', element: <InvoiceListPage /> },
            { path: ':id', element: <InvoiceDetailsPage /> },
            { path: ':id/edit', element: <InvoiceEditPage /> },
            { path: 'new', element: <InvoiceCreatePage /> },
          ],
        },
        // Dashboard: Chat
        {
          path: 'chat',
          children: [
            { element: <ChatPage />, index: true },
            { path: 'new', element: <ChatPage /> },
            { path: ':conversationKey', element: <ChatPage /> },
          ],
        },
        //
        { path: 'calendar', element: <CalendarPage /> },
        //
        { path: 'kanban', element: <KanbanPage /> },
        //
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
      ],
    },

    // Main Routes
    {
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'about-us', element: <AboutPage /> },
        { path: 'contact-us', element: <Contact /> },  // ERROR
        { path: 'faqs', element: <FaqsPage /> },
        // { path: 'changelog', element: },
        // { path: 'terms-and-conditions', element: },
        // { path: 'privacy-policy', element: },
      ],
    },

    // Compact Routes
    {
      element: <CompactLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoonPage /> },
        { path: 'maintenance', element: <MaintenancePage /> },     // Complete
        { path: '500', element: <Page500 /> },     // Complete
        { path: '404', element: <Page404 /> },     // Complete
        { path: '403', element: <Page403 /> },     // Complete
      ],
    },

    // Other Routes
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
