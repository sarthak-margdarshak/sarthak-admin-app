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

import PropTypes from "prop-types";
import * as Yup from "yup";
import { useEffect, useState } from "react";
// @mui
import {
  Stack,
  Avatar,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  Grid,
  Card,
  Button,
} from "@mui/material";
// components
import Label from "../../../../components/label";
import Iconify from "../../../../components/iconify";
import MenuPopover from "../../../../components/menu-popover";
import { useSnackbar } from "../../../../components/snackbar";
// Auth
import { APPWRITE_API } from "../../../../config-global";
import { databases, storage } from "../../../../auth/AppwriteContext";
import { useAuthContext } from "../../../../auth/useAuthContext";
import FormProvider from "../../../../components/hook-form/FormProvider";
import { Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { RHFSwitch } from "../../../../components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  isCEO: PropTypes.bool,
  teamId: PropTypes.string,
  onBlonToogleBlockRowockRow: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function UserTableRow({
  index,
  userRow,
  onViewRow,
  isCEO,
  teamId,
  onToogleBlockRow,
}) {
  const [openPopover, setOpenPopover] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const { sarthakInfoData } = useAuthContext();

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [row, setRow] = useState(userRow);

  useEffect(() => {
    async function fetchData() {
      try {
        if (row?.photoUrl) {
          const tempAvatar = storage.getFilePreview(
            APPWRITE_API.buckets.adminUserImage,
            row?.photoUrl,
            undefined,
            undefined,
            undefined,
            20
          ).href;
          setAvatarUrl(tempAvatar);
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: "error" });
      }
    }
    fetchData();
  }, [enqueueSnackbar, row]);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const NewUserSchema = Yup.object().shape({
    createTeam: Yup.boolean(),
  });

  const defaultValues = {
    createTeam: row?.createTeam,
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await databases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.adminUsers,
        row?.userId,
        {
          createTeam: data.createTeam,
        }
      );
      setPermissionDialogOpen(false);
      setRow({ ...row, createTeam: data.createTeam });
      enqueueSnackbar("Permission updated successfully");
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell align="left">{index}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={row?.name} src={avatarUrl} />

            <Typography variant="subtitle2" noWrap>
              {row?.userName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {row?.roles}
        </TableCell>

        <TableCell align="center">
          <Iconify
            icon={
              row?.confirm ? "eva:checkmark-circle-fill" : "eva:clock-outline"
            }
            sx={{
              width: 20,
              height: 20,
              color: "success.main",
              ...(!row?.confirm && { color: "warning.main" }),
            }}
          />
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={(!row?.blocked === false && "error") || "success"}
            sx={{ textTransform: "capitalize" }}
          >
            {row?.blocked ? "Blocked" : "Active"}
          </Label>
        </TableCell>

        <TableCell align="center">
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={handleOpenPopover}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="carbon:view" />
          View
        </MenuItem>
        {sarthakInfoData.adminTeamId === teamId && isCEO && (
          <>
            <MenuItem
              disabled={row?.userId === APPWRITE_API.documents.ceoId}
              onClick={() => {
                setPermissionDialogOpen(true);
                handleClosePopover();
              }}
            >
              <Iconify icon="fluent-mdl2:permissions" />
              Permissions
            </MenuItem>

            <MenuItem
              disabled={row?.userId === APPWRITE_API.documents.ceoId}
              onClick={() => {
                onToogleBlockRow();
                handleClosePopover();
              }}
            >
              <Iconify icon="material-symbols:block" />
              {row?.blocked ? "Unblock" : "Block"}
            </MenuItem>
          </>
        )}
      </MenuPopover>

      <Dialog maxWidth="md" open={permissionDialogOpen}>
        <DialogTitle sx={{ pb: 2 }}>
          {"Update Permission for " + row?.userName}
        </DialogTitle>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  }}
                >
                  <RHFSwitch name="createTeam" label="Allow Team Creation" />
                </Box>

                <Stack
                  direction={"row-reverse"}
                  alignItems={"end"}
                  sx={{ mt: 3 }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="zondicons:close-outline" />}
                    onClick={() => setPermissionDialogOpen(false)}
                    sx={{ ml: 2 }}
                  >
                    Close
                  </Button>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Update
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </Dialog>
    </>
  );
}
