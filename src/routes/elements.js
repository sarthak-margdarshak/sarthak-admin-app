import { Suspense, lazy } from "react";
import LoadingScreen from "components/loading-screen";

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// -----------------< AUTH >-----------------
export const LoginPage = Loadable(lazy(() => import("pages/auth/LoginPage")));
export const NewPasswordPage = Loadable(
  lazy(() => import("pages/auth/NewPasswordPage"))
);
export const ResetPasswordPage = Loadable(
  lazy(() => import("pages/auth/ResetPasswordPage"))
);
export const SignupPage = Loadable(lazy(() => import("pages/auth/SignupPage")));

// -----------------< DASHBOARD: GENERAL: APP >-----------------
export const GeneralAppPage = Loadable(
  lazy(() => import("pages/dashboard/general/app/GeneralAppPage"))
);

// -----------------< DASHBOARD: MANAGEMENT: ADMIN: USER >-----------------
export const UserProfilePage = Loadable(
  lazy(() => import("pages/dashboard/management/admin/user/UserProfilePage"))
);

// -----------------< DASHBOARD: MANAGEMENT: ADMIN: TEAM >-----------------
export const TeamListPage = Loadable(
  lazy(() => import("pages/dashboard/management/admin/team/TeamListPage"))
);

// -----------------< DASHBOARD: MANAGEMENT: CONTENT: QUESTION >-----------------
export const QuestionListPage = Loadable(
  lazy(() =>
    import("pages/dashboard/management/content/question/QuestionListPage")
  )
);
export const QuestionDetailsPage = Loadable(
  lazy(() =>
    import("pages/dashboard/management/content/question/QuestionDetailsPage")
  )
);
export const QuestionEditPage = Loadable(
  lazy(() =>
    import("pages/dashboard/management/content/question/QuestionEditPage")
  )
);
export const QuestionBulkImportPage = Loadable(
  lazy(() =>
    import("pages/dashboard/management/content/question/QuestionBulkImportPage")
  )
);
export const QuestionTranslatePage = Loadable(
  lazy(() =>
    import("pages/dashboard/management/content/question/QuestionTranslatePage")
  )
);

// -----------------< DASHBOARD: MANAGEMENT: CONTENT: MOCK-TEST >-----------------
export const MockTestListPage = Loadable(
  lazy(() =>
    import("pages/dashboard/management/content/mock-test/MockTestListPage")
  )
);
export const MockTestViewPage = Loadable(
  lazy(() =>
    import("pages/dashboard/management/content/mock-test/MockTestViewPage")
  )
);
export const MockTestEditPage = Loadable(
  lazy(() =>
    import("pages/dashboard/management/content/mock-test/MockTestEditPage")
  )
);
export const MockTestTranslatePage = Loadable(
  lazy(() =>
    import("pages/dashboard/management/content/mock-test/MockTestTranslatePage")
  )
);

// -----------------< DASHBOARD: MANAGEMENT: CONTENT: PRODUCT >-----------------
export const ProductListPage = Loadable(
  lazy(() =>
    import("pages/dashboard/management/content/product/ProductListPage")
  )
);
export const ProductViewPage = Loadable(
  lazy(() =>
    import("pages/dashboard/management/content/product/ProductViewPage")
  )
);
export const ProductEditPage = Loadable(
  lazy(() =>
    import("pages/dashboard/management/content/product/ProductEditPage")
  )
);
export const ProductTranslatePage = Loadable(
  lazy(() =>
    import("pages/dashboard/management/content/product/ProductTranslatePage")
  )
);

// -----------------< MAIN >-----------------
export const Page500 = Loadable(lazy(() => import("pages/Page500")));
export const Page403 = Loadable(lazy(() => import("pages/Page403")));
export const Page404 = Loadable(lazy(() => import("pages/Page404")));
export const Page410 = Loadable(lazy(() => import("pages/Page410")));
export const PageMotivation = Loadable(
  lazy(() => import("pages/PageMotivation"))
);
export const ComingSoonPage = Loadable(
  lazy(() => import("pages/ComingSoonPage"))
);
export const MaintenancePage = Loadable(
  lazy(() => import("pages/MaintenancePage"))
);
