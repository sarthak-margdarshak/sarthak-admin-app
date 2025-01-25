import PropTypes from "prop-types";
import { forwardRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
// @mui
import { Box } from "@mui/material";
//
import getRatio from "./getRatio";

// ----------------------------------------------------------------------

const Image = forwardRef(
  ({ ratio, disabledEffect = false, effect = "blur", sx, ...other }, ref) => {
    // function getBase64Image(img) {
    //   const canvas = document.createElement("canvas");
    //   canvas.width = img.width;
    //   canvas.height = img.height;
    //
    //   const ctx = canvas.getContext("2d");
    //   ctx.drawImage(img, 0, 0);
    //
    //   const dataURL = canvas.toDataURL("image/png");
    //
    //   return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    // }

    const content = (
      <Box
        component={LazyLoadImage}
        wrapperClassName="wrapper"
        effect={disabledEffect ? undefined : effect}
        placeholderSrc={
          disabledEffect ? "/assets/transparent.png" : "/assets/placeholder.svg"
        }
        sx={{ width: 1, height: 1, objectFit: "cover" }}
        // onLoad={(event) => {
        //   const imgData = getBase64Image(event.target);
        //   const x = JSON.parse(localStorage.getItem('images')) || {};
        //   x[id] = imgData
        //   const y = JSON.stringify(x);
        //   localStorage.setItem("images", y);
        // }}
        crossOrigin="anonymous"
        {...other}
      />
    );

    if (ratio) {
      return (
        <Box
          ref={ref}
          component="span"
          sx={{
            width: 1,
            lineHeight: 1,
            display: "block",
            overflow: "hidden",
            position: "relative",
            pt: getRatio(ratio),
            "& .wrapper": {
              top: 0,
              left: 0,
              width: 1,
              height: 1,
              position: "absolute",
              backgroundSize: "cover !important",
            },
            ...sx,
          }}
        >
          {content}
        </Box>
      );
    }

    return (
      <Box
        ref={ref}
        component="span"
        sx={{
          lineHeight: 1,
          display: "block",
          overflow: "hidden",
          position: "relative",
          "& .wrapper": {
            width: 1,
            height: 1,
            backgroundSize: "cover !important",
          },
          ...sx,
        }}
      >
        {content}
      </Box>
    );
  }
);

Image.propTypes = {
  sx: PropTypes.object,
  effect: PropTypes.string,
  disabledEffect: PropTypes.bool,
  ratio: PropTypes.oneOf([
    "4/3",
    "3/4",
    "6/4",
    "4/6",
    "16/9",
    "9/16",
    "21/9",
    "9/21",
    "1/1",
  ]),
};

export default Image;
