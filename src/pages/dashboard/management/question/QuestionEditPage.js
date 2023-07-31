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

export default function QuestionEditPage() {
  const { themeStretch } = useSettingsContext();

  const questionId = window.location.pathname.split('/')[3];

  return (
    <>
      <Helmet>
        <title> Question: Edit | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Question"
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
              name: questionId,
              href: PATH_DASHBOARD.question.view(questionId),
            },
            {
              name: 'Edit',
            },
          ]}
        />

        <QuestionNewCreateForm inComingQuestionId={questionId} />
      </Container>
    </>
  );
}
