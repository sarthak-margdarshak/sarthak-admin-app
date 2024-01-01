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
    TeamUserPermissionPage,
    // Dashboard: Question
    QuestionListPage,
    QuestionCreatePage,
    QuestionDetailsPage,
    QuestionEditPage,
    // Dashboard: Notification
    NotificationListPage,
    // Coupon
    CouponsListPage,
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
    ChangeLogPage,
    PrivacyAndPolicyPage,
    TermsAndConditionsPage,
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
                        {
                            path: "reset-password",
                            element: <ResetPasswordPage />,
                        },
                        { path: "new-password", element: <NewPasswordPage /> },
                        { path: "verify", element: <VerifyCodePage /> },
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
                {
                    element: <Navigate to={PATH_AFTER_LOGIN} replace />,
                    index: true,
                },
                // Dashboard: App
                { path: "app", element: <GeneralAppPage /> },
                // Dashboard: User
                {
                    path: "user",
                    children: [
                        {
                            element: (
                                <Navigate
                                    to="/dashboard/user/account"
                                    replace
                                />
                            ),
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
                            element: (
                                <Navigate to="/dashboard/team/list" replace />
                            ),
                            index: true,
                        },
                        { path: "list", element: <TeamListPage /> },
                        { path: "new", element: <TeamCreatePage /> },
                        { path: ":id/edit", element: <TeamCreatePage /> },
                        { path: ":id/view", element: <TeamDetailsPage /> },
                        {
                            path: ":teamId/user/:userId/permissions",
                            element: <TeamUserPermissionPage />,
                        },
                    ],
                },
                // Dashboard: Question
                {
                    path: "question",
                    children: [
                        {
                            element: (
                                <Navigate
                                    to="/dashboard/question/list"
                                    replace
                                />
                            ),
                            index: true,
                        },
                        { path: "list", element: <QuestionListPage /> },
                        { path: "new", element: <QuestionCreatePage /> },
                        { path: ":id", element: <QuestionDetailsPage /> },
                        { path: ":id/edit", element: <QuestionEditPage /> },
                    ],
                },
                // Dashboard: Notification
                {
                    path: "notifications",
                    children: [
                        {
                            element: (
                                <Navigate
                                    to="/dashboard/notifications/list"
                                    replace
                                />
                            ),
                            index: true,
                        },
                        { path: "list", element: <NotificationListPage /> },
                    ],
                },
                // Dashboard: Coupons
                {
                    path: "coupons",
                    children: [
                        {
                            element: (
                                <Navigate
                                    to="/dashboard/coupons/list"
                                    replace
                                />
                            ),
                            index: true,
                        },
                        { path: "list", element: <CouponsListPage /> },
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
                {
                    path: "terms-and-conditions",
                    element: <TermsAndConditionsPage />,
                },
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
            ],
        },

        // Other Routes
        { path: "*", element: <Navigate to="/404" replace /> },
    ]);
}
