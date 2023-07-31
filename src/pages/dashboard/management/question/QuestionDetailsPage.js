import { Helmet } from 'react-helmet-async';
// @mui
import { Button, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import QuestionDetails from '../../../../sections/@dashboard/question/edit/QuestionDetails';
import { useAuthContext } from '../../../../auth/useAuthContext';
import Iconify from '../../../../components/iconify/Iconify';

// ----------------------------------------------------------------------

export default function QuestionDetailsPage() {
  const { themeStretch } = useSettingsContext();

  const questionId = window.location.pathname.split('/')[3];

  const {
    notificationCount,
  } = useAuthContext();

  return (
    <>
      <Helmet>
        <title> {(notificationCount!==0?'('+notificationCount+')':'')+'Question: View | Sarthak Admin'}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="View Question"
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
            },
          ]}
          action={
            <Button
              onClick={() => window.open(PATH_DASHBOARD.question.new,'_blank')}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Question
            </Button>
          }
        />

        <QuestionDetails inComingQuestionId={questionId} />

      </Container>
    </>
  );
}
