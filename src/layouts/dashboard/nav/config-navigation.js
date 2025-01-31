import { PATH_DASHBOARD } from "routes/paths";
import SvgColor from "components/svg-color";

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const ICONS = {
  dashboard: icon("ic_dashboard"),
  user: icon("ic_user"),
  team: icon("ic_team"),
  task: icon("ic_task"),
  question: icon("ic_question"),
  mockTest: icon("ic_mockTest"),
  invoice: icon("ic_invoice"),
  chat: icon("ic_chat"),
  calendar: icon("ic_calendar"),
  kanban: icon("ic_kanban"),
  organisation_chart: icon("ic_organisation_chart"),
};

const navConfig = [
  // GENERAL
  {
    subheader: "general",
    items: [
      { title: "app", path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
    ],
  },

  // ADMIN MANAGEMENT
  {
    subheader: "admin management",
    items: [
      // USER
      {
        title: "user",
        path: PATH_DASHBOARD.user,
        icon: ICONS.user,
      },

      // TEAM
      {
        title: "team",
        path: PATH_DASHBOARD.team,
        icon: ICONS.team,
      },
    ],
  },

  // CONTENT MANAGEMENT
  {
    subheader: "content management",
    items: [
      // QUESTION
      {
        title: "question",
        path: PATH_DASHBOARD.question.root,
        icon: ICONS.question,
      },

      // MOCK-TEST
      {
        title: "mock-test",
        path: PATH_DASHBOARD.mockTest.root,
        icon: ICONS.mockTest,
      },

      // PRODUCT
      {
        title: "Product",
        path: PATH_DASHBOARD.product.root,
        icon: ICONS.invoice,
      },
    ],
  },

  // STUDENTS MANAGEMENT
];

export default navConfig;
