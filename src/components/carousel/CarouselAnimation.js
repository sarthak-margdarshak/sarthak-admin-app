import PropTypes from "prop-types";
import { useState, useRef } from "react";
// @mui
import { alpha, useTheme } from "@mui/material/styles";
import { Box, Card, Paper } from "@mui/material";
// utils
import { bgGradient } from "../../utils/cssStyles";
// components
import Image from "../../components/image";
import Carousel, { CarouselArrowIndex } from "../../components/carousel";

// ----------------------------------------------------------------------

CarouselAnimation.propTypes = {
  data: PropTypes.array,
};

export default function CarouselAnimation({ data }) {
  const theme = useTheme();

  const carouselRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(
    theme.direction === "rtl" ? data?.length - 1 : 0
  );

  const carouselSettings = {
    speed: 800,
    dots: false,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === "rtl"),
    beforeChange: (current, next) => setCurrentIndex(next),
  };

  const handlePrev = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Card>
      <Carousel ref={carouselRef} {...carouselSettings}>
        {data?.map((item, index) => (
          <CarouselItem key={item.id} item={item} />
        ))}
      </Carousel>

      <CarouselArrowIndex
        index={currentIndex}
        total={data?.length}
        onNext={handleNext}
        onPrevious={handlePrev}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
  item: PropTypes.object,
};

function CarouselItem({ item }) {
  const theme = useTheme();

  const { image, title } = item;

  return (
    <Paper sx={{ position: "relative" }}>
      <Image alt={title} src={image} ratio="16/9" />

      <Box
        sx={{
          top: 0,
          width: 1,
          height: 1,
          position: "absolute",
          ...bgGradient({
            direction: "to top",
            startColor: `${theme.palette.grey[900]} 0%`,
            endColor: `${alpha(theme.palette.grey[900], 0)} 100%`,
          }),
        }}
      />
    </Paper>
  );
}
