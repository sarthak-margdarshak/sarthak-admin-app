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

import { Suspense, lazy } from "react";
// components
import LoadingScreen from "../components/loading-screen";

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// EXPORT ---------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(
  lazy(() => import("../pages/auth/LoginPage"))
);
export const NewPasswordPage = Loadable(
  lazy(() => import("../pages/auth/NewPasswordPage"))
);
export const ResetPasswordPage = Loadable(
  lazy(() => import("../pages/auth/ResetPasswordPage"))
);
export const AcceptInvitePage = Loadable(
  lazy(() => import("../pages/auth/AcceptInvite"))
);

// DASHBOARD: GENERAL
export const GeneralAppPage = Loadable(
  lazy(() => import("../pages/dashboard/general/app/GeneralAppPage"))
);

// DASHBOARD: USER
export const UserProfilePage = Loadable(
  lazy(() => import("../pages/dashboard/management/user/UserProfilePage"))
);
export const UserAccountPage = Loadable(
  lazy(() => import("../pages/dashboard/management/user/UserAccountPage"))
);

// DASHBOARD: TEAM
export const TeamListPage = Loadable(
  lazy(() => import("../pages/dashboard/management/team/TeamListPage"))
);
export const TeamDetailsPage = Loadable(
  lazy(() => import("../pages/dashboard/management/team/TeamDetailsPage"))
);

// DASHBOARD: QUESTION
export const QuestionListPage = Loadable(
  lazy(() => import("../pages/dashboard/management/question/QuestionListPage"))
);
export const QuestionCreatePage = Loadable(
  lazy(() =>
    import("../pages/dashboard/management/question/QuestionCreatePage")
  )
);
export const QuestionDetailsPage = Loadable(
  lazy(() =>
    import("../pages/dashboard/management/question/QuestionDetailsPage")
  )
);
export const QuestionEditPage = Loadable(
  lazy(() => import("../pages/dashboard/management/question/QuestionEditPage"))
);

// DASHBOARD: MOCK-TEST
export const MockTestDriverListPage = Loadable(
  lazy(() =>
    import(
      "../pages/dashboard/management/mock-test/driver/MockTestDriverListPage"
    )
  )
);
export const MockTestDriverViewPage = Loadable(
  lazy(() =>
    import(
      "../pages/dashboard/management/mock-test/driver/MockTestDriverViewPage"
    )
  )
);
export const MockTestNewPage = Loadable(
  lazy(() => import("../pages/dashboard/management/mock-test/MockTestNewPage"))
);
export const MockTestViewPage = Loadable(
  lazy(() => import("../pages/dashboard/management/mock-test/MockTestViewPage"))
);
export const MockTestEditPage = Loadable(
  lazy(() => import("../pages/dashboard/management/mock-test/MockTestEditPage"))
);

// DASHBOARD: PRODUCT
export const ProductNewPage = Loadable(
  lazy(() => import("../pages/dashboard/management/product/ProductNewPage"))
);
export const ProductListPage = Loadable(
  lazy(() => import("../pages/dashboard/management/product/ProductListPage"))
);
export const ProductViewPage = Loadable(
  lazy(() => import("../pages/dashboard/management/product/ProductViewPage"))
);
export const ProductEditPage = Loadable(
  lazy(() => import("../pages/dashboard/management/product/ProductEditPage"))
);

// MAIN
export const Page500 = Loadable(lazy(() => import("../pages/Page500")));
export const Page403 = Loadable(lazy(() => import("../pages/Page403")));
export const Page404 = Loadable(lazy(() => import("../pages/Page404")));
export const Page410 = Loadable(lazy(() => import("../pages/Page410")));
export const PageMotivation = Loadable(
  lazy(() => import("../pages/PageMotivation"))
);
export const ComingSoonPage = Loadable(
  lazy(() => import("../pages/ComingSoonPage"))
);
export const MaintenancePage = Loadable(
  lazy(() => import("../pages/MaintenancePage"))
);
