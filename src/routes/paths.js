function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = "/auth";
const ROOTS_DASHBOARD = "/dashboard";

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, "/login"),
  resetPassword: path(ROOTS_AUTH, "/reset-password"),
  newPassword: path(ROOTS_AUTH, "/new-password"),
  signup: path(ROOTS_AUTH, "/signup"),
};

export const PATH_PAGE = {
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  termsAndConditions: "/terms-and-conditions",
  page403: "/403",
  page404: "/404",
  page410: "/410",
  page500: "/500",
  success: "/success",
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, "/app"),
  },
  user: path(ROOTS_DASHBOARD, "/user"),
  team: path(ROOTS_DASHBOARD, "/team"),
  question: {
    root: path(ROOTS_DASHBOARD, "/question"),
    list: path(ROOTS_DASHBOARD, "/question/list"),
    view: (id) => path(ROOTS_DASHBOARD, `/question/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/question/${id}/edit`),
    bulkImport: (id) => path(ROOTS_DASHBOARD, `/question/${id}/bulk-import`),
  },
  mockTest: {
    root: path(ROOTS_DASHBOARD, "/mock-test"),
    list: path(ROOTS_DASHBOARD, "/mock-test/list"),
    view: (id) => path(ROOTS_DASHBOARD, `/mock-test/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/mock-test/${id}/edit`),
  },
  product: {
    root: path(ROOTS_DASHBOARD, "/product"),
    list: path(ROOTS_DASHBOARD, "/product/list"),
    view: (id) => path(ROOTS_DASHBOARD, `/product/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/product/${id}/edit`),
  },
};
