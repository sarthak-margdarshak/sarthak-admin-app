import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Card, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "components/iconify";
import { useSnackbar } from "components/snackbar";
import FormProvider, { RHFTextField } from "components/hook-form";
import { useAuthContext } from "auth/useAuthContext";

const SOCIAL_LINKS = [
  {
    value: "facebookId",
    icon: <Iconify icon="eva:facebook-fill" width={24} />,
  },
  {
    value: "instagramId",
    icon: <Iconify icon="ant-design:instagram-filled" width={24} />,
  },
  {
    value: "linkedinId",
    icon: <Iconify icon="eva:linkedin-fill" width={24} />,
  },
  {
    value: "twitterId",
    icon: <Iconify icon="eva:twitter-fill" width={24} />,
  },
];

export default function AccountSocialLinks() {
  const { enqueueSnackbar } = useSnackbar();
  const { userProfile, updateUserProfile } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    facebookId: Yup.string().matches(
      /^(http:\/\/|https:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-.]*\/)*([\w\-.]*)|^$/,
      "Invalid Facebook URL"
    ),
    instagramId: Yup.string().matches(
      /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)|^$/,
      "Invalid Instagram URL"
    ),
    linkedinId: Yup.string().matches(
      /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)|^$/,
      "Invalid LinkedIn URL"
    ),
    twitterId: Yup.string().matches(
      /(?:https?:)?\/\/(?:www\.|m\.)?twitter\.com\/(\w{2,15})\/?(?:\?\S+)?(?:#\S+)?$|^$/,
      "Invalid Twitter URL"
    ),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues: {
      facebookId: userProfile?.facebookId || "",
      instagramId: userProfile?.instagramId || "",
      linkedinId: userProfile?.linkedinId || "",
      twitterId: userProfile?.twitterId || "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await updateUserProfile({
        facebookId: data.facebookId || null,
        instagramId: data.instagramId || null,
        linkedinId: data.linkedinId || null,
        twitterId: data.twitterId || null,
      });
      enqueueSnackbar("Update success!!!", {
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3} alignItems="flex-end">
          {SOCIAL_LINKS.map((link) => (
            <RHFTextField
              key={link.value}
              name={link.value}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{link.icon}</InputAdornment>
                ),
              }}
            />
          ))}

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
