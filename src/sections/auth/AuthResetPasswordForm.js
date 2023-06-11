import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
// components
import FormProvider, { RHFTextField } from '../../components/hook-form';
// Appwrite
import { Client, Account } from "appwrite";
import { APPWRITE_API } from '../../config-global';

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const client = new Client()
    .setEndpoint(APPWRITE_API.backendUrl)
    .setProject(APPWRITE_API.projectId);

    const account = new Account(client);

    const promise = account.createRecovery(data.email,'http://localhost:3000/auth');

    promise.then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 3 }}
      >
        Send Request
      </LoadingButton>
    </FormProvider>
  );
}
