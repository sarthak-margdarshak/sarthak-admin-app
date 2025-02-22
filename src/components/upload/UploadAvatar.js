import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import {CircularProgress, Typography} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import Iconify from "components/iconify";
import RejectionFiles from "components/upload/errors/RejectionFiles";
import AvatarPreview from "components/upload/preview/AvatarPreview";
import React from "react";

const StyledDropZone = styled("div")(({ theme }) => ({
  width: 144,
  height: 144,
  margin: "auto",
  display: "flex",
  cursor: "pointer",
  overflow: "hidden",
  borderRadius: "50%",
  alignItems: "center",
  position: "relative",
  justifyContent: "center",
  border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
}));

const StyledPlaceholder = styled("div")(({ theme }) => ({
  zIndex: 7,
  display: "flex",
  borderRadius: "50%",
  position: "absolute",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  width: `calc(100% - 16px)`,
  height: `calc(100% - 16px)`,
  color: theme.palette.text.disabled,
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create("opacity", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
}));

UploadAvatar.propTypes = {
  sx: PropTypes.object,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.node,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  uploading: PropTypes.bool,
};

export default function UploadAvatar({
  error,
  file,
  disabled,
  helperText,
  sx,
  uploading,
  ...other
}) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    disabled,
    ...other,
  });

  const hasFile = !!file;

  const isError = isDragReject || !!error;

  return (
    <React.Fragment>
      <StyledDropZone
        {...getRootProps()}
        sx={{
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(isError && {
            borderColor: "error.light",
            ...(hasFile && {
              bgcolor: "error.lighter",
            }),
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: "none",
          }),
          ...(hasFile && {
            "&:hover": {
              "& .placeholder": {
                opacity: 1,
              },
            },
          }),
          ...sx,
        }}
      >
        {uploading ? <CircularProgress /> : (<>
          <input {...getInputProps()} />

          {hasFile && <AvatarPreview file={file} />}

          <StyledPlaceholder
            className="placeholder"
            sx={{
              "&:hover": {
                opacity: 0.72,
              },
              ...(hasFile && {
                zIndex: 9,
                opacity: 0,
                color: "common.white",
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
              }),
              ...(isError && {
                color: "error.main",
                bgcolor: "error.lighter",
              }),
            }}
          >
            <Iconify icon="ic:round-add-a-photo" width={24} sx={{ mb: 1 }} />

            <Typography variant="caption">Upload Photo</Typography>
          </StyledPlaceholder>
        </>)}
      </StyledDropZone>

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections} />
    </React.Fragment>
  );
}
