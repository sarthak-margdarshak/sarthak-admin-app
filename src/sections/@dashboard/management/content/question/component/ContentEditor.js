import {
  AppBar,
  Button,
  Dialog,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
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
import React, { forwardRef, Fragment, useEffect, useState } from "react";
import "katex/dist/katex.min.css";
import ReactKatex from "@pkasila/react-katex";
import { alpha, styled } from "@mui/material/styles";
import MathInput from "react-math-keyboard";
import CloseIcon from "@mui/icons-material/Close";
import { Upload } from "components/upload";
import InfoIcon from "@mui/icons-material/Info";
import Iconify from "components/iconify";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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

const formats = {
  bold: { id: "bold", addStartValue: "$\\text{\\textbf{", addEndValue: "}}$" },
  italic: {
    id: "italic",
    addStartValue: "$\\text{\\textit{",
    addEndValue: "}}$",
  },
  underline: {
    id: "underline",
    addStartValue: "$\\text{\\underline{",
    addEndValue: "}}$",
  },
  darkBullet: {
    id: "darkBullet",
    addStartValue: "$\\bullet",
    addEndValue: " $",
  },
  lightBullet: {
    id: "lightBullet",
    addStartValue: "$\\circ",
    addEndValue: " $",
  },
  highlight: {
    id: "highlight",
    addStartValue: "$\\text{\\colorbox{orange}{",
    addEndValue: "}}$",
  },
};

export default function ContentEditor({
  value,
  onChange,
  requiredCover = false,
  cover,
  onDrop,
  onDelete,
  textInput,
}) {
  const [editingContent, setEditingContent] = useState("");
  const [finalContent, setFinalContent] = useState(value);
  const [mode, setMode] = useState("write");
  const [mathDialogOpen, setMathDialogOpen] = useState(false);
  const [latex, setLatex] = useState(value);
  const [cursorSelection, setCursorSelection] = useState({
    start: 0,
    end: editingContent.length,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const tmpEdit = convertToEditing(finalContent);
    setEditingContent(tmpEdit);
    setCursorSelection({ start: 0, end: tmpEdit.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertToFinal = (textValue) => {
    return textValue.replaceAll("\n", "$\\\\$").replaceAll("\t", "$\\quad$");
  };

  const convertToEditing = (textValue) => {
    return textValue.replaceAll("$\\\\$", "\n").replaceAll("$\\quad$", "\t");
  };

  const handleValueChange = (text) => {
    setEditingContent(text);
    setFinalContent(convertToFinal(text));
    onChange(convertToFinal(text));
  };

  const handleKeyDown = (e) => {
    const { value } = e.target;
    if (e.key === "Tab") {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      const cursorEndPosition = e.target.selectionEnd;
      const tab = "\t";
      e.target.value =
        value.substring(0, cursorPosition) +
        tab +
        value.substring(cursorEndPosition);
      e.target.selectionStart = cursorPosition + 1;
      e.target.selectionEnd = cursorPosition + 1;
    }
  };

  const handleMouseUp = (e) => {
    setCursorSelection({
      start: e.target.selectionStart,
      end: e.target.selectionEnd,
    });
  };

  const addFormats = (formatType) => {
    let value = editingContent;
    const cursorPosition = cursorSelection.start;
    const cursorEndPosition = cursorSelection.end;
    value =
      value.substring(0, cursorPosition) +
      formats[formatType].addStartValue +
      value.substring(cursorPosition, cursorEndPosition) +
      formats[formatType].addEndValue +
      value.substring(cursorEndPosition);
    setCursorSelection({
      start: cursorPosition + formats[formatType].addStartValue.length,
      end: cursorEndPosition + formats[formatType].addStartValue.length,
    });
    handleValueChange(value);
    setTimeout(() => {
      textInput.current.focus();
    }, 1);
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
                if (newMode === "write" || newMode === "split") {
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
              <ToggleButton value="split">Split</ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              aria-label="text formatting"
              size="small"
              sx={{
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              <Tooltip title="Bold">
                <ToggleButton
                  value="bold"
                  aria-label="bold"
                  onClick={() => addFormats(formats.bold.id)}
                >
                  <FormatBoldIcon />
                </ToggleButton>
              </Tooltip>

              <Tooltip title="Italic">
                <ToggleButton
                  value="italic"
                  aria-label="italic"
                  onClick={() => addFormats(formats.italic.id)}
                >
                  <FormatItalicIcon />
                </ToggleButton>
              </Tooltip>

              <Tooltip title="Underline">
                <ToggleButton
                  value="underlined"
                  aria-label="underlined"
                  onClick={() => addFormats(formats.underline.id)}
                >
                  <FormatUnderlinedIcon />
                </ToggleButton>
              </Tooltip>

              <Tooltip title="Bullet List" placement="top">
                <ToggleButton
                  value="bullet-list"
                  label="bullet-list"
                  onClick={handleClick}
                >
                  <FormatListBulletedIcon />
                  <ArrowDropDownIcon />
                </ToggleButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      addFormats(formats.darkBullet.id);
                      handleClose();
                    }}
                  >
                    <Iconify icon="radix-icons:dot-filled" />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      addFormats(formats.lightBullet.id);
                      handleClose();
                    }}
                  >
                    <Iconify icon="radix-icons:dot" />
                  </MenuItem>
                </Menu>
              </Tooltip>

              <Tooltip
                title="Highlight"
                onClick={() => addFormats(formats.highlight.id)}
              >
                <ToggleButton value="numbered-list" aria-label="highlight">
                  <HighlightAltIcon />
                </ToggleButton>
              </Tooltip>

              <Tooltip title="Click to insert maths content">
                <ToggleButton
                  value="math"
                  disabled={mode === "preview"}
                  onClick={() => setMathDialogOpen(true)}
                >
                  <Iconify icon="ph:math-operations-fill" />{" "}
                </ToggleButton>
              </Tooltip>

              <Tooltip title="We use Latex to describe the content and layout of the document. It is also used to insert Maths symbol. Anything appearing between two $ will be considered as LaTex.">
                <Link
                  // href="https://api.sarthakmargdarshak.in/v1/storage/buckets/sarthak_datalake_bucket/files/67ba3f08001bc2ac97f2/view?project=sarthak-margdarshak&mode=admin"
                  href="https://katex.org/docs/supported#operators"
                  target="_blank"
                >
                  <ToggleButton value="info">
                    <InfoIcon />
                  </ToggleButton>
                </Link>
              </Tooltip>
            </ToggleButtonGroup>
          </Stack>

          {mode === "write" && (
            <ContentTextField
              multiline
              fullWidth
              variant="outlined"
              minRows={3}
              maxRows={10}
              value={editingContent}
              onFocus={() => {
                textInput.current.selectionStart = cursorSelection.start;
                textInput.current.selectionEnd = cursorSelection.end;
              }}
              onChange={(event) => handleValueChange(event.target.value)}
              onMouseUp={handleMouseUp}
              onKeyDown={handleKeyDown}
              inputRef={textInput}
            />
          )}

          {mode === "preview" && (
            <Paper
              sx={{
                p: 1,
                minHeight: 104,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <ReactKatex>{finalContent}</ReactKatex>
            </Paper>
          )}

          {mode === "split" && (
            <Grid container>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <ContentTextField
                  multiline
                  fullWidth
                  variant="outlined"
                  minRows={3}
                  maxRows={10}
                  value={editingContent}
                  inputRef={textInput}
                  onChange={(event) => handleValueChange(event.target.value)}
                  onKeyDown={handleKeyDown}
                  onMouseUp={handleMouseUp}
                  onFocus={() => {
                    textInput.current.selectionStart = cursorSelection.start;
                    textInput.current.selectionEnd = cursorSelection.end;
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Paper
                  sx={{
                    p: 1,
                    minHeight: 104,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                  }}
                >
                  <ReactKatex>{finalContent}</ReactKatex>
                </Paper>
              </Grid>
            </Grid>
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
              onClick={() => {
                if (latex !== "") {
                  const value = `${editingContent.substring(
                    0,
                    cursorSelection.start
                  )} $${latex}$${editingContent.substring(
                    cursorSelection.end
                  )}`;
                  handleValueChange(value);
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
