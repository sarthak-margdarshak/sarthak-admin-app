import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import { QuestionNewCreateForm } from '../../../../sections/@dashboard/question/create';

// ----------------------------------------------------------------------

export default function QuestionCreatePage() {
  const { themeStretch } = useSettingsContext();

  // window.location.reload();

  return (
    <>
      <Helmet>
        <title> Question: Create | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new question"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Question',
              href: PATH_DASHBOARD.question.list,
            },
            {
              name: 'Create',
            },
          ]}
        />

        <QuestionNewCreateForm />
      </Container>
    </>
  );
}
