import {
  AppBar,
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  Link,
  Paper,
  Slide,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { forwardRef, Fragment, useState } from "react";
import "katex/dist/katex.min.css";
import ReactKatex from "@pkasila/react-katex";
import { alpha, styled } from "@mui/material/styles";
import MathInput from "react-math-keyboard";
import CloseIcon from "@mui/icons-material/Close";
import { Upload } from "components/upload";
import InfoIcon from "@mui/icons-material/Info";
import Iconify from "components/iconify";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ContentTextField = styled((props) => <TextField {...props} />)(
  ({ theme }) => ({
    "& .MuiOutlinedInput-root": {
      overflow: "hidden",
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      border: "1px solid",
      backgroundColor: "#F3F6F9",
      borderColor: "#E0E3E7",
      transition: theme.transitions.create([
        "border-color",
        "background-color",
        "box-shadow",
      ]),
      "&.Mui-focused": {
        boxShadow: `${alpha(theme.palette.info.main, 0.25)} 0 0 0 2px`,
        borderColor: theme.palette.info.main,
      },
      ...theme.applyStyles("dark", {
        backgroundColor: "#1A2027",
        borderColor: "#2D3843",
      }),
    },
  })
);

export default function ContentEditor({
  value,
  onChange,
  requiredCover = false,
  cover,
  onDrop,
  onDelete,
  textInput,
}) {
  const [content, setContent] = useState(value);
  const [mode, setMode] = useState("write");
  const [mathDialogOpen, setMathDialogOpen] = useState(false);
  const [latex, setLatex] = useState(value);

  const handleValueChange = (event, newValue) => {
    setContent(newValue);
    onChange(newValue);
    event.preventDefault();
  };

  return (
    <Fragment>
      <Grid container spacing={1}>
        <Grid item xs={requiredCover ? 9 : 12}>
          <Stack
            alignItems="center"
            justifyContent="space-between"
            direction="row"
          >
            <ToggleButtonGroup
              color="primary"
              value={mode}
              exclusive
              onChange={(event, newMode) => {
                if (newMode === "write") {
                  setTimeout(() => {
                    textInput.current.focus();
                  }, 100);
                }
                setMode(newMode);
              }}
              size="small"
              sx={{
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              <ToggleButton value="write">Write</ToggleButton>
              <ToggleButton value="preview">Preview</ToggleButton>
            </ToggleButtonGroup>

            <Box
              sx={{
                border: `1px solid ${alpha("#9E9E9E", 0.32)}`,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                p: 0.2,
              }}
            >
              <Tooltip title="Click to add maths content">
                <IconButton
                  disabled={mode === "preview"}
                  onClick={() => setMathDialogOpen(true)}
                >
                  <Iconify icon="ph:math-operations-fill" />{" "}
                </IconButton>
              </Tooltip>

              <Tooltip title="We use Latex to describe the content and layout of the document. It is also used to insert Maths symbol. Anything appearing between two $ will be considered as LaTex.">
                <Link
                  href="https://api.sarthakmargdarshak.in/v1/storage/buckets/sarthak_datalake_bucket/files/67ba3f08001bc2ac97f2/view?project=sarthak-margdarshak&mode=admin"
                  target="_blank"
                >
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Link>
              </Tooltip>
            </Box>
          </Stack>

          {mode === "write" ? (
            <ContentTextField
              multiline
              fullWidth
              variant="outlined"
              minRows={3}
              maxRows={10}
              value={content}
              onChange={(event) => handleValueChange(event, event.target.value)}
              inputRef={textInput}
              autoFocus
            />
          ) : (
            <Paper
              sx={{
                p: 1,
                minHeight: 104,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <ReactKatex>{content}</ReactKatex>
            </Paper>
          )}
        </Grid>

        {requiredCover && (
          <Grid item xs={3}>
            <Upload
              accept={{ "image/*": [] }}
              file={cover}
              onDrop={onDrop}
              onDelete={onDelete}
            />
          </Grid>
        )}
      </Grid>

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
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
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
    </Fragment>
  );
}
