/**
 * Written By - Ritesh Ranjan
 * Website - https://sagittariusk2.github.io/
 *
 *  /|||||\    /|||||\   |||||||\   |||||||||  |||   |||   /|||||\   ||| ///
 * |||        |||   |||  |||   |||     |||     |||   |||  |||   |||  |||///
 *  \|||||\   |||||||||  |||||||/      |||     |||||||||  |||||||||  |||||
 *       |||  |||   |||  |||  \\\      |||     |||   |||  |||   |||  |||\\\
 *  \|||||/   |||   |||  |||   \\\     |||     |||   |||  |||   |||  ||| \\\
 *
 */

// IMPORT ---------------------------------------------------------------

import { Navigate, useRoutes } from "react-router-dom";
// auth
import AuthGuard from "../auth/AuthGuard";
import GuestGuard from "../auth/GuestGuard";
// layouts
import MainLayout from "../layouts/main";
import CompactLayout from "../layouts/compact";
import DashboardLayout from "../layouts/dashboard";
// config
import { PATH_AFTER_LOGIN } from "../config-global";
//
import {
  // Auth
  LoginPage,
  NewPasswordPage,
  ResetPasswordPage,
  // Dashboard: General
  GeneralAppPage,
  // Dashboard: User
  UserProfilePage,
  UserAccountPage,
  // Dashboard: Team
  TeamListPage,
  TeamDetailsPage,
  AcceptInvitePage,
  // Dashboard: Question
  QuestionListPage,
  QuestionCreatePage,
  QuestionDetailsPage,
  QuestionEditPage,
  //
  Page500,
  Page403,
  Page404,
  Page410,
  PageMotivation,
  HomePage,
  FaqsPage,
  AboutPage,
  Contact,
  ComingSoonPage,
  MaintenancePage,
  ChangeLogPage,
  PrivacyAndPolicyPage,
  TermsAndConditionsPage,
  MockTestDriverListPage,
} from "./elements";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth
    {
      path: "auth",
      children: [
        {
          path: "login",
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          element: <CompactLayout />,
          children: [
            { path: "reset-password", element: <ResetPasswordPage /> },
            { path: "new-password", element: <NewPasswordPage /> },
            { path: "accept-invite", element: <AcceptInvitePage /> },
          ],
        },
      ],
    },

    // Dashboard
    {
      path: "dashboard",
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        // Dashboard: App
        { path: "app", element: <GeneralAppPage /> },
        // Dashboard: User
        {
          path: "user",
          children: [
            {
              element: <Navigate to="/dashboard/user/account" replace />,
              index: true,
            },
            { path: "profile/", element: <UserProfilePage /> },
            { path: "profile/:id", element: <UserProfilePage /> },
            { path: "account", element: <UserAccountPage /> },
          ],
        },
        // Dashboard: Team
        {
          path: "team",
          children: [
            {
              element: <Navigate to="/dashboard/team/list" replace />,
              index: true,
            },
            { path: "list", element: <TeamListPage /> },
            { path: ":id/view", element: <TeamDetailsPage /> },
          ],
        },
        // Dashboard: Question
        {
          path: "question",
          children: [
            {
              element: <Navigate to="/dashboard/question/list" replace />,
              index: true,
            },
            { path: "list", element: <QuestionListPage /> },
            { path: "new", element: <QuestionCreatePage /> },
            { path: ":id", element: <QuestionDetailsPage /> },
            { path: ":id/edit", element: <QuestionEditPage /> },
          ],
        },
        // Dashboard: Mock Test
        {
          path: "mock-test",
          children: [
            {
              element: <Navigate to="/dashboard/mock-test/list" replace />,
              index: true,
            },
            // { path: "list", element: <MockTestNewPage /> },
            // { path: "new", element: <MockTestNewPage /> },
            // { path: ":id", element: <MockTestNewPage /> },
            // { path: ":id/edit", element: <MockTestNewPage /> },
            { path: "driver", element: <MockTestDriverListPage /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: "about-us", element: <AboutPage /> },
        { path: "contact-us", element: <Contact /> }, // ERROR
        { path: "faqs", element: <FaqsPage /> },
        { path: "changelog", element: <ChangeLogPage /> },
        { path: "terms-and-conditions", element: <TermsAndConditionsPage /> },
        { path: "privacy-policy", element: <PrivacyAndPolicyPage /> },
      ],
    },

    // Compact Routes
    {
      element: <CompactLayout />,
      children: [
        { path: "coming-soon", element: <ComingSoonPage /> },
        { path: "maintenance", element: <MaintenancePage /> }, // Complete
        { path: "500", element: <Page500 /> }, // Complete
        { path: "404", element: <Page404 /> }, // Complete
        { path: "403", element: <Page403 /> }, // Complete
        { path: "410", element: <Page410 /> }, // Complete
        { path: "success", element: <PageMotivation /> },
      ],
    },

    // Other Routes
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
