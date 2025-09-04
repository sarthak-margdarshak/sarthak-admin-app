import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import BookIndexFilter from "sections/@dashboard/management/content/layout/filter-view/BookIndexFilter";
import Iconify from "components/iconify";
import CloseIcon from "@mui/icons-material/Close";
import AdminUserList from "sections/@dashboard/management/admin/user/AdminUserList";

export default function FilterDialog({
  filterWindowOpen,
  searchParams,
  handleClose,
  onAddParam,
}) {
  const [currentParam, setCurrentParam] = useState({});

  const onChangeCategory = (event) => {
    const ind = searchParams.findIndex(
      (param) => param.value === event.target.value
    );
    if (ind !== -1) setCurrentParam(searchParams[ind]);
  };

  return (
    <Dialog open={filterWindowOpen} scroll="body">
      <DialogTitle sx={{ m: 0, p: 2 }}>Add Filters</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>

      <Divider sx={{ mb: 2 }} />

      <DialogContent dividers>
        <FormControl sx={{ m: 1, minWidth: 500 }}>
          <InputLabel id="parameters">Parameter</InputLabel>

          <Select
            labelId="category"
            defaultValue={""}
            value={currentParam.value}
            label="Category"
            onChange={onChangeCategory}
            variant="outlined"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {searchParams.map((param, i) => (
              <MenuItem disabled={param.isSelected} value={param.value} key={i}>
                {param.label}
              </MenuItem>
            ))}
          </Select>

          {currentParam.value === "bookIndex" && (
            <BookIndexFilter
              onChange={(id) =>
                setCurrentParam({
                  ...currentParam,
                  isSelected: true,
                  content: id,
                })
              }
            />
          )}

          {currentParam.value === "content" && (
            <>
              <TextField
                id="outlined-textarea"
                placeholder="Type here......."
                sx={{ mt: 2 }}
                multiline
                fullWidth
                variant="outlined"
                minRows={5}
                maxRows={10}
                onChange={(event) =>
                  setCurrentParam({
                    ...currentParam,
                    isSelected: true,
                    content: event.target.value,
                  })
                }
              />
              <Typography sx={{ m: 1 }} variant="caption">
                We will search content which is available in primary language
                only.
              </Typography>
            </>
          )}

          {currentParam.value === "published" && (
            <ListItem>
              <ListItemIcon>
                <Iconify icon="duo-icons:approved" />
              </ListItemIcon>
              <ListItemText id="switch-list-label-wifi" primary="Published" />
              <Switch
                edge="end"
                onChange={() =>
                  setCurrentParam({
                    ...currentParam,
                    isSelected: true,
                    content: !currentParam.content,
                  })
                }
                checked={currentParam.content}
                inputProps={{
                  "aria-labelledby": "switch-list-label-wifi",
                }}
              />
            </ListItem>
          )}

          {(currentParam.value === "creator" ||
            currentParam.value === "updater" ||
            currentParam.value === "approver") && (
            <AdminUserList
              onChange={(id) =>
                setCurrentParam({
                  ...currentParam,
                  isSelected: true,
                  content: id,
                })
              }
            />
          )}
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            onAddParam(currentParam);
            setCurrentParam({});
            handleClose();
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
