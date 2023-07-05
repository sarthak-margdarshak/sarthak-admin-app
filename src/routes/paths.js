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

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

// ----------------------------------------------------------------------

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  changelog: '/changelog',
  termsAndConditions: '/terms-and-conditions',
  privacyPolicy: '/privacy-policy',
};

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    profile: (id) => path(ROOTS_DASHBOARD, `/user/profile/${id}`),
  },
  team: {
    root: path(ROOTS_DASHBOARD, '/team'),
    list: path(ROOTS_DASHBOARD, '/team/list'),
    new: path(ROOTS_DASHBOARD, '/team/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/team/${id}/view`),
    permissionEdit: (teamId, userId) => path(ROOTS_DASHBOARD, `/team/${teamId}/user/${userId}/permissions`),
  },
  question: {
    root: path(ROOTS_DASHBOARD, '/question'),
    list: path(ROOTS_DASHBOARD, '/question/list'),
    new: path(ROOTS_DASHBOARD, '/question/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/question/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/question/${id}/edit`),
  },
  notification: {
    root: path(ROOTS_DASHBOARD, '/notifications'),
    list: path(ROOTS_DASHBOARD, '/notifications/list'),
  }
};