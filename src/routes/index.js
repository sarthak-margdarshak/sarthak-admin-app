import { Navigate, Outlet, useRoutes } from "react-router-dom";
import AuthGuard from "auth/AuthGuard";
import GuestGuard from "auth/GuestGuard";
import CompactLayout from "layouts/compact";
import DashboardLayout from "layouts/dashboard";
import { PATH_AFTER_LOGIN } from "config-global";
import {
  LoginPage,
  NewPasswordPage,
  ResetPasswordPage,
  GeneralAppPage,
  UserProfilePage,
  TeamListPage,
  SignupPage,
  QuestionListPage,
  QuestionDetailsPage,
  QuestionEditPage,
  Page500,
  Page403,
  Page404,
  Page410,
  PageMotivation,
  ComingSoonPage,
  MaintenancePage,
  MockTestListPage,
  MockTestViewPage,
  MockTestEditPage,
  ProductViewPage,
  ProductNewPage,
  ProductEditPage,
  ProductListPage,
} from "./elements";
import QuestionTreeView from "sections/@dashboard/management/content/layout/TreeView/QuestionTreeView";
import { ContentProvider } from "sections/@dashboard/management/content/hook/ContentProvider";
import React from "react";
import Content from "layouts/dashboard/Content";

export default function Router() {
  return useRoutes([
    { path: "/", element: <Navigate to="/dashboard/question/list" replace /> },

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
            { path: "signup", element: <SignupPage /> },
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
        // { path: "app", element: <GeneralAppPage /> },
        { path: "app", element: <Navigate to="/dashboard/question/list" replace /> },
        // Dashboard: User
        {
          path: "user",
          element: <UserProfilePage />,
        },
        // Dashboard: Team
        {
          path: "team",
          element: <TeamListPage />,
        },
        // Dashboard: Question
        {
          path: "question",
          element: (
            <ContentProvider>
              <QuestionTreeView />
              <Content>
                <Outlet />
              </Content>
            </ContentProvider>
          ),
          children: [
            {
              element: <Navigate to="/dashboard/question/list" replace />,
              index: true,
            },
            { path: "list", element: <QuestionListPage /> },
            { path: ":id", element: <QuestionDetailsPage /> },
            { path: ":id/edit", element: <QuestionEditPage /> },
          ],
        },
        // Dashboard: Mock Test
        {
          path: "mock-test",
          element: (
            <ContentProvider>
              <QuestionTreeView />
              <Content>
                <Outlet />
              </Content>
            </ContentProvider>
          ),
          children: [
            {
              element: <Navigate to="/dashboard/mock-test/list" replace />,
              index: true,
            },
            { path: "list", element: <MockTestListPage /> },
            { path: ":id", element: <MockTestViewPage /> },
            { path: ":id/edit", element: <MockTestEditPage /> },
          ],
        },
        // Dashboard: Product
        {
          path: "product",
          element: (
            <ContentProvider>
              <QuestionTreeView />
              <Content>
                <Outlet />
              </Content>
            </ContentProvider>
          ),
          children: [
            {
              element: <Navigate to="/dashboard/product/list" replace />,
              index: true,
            },
            { path: "new", element: <ProductNewPage /> },
            { path: ":id", element: <ProductViewPage /> },
            { path: ":id/edit", element: <ProductEditPage /> },
            { path: "list", element: <ProductListPage /> },
          ],
        },
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
