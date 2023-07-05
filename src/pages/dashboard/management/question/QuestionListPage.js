import { Helmet } from 'react-helmet-async';
// @mui
import { Button, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../../../components/iconify/Iconify';
import QuestionListComponent from '../../../../sections/@dashboard/question/view/QuestionListComponent';
import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function QuestionEditPage() {
  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

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
              // component={RouterLink}
              onClick={() => navigate(PATH_DASHBOARD.question.new)}
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
