//* Slider 컴포넌트

import { useQuery } from "react-query";
import { getTopRated, getUpcomming } from "../api";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { makeImagePath } from "../utils";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const SliderContainer = styled.div`
  top: -100px;
  /* background-color: blue; */
  padding: 10px;
`;

const SliderTitle = styled.h2`
  display: block;
  font-size: 25px;
  font-weight: 700;
  padding: 5px 0;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
  height: 200px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

// & Variants &
const boxHoverVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.3,
      duration: 0.2,
      type: "spring",
    },
  },
};

export interface ISlider {
  data: any;
  isLoading: boolean;
  sectionName: string;
}

// 화면 Box 갯수 선언
const offset = 6;

export default function SliderComponent({
  data,
  isLoading,
  sectionName,
}: ISlider) {
  // 멀티플 Query Hook
  const useMultipleQuery = () => {
    const topRated = useQuery(["topRated"], getTopRated);
    const upComming = useQuery(["topRated"], getUpcomming);
    return [topRated, upComming];
  };
  // 멀티플 Query 배열
  const [
    { isLoading: loadingTopRated, data: topRatedData },
    { isLoading: loadingUpComming, data: upCommingData },
  ] = useMultipleQuery();

  const [index, setIndex] = useState(0);

  return (
    <SliderContainer>
      <SliderTitle>{sectionName}</SliderTitle>
      <AnimatePresence initial={false}>
        <button style={{ position: "absolute", left: 0 }}>
          <SlArrowLeft />
        </button>
        <button style={{ position: "absolute", right: 0 }}>
          <SlArrowRight />
        </button>
        <Row
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          {data?.results
            .slice(offset * index, offset * index + offset)
            .map((movie: any) => (
              <Box
                key={movie.id}
                layoutId={movie.id + ""}
                variants={boxHoverVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
                bgphoto={makeImagePath(movie.backdrop_path, "w500")}
              >
                <Info>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </SliderContainer>
  );
}
