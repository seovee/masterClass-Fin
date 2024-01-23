import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Types, makeImagePath } from "../utils";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { IGetMoviesResult, getMovieVideo, getMovies } from "../api";
import { useQuery } from "react-query";

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
  top: -100px;
  position: relative;
  height: 250px;
  width: 100%;
  &:hover ${Button} {
    opacity: 1;
  }
`;

const SliderTitle = styled.h2`
  display: block;
  font-size: 30px;
  font-weight: 700;
  padding: 10px;
  margin-top: 20px;
  @media screen and (max-width: 1024px) {
    font-size: 25px;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  height: 100%;
  gap: 10px;
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
    font-weight: 200;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 5;
`;

const BigMovieContainer = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 10;
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
`;

// & Variants
const rowVariants = {
  outRow: (back: boolean) => ({
    x: back ? -window.innerWidth : window.innerWidth,
  }),
  visible: { x: 0 },
  inRow: (back: boolean) => ({
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
      delay: 0.3,
      duration: 0.3,
      type: "tween",
    },
  },
};

function Slider({ type }: { type: Types }) {
  const history = useHistory();
  const overlayMovie = useRouteMatch<{ movieId: string }>(
    `/movies/${type}/:movieId`
  );
  const { scrollY } = useViewportScroll();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", type], () =>
    getMovies(type)
  );

  const [offset, setOffset] = useState(6); // 화면 Box 갯수 전역 선언
  const [index, setIndex] = useState(0); // Row 페이지 상태관리
  const [back, setBack] = useState(false); // custom props
  const [leaving, setLeaving] = useState(false); // row들의 간격 벌어짐을 방지(다 실행된 후에 클릭 실행하게 하는 것)

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

  // 영화 상세정보 보기
  const onBoxClicked = ({
    movieId,
    category,
  }: {
    movieId: number;
    category: string;
  }) => {
    history.push(`/movies/${category}/${movieId}`);
  };

  // 영화 상세정보 빠져나오기
  const onOverlayClick = () => history.push("/");

  // ^ 이 부분의 정확한 로직이 이해되지 않음.
  // fetch한 데이터와 useRouteMatch와 매치한 데이터 불러오기
  const clickedMovie =
    overlayMovie?.params.movieId &&
    data?.results.find((movie) => movie.id === +overlayMovie.params.movieId);

  return (
    <>
      <SliderContainer>
        <SliderTitle>{type}</SliderTitle>
        <Button onClick={prevIndex} style={{ left: 0 }}>
          <SlArrowLeft />
        </Button>
        <Button onClick={nextIndex} style={{ right: 0 }}>
          <SlArrowRight />
        </Button>
        <AnimatePresence custom={back} initial={false}>
          <Row
            key={index}
            custom={back}
            variants={rowVariants}
            initial="outRow"
            animate="visible"
            exit="inRow"
            transition={{ type: "tween", duration: 0.5 }}
          >
            {data?.results.slice(offset * index, offset * index + offset).map(
              (movie) =>
                movie && (
                  <Box
                    key={type + movie.id}
                    onClick={() =>
                      onBoxClicked({ movieId: movie.id, category: type })
                    }
                    layoutId={type + movie.id}
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
      <AnimatePresence>
        {overlayMovie ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovieContainer
              style={{ top: scrollY.get() + 100 }}
              layoutId={type + overlayMovie.params.movieId}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>
                    {clickedMovie?.overview === ""
                      ? "제공하는 줄거리가 존재하지 않습니다."
                      : clickedMovie?.overview}
                  </BigOverview>
                  <div>{clickedMovie.popularity}</div>
                  <div>{clickedMovie.release_date}</div>
                  <div>{clickedMovie.genre_ids[0]}</div>
                </>
              )}
            </BigMovieContainer>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Slider;
