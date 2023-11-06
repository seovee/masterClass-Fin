//* Slider 컴포넌트

import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { makeImagePath } from "../utils";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { useHistory } from "react-router-dom";

/* 부모 컴포넌트 호버하려면 Button이 위에 선언되야함! */
const Button = styled.button`
  position: absolute;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  height: 200px;
  color: white;
  width: 60px;
  cursor: pointer;
  opacity: 0;
  transition: 0.2s opacity linear;
  z-index: 10;
  font-size: 30px;
`;

const SliderContainer = styled.div`
  top: -200px;
  position: relative;
  height: 250px;
  width: 100%;
  /* 부모컴포넌트 호버시 자식 컴포넌트 애니메이션 */
  &:hover ${Button} {
    opacity: 1;
  }
`;

const SliderTitle = styled.h2`
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  padding: 10px;
  margin-top: 20px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  height: 100%;
  gap: 5px;
  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
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
    font-weight: 500;
  }
`;

// & Variants
const rowVariants = {
  hidden: (back: boolean) => ({
    x: back ? -window.innerWidth : window.innerWidth,
  }),
  visible: { x: 0 },
  exit: (back: boolean) => ({
    x: back ? window.innerWidth : -window.innerWidth,
  }),
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

function Slider({ data, sectionName }: ISlider) {
  const [offset, setOffset] = useState(6); // 화면 Box 갯수 전역 선언
  const [index, setIndex] = useState(0); // Row 페이지 상태관리
  const [back, setBack] = useState(false); // custom props
  const [leaving, setLeaving] = useState(false);
  // row들의 간격 벌어짐을 방지(다 실행된 후에 클릭 실행하게 하는 것)

  // Next버튼 액션
  const nextIndex = () => {
    if (data) {
      setLeaving(true);
      setBack(false);
      const totalMovies = data?.results.length - 1;
      const maxPage = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev >= maxPage ? 0 : prev + 1));
    }
  };
  // Prev버튼 액션
  const prevIndex = () => {
    if (data) {
      setLeaving(true);
      setBack(true);
      const totalMovies = data?.results.length - 1;
      const maxPage = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev <= 0 ? maxPage : prev - 1));
    }
  };

  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setOffset(4);
    } else {
      setOffset(6);
    }

    if (leaving) {
      setLeaving(false);
    }
  }, [leaving, setOffset]);

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
          <AnimatePresence custom={back} initial={false}>
            <Row
              custom={back}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 0.5 }}
              key={index}
            >
              {data?.results.slice(offset * index, offset * index + offset).map(
                (movie: any) =>
                  movie && (
                    <Box
                      key={movie.id}
                      // layoutId={movie.id + ""}
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
                  )
              )}
            </Row>
          </AnimatePresence>
        </SliderContainer>
      )}
    </>
  );
}

export default Slider;
