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

// ----------------------------------------------------------------------
function path(root, sublink) {
  return `${root}${sublink}`;
}

// ----------------------------------------------------------------------

const ROOTS_AUTH = "/auth";
const ROOTS_DASHBOARD = "/dashboard";

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, "/login"),
  resetPassword: path(ROOTS_AUTH, "/reset-password"),
  newPassword: path(ROOTS_AUTH, "/new-password"),
  acceptInvite: path(ROOTS_AUTH, "/accept-invite"),
};

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, "/app"),
  },
  user: {
    root: path(ROOTS_DASHBOARD, "/user"),
    account: path(ROOTS_DASHBOARD, "/user/account"),
    profile: (id) => path(ROOTS_DASHBOARD, `/user/profile/${id}`),
  },
  team: {
    root: path(ROOTS_DASHBOARD, "/team"),
    list: path(ROOTS_DASHBOARD, "/team/list"),
    edit: (id) => path(ROOTS_DASHBOARD, `/team/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/team/${id}/view`),
  },
  question: {
    root: path(ROOTS_DASHBOARD, "/question"),
    list: path(ROOTS_DASHBOARD, "/question/list"),
    new: path(ROOTS_DASHBOARD, "/question/new"),
    view: (id) => path(ROOTS_DASHBOARD, `/question/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/question/${id}/edit`),
  },
  mockTest: {
    root: path(ROOTS_DASHBOARD, "/mock-test"),
    new: path(ROOTS_DASHBOARD, "/mock-test/new"),
    view: (id) => path(ROOTS_DASHBOARD, `/mock-test/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/mock-test/${id}/edit`),
    driver: path(ROOTS_DASHBOARD, "/mock-test/driver"),
    list: (id) => path(ROOTS_DASHBOARD, `/mock-test/driver/${id}`),
  },
  product: {
    root: path(ROOTS_DASHBOARD, "/product"),
    list: path(ROOTS_DASHBOARD, "/product/list"),
    new: path(ROOTS_DASHBOARD, "/product/new"),
    view: (id) => path(ROOTS_DASHBOARD, `/product/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/product/${id}/edit`),
  },
};
