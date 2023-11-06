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
  background-color: blue;
  padding: 10px;
`;

const SliderTitle = styled.h2`
  display: block;
  font-size: 25px;
  font-weight: 700;
  padding: 5px 0;
`;

const Button = styled.button`
  border: none;
  position: absolute;
  background-color: rgba(0, 200, 0, 0.5);
  height: auto;
  color: lightgray;
  height: 200px;
  width: 40px;
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

// & Variants
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

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

// & Interface
export interface ISlider {
  data: any;
  isLoading: boolean;
  sectionName: string;
}

// 화면 Box 갯수 선언
const offset = 6;

export default function Slider({ data, isLoading, sectionName }: ISlider) {
  // Row페이지 상태관리
  const [page, setPage] = useState(0);

  // Next, Prev버튼 액션
  const nextPage = () => {
    if (data) {
      const totalMovies = data.results.length;
      const maxPage = Math.floor(totalMovies / offset) - 1;
      setPage((page) => (page === maxPage ? 0 : page + 1));
    }
  };

  return (
    <SliderContainer>
      <SliderTitle>{sectionName}</SliderTitle>
      <Button onClick={nextPage} style={{ left: 0 }}>
        <SlArrowLeft />
      </Button>
      <Button onClick={nextPage} style={{ right: 0 }}>
        <SlArrowRight />
      </Button>
      <AnimatePresence initial={false}>
        <Row
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={sectionName}
        >
          {data?.results
            .slice(offset * page, offset * page + offset)
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
                <Info variants={infoVariants}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </SliderContainer>
  );
}
