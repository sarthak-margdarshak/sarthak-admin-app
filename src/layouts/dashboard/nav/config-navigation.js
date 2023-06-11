// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

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
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'profile', path: PATH_DASHBOARD.user.profile },
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

      // TASK
      {
        title: 'task',
        path: PATH_DASHBOARD.task.root,
        icon: ICONS.task,
        children: [
          { title: 'list', path: PATH_DASHBOARD.task.list },
          { title: 'create', path: PATH_DASHBOARD.task.new },
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

      // INVOICE
      {
        title: 'invoice',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'list', path: PATH_DASHBOARD.invoice.list },
          { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
          { title: 'create', path: PATH_DASHBOARD.invoice.new },
          { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
        ],
      },
    ],
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'app',
    items: [
      {
        title: 'chat',
        path: PATH_DASHBOARD.chat.root,
        icon: ICONS.chat,
        info: <Label color="info">+15</Label>,
      },
      {
        title: 'calendar',
        path: PATH_DASHBOARD.calendar,
        icon: ICONS.calendar,
      },
      {
        title: 'kanban',
        path: PATH_DASHBOARD.kanban,
        icon: ICONS.kanban,
      },
      {
        title: 'Oranisation Chart',
        path: PATH_DASHBOARD.organizationChart,
        icon: ICONS.organisation_chart,
      },
    ],
  },
];

export default navConfig;
