// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

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

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  organizationChart: path(ROOTS_DASHBOARD, '/organization-chart'),
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  team: {
    root: path(ROOTS_DASHBOARD, '/team'),
    list: path(ROOTS_DASHBOARD, '/team/list'),
    new: path(ROOTS_DASHBOARD, '/team/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/team/${id}`),
    addUser: (id) => path(ROOTS_DASHBOARD, `/team/${id}/addUser`),
  },
  task: {
    root: path(ROOTS_DASHBOARD, '/task'),
    list: path(ROOTS_DASHBOARD, '/task/list'),
    new: path(ROOTS_DASHBOARD, '/task/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/task/${id}`),
  },
  question: {
    root: path(ROOTS_DASHBOARD, '/question'),
    list: path(ROOTS_DASHBOARD, '/question/list'),
    new: path(ROOTS_DASHBOARD, '/question/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/question/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/question/${id}/edit`),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
};