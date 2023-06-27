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

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

// ----------------------------------------------------------------------

const ICONS = {
  dashboard: icon('ic_dashboard'),
  user: icon('ic_user'),
  team: icon('ic_team'),
  task: icon('ic_task'),
  question: icon('ic_question'),
  invoice: icon('ic_invoice'),
  chat: icon('ic_chat'),
  calendar: icon('ic_calendar'),
  kanban: icon('ic_kanban'),
  organisation_chart: icon('ic_organisation_chart'),
};

const navConfig = [
  // GENERAL
  {
    subheader: 'general',
    items: [
      { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
    ],
  },

  // MANAGEMENT
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'profile', path: PATH_DASHBOARD.user.profile('') },
          { title: 'account', path: PATH_DASHBOARD.user.account },
        ],
      },

      // TEAM
      {
        title: 'team',
        path: PATH_DASHBOARD.team.root,
        icon: ICONS.team,
        children: [
          { title: 'list', path: PATH_DASHBOARD.team.list },
          { title: 'create', path: PATH_DASHBOARD.team.new },
        ],
      },

      // QUESTION
      {
        title: 'question',
        path: PATH_DASHBOARD.question.root,
        icon: ICONS.question,
        children: [
          { title: 'list', path: PATH_DASHBOARD.question.list },
          { title: 'create', path: PATH_DASHBOARD.question.new },
        ],
      },
    ],
  },

  // APP
  {
    subheader: 'app',
    items: [
      // {
      //   title: 'Oranisation Chart',
      //   path: PATH_DASHBOARD.organizationChart,
      //   icon: ICONS.organisation_chart,
      // },
    ],
  },
];

export default navConfig;
