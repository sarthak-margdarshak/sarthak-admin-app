import {
  Alert,
  Collapse,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IndexView from "sections/@dashboard/management/content/question/component/IndexView";
import SarthakUserDisplayUI from "sections/@dashboard/management/admin/user/SarthakUserDisplayUI";
import Iconify from "components/iconify";
import { useState } from "react";

export default function FilterOption({ option, onDelete }) {
  const [open, setOpen] = useState(option.isSelected);
  return (
    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
      <Collapse in={open}>
        <Alert
          severity="info"
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
                onDelete(option.value);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          icon={
            <Iconify
              icon={
                option.value === "bookIndex"
                  ? "oui:app-index-rollup"
                  : option.value === "content"
                  ? "catppuccin:folder-content"
                  : option.value === "published"
                  ? "duo-icons:approved"
                  : option.value === "creator"
                  ? "flowbite:user-add-outline"
                  : option.value === "updater"
                  ? "fa-solid:user-edit"
                  : "fa-solid:user-cog"
              }
            />
          }
        >
          <Stack spacing={2} direction="row">
            <Typography>{option.label + " -"}</Typography>
            {option.value === "bookIndex" && <IndexView id={option.content} />}
            {option.value === "content" && (
              <Typography>{option.content}</Typography>
            )}
            {option.value === "published" && (
              <Typography>{option.content.toString()}</Typography>
            )}
            {option.value === "creator" && (
              <SarthakUserDisplayUI userId={option.content} />
            )}
            {option.value === "updater" && (
              <SarthakUserDisplayUI userId={option.content} />
            )}
            {option.value === "approver" && (
              <SarthakUserDisplayUI userId={option.content} />
            )}
          </Stack>
        </Alert>
      </Collapse>
    </Grid>
  );
}
