//* Slider 컴포넌트

import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { makeImagePath } from "../utils";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { useHistory } from "react-router-dom";

const SliderContainer = styled.div`
  top: -100px;
  position: relative;
  height: 250px;
`;

const SliderTitle = styled.h2`
  display: block;
  font-size: 25px;
  font-weight: 700;
  padding: 5px 0;
`;

const Button = styled.button`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  height: 200px;
  color: white;
  width: 40px;
  cursor: pointer;
  opacity: 0;
  transition: 0.2s opacity linear;
  z-index: 10;
  &:hover {
    opacity: 1;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  height: 100%;
  gap: 5px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
  height: 200px;
  cursor: pointer;
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
const rowVariants = {
  hidden: (back: boolean) => ({
    x: back ? -window.innerWidth : window.innerWidth,
  }),
  visible: { x: 0 },
  exit: { x: -window.innerWidth },
};

const boxHoverVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.3,
      duration: 0.2,
      type: "tween",
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
  sectionName: string;
}

// 화면 Box 갯수 전역 선언
const offset = 6;

export default function Slider({ data, sectionName }: ISlider) {
  const history = useHistory();
  // Row 페이지 상태관리
  const [index, setIndex] = useState(0);
  // custom props
  const [back, setBack] = useState(false);

  // row들의 간격 벌어짐을 방지하기 위해
  //??? 이거를 정확히 하는 이유가?...
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  // Next버튼 액션
  const nextIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data?.results.length - 1;
      const maxPage = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev >= maxPage ? 0 : prev + 1));
    }
  };
  // Prev버튼 액션
  const prevIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data?.results.length - 1;
      const maxPage = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev <= 0 ? maxPage : prev - 1));
    }
  };

  return (
    <>
      {data && (
        <SliderContainer>
          <SliderTitle>{sectionName}</SliderTitle>
          <Button onClick={prevIndex} style={{ left: 0 }}>
            <SlArrowLeft />
          </Button>
          <Button onClick={nextIndex} style={{ right: 0 }}>
            <SlArrowRight />
          </Button>
          <AnimatePresence
            initial={false}
            onExitComplete={toggleLeaving}
            custom={back}
          >
            <Row
              custom={back}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 0.5 }}
              key={index}
            >
              {data.results
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
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
        </SliderContainer>
      )}
    </>
  );
}
