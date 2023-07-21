import { Helmet } from 'react-helmet-async';
// @mui
import { Button, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import Iconify from '../../../../components/iconify/Iconify';
// Sections
import QuestionListComponent from '../../../../sections/@dashboard/question/view/QuestionListComponent';
// Auth
import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function QuestionEditPage() {
  const { themeStretch } = useSettingsContext();

  const {
    notificationCount,
  } = useAuthContext();

  return (
    <>
      <Helmet>
        <title> {(notificationCount!==0?'('+notificationCount+')':'')+'Question: List | Sarthak Admin'}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Question"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Questions',
            },
          ]}
          action={
            <Button
              onClick={() => window.open(PATH_DASHBOARD.question.new,'_blank', 'rel=noopener noreferrer')}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Question
            </Button>
          }
        />

        <QuestionListComponent />

      </Container>
    </>
  );
}
