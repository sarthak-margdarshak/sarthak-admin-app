import {
  AppBar, Button,
  Dialog, FormControlLabel, FormHelperText,
  IconButton, Link, ListItemText, Menu, MenuItem,
  Paper, Slide, Switch,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import React, {forwardRef, Fragment, useState} from "react";
import "katex/dist/katex.min.css";
import ReactKatex from "@pkasila/react-katex";
import {alpha} from "@mui/material/styles";
import MathInput from "react-math-keyboard";
import CloseIcon from "@mui/icons-material/Close";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ContentEditor({value, onChange}) {
  const [content, setContent] = useState(value);
  const [previewMode, setPreviewMode] = useState(false);
  const [mathDialogOpen, setMathDialogOpen] = useState(false);
  const [latex, setLatex] = useState(value);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpened = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleValueChange = (event, newValue) => {
    setContent(newValue);
    onChange(newValue);
    event.preventDefault();
  }

  return (
    <Fragment>
      <FormControlLabel
        control={
          <Switch
            checked={previewMode}
            onChange={() => setPreviewMode(!previewMode)}
          />
        }
        label="Preview"
      />

      {!previewMode ?
        <TextField
          multiline
          fullWidth
          variant="outlined"
          minRows={5}
          maxRows={10}
          value={content}
          onChange={(event) => handleValueChange(event, event.target.value)}
          onContextMenu={handleOpenMenu}
        />
        :
        <Paper
          sx={{
            p: 1,
            my: 1,
            minHeight: 132,
            bgcolor: (theme) =>
              alpha(theme.palette.grey[500], 0.12),
          }}
        >
          <ReactKatex>{content}</ReactKatex>
        </Paper>
      }

      <FormHelperText>
        We use <Link href='https://en.wikipedia.org/wiki/LaTeX' target='_blank'>LaTeX </Link>
        to describe the content and layout of the document. It is also used to insert Maths symbol.
        Anything appearing between two $ will be considered as LaTex.
        <Link href="https://api.sarthakmargdarshak.in/v1/storage/buckets/672a50aa003599f495e8/files/678bb1b600030bbbd00d/view?project=671f66a0001e5803f481&project=671f66a0001e5803f481&mode=admin" target='_blank'>
          Click here to learn more syntax
        </Link>
      </FormHelperText>

      <Dialog
        fullScreen
        open={mathDialogOpen}
        onClose={() => setMathDialogOpen(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMathDialogOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1 }}
              variant="h6"
              component="div"
            >
              Math Editor
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={(event) => {
                if (latex !== "") {
                  handleValueChange(event, content + " $" + latex + "$");
                }
                setLatex("");
                setMathDialogOpen(false);
              }}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
        <MathInput setValue={setLatex} />
      </Dialog>

      <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
        <MenuItem onClick={() => {
          setMathDialogOpen(true)
          handleCloseMenu()
        }}>
          <ListItemText>Insert Maths Content</ListItemText>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}