import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  getNowPlaying,
  getTopRated,
  getUpcomming,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  font-weight: 800;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovieContainer = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
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

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useViewportScroll();

  // 멀티플 Query Hook
  const useMultipleQuery = () => {
    const nowPlaying = useQuery<IGetMoviesResult>(
      ["nowPlaying", "movie"],
      getNowPlaying
    );
    const topRated = useQuery<IGetMoviesResult>(["topRated"], getTopRated);
    const upComming = useQuery<IGetMoviesResult>(["topRated"], getUpcomming);
    return [nowPlaying, topRated, upComming];
  };
  // 멀티플 Query 배열
  const [
    { isLoading: loadingNowPlaying, data: nowPlayingData },
    { isLoading: loadingTopRated, data: topRatedData },
    { isLoading: loadingUpComming, data: upCommingData },
  ] = useMultipleQuery();

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  // 영화 상세정보 보기
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  // 영화 상세정보 빠져나오기
  const onOverlayClick = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    nowPlayingData?.results.find(
      (movie: any) => movie.id === +bigMovieMatch.params.movieId
    );
  return (
    <Wrapper>
      {loadingNowPlaying ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* 메인 Banner */}
          <Banner />
          {/* 슬라이더 */}
          {/* <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <button onClick={increaseIndex}>Prev</button>
              <button onClick={increaseIndex}>Next</button>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={page}
              >
                {nowPlayingData?.results
                  .slice(1)
                  .slice(offset * page, offset * page + offset)
                  .map((movie: any) => (
                    <Box
                      key={movie.id}
                      layoutId={movie.id + ""}
                      variants={boxHoverVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(movie.id)}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider> */}
          {/* 슬라이더 컴포넌트 */}
          <Slider
            sectionName="Now Playing"
            data={nowPlayingData}
            isLoading={loadingNowPlaying}
          />
          <Slider
            sectionName="Top Rated"
            data={topRatedData}
            isLoading={loadingTopRated}
          />
          <Slider
            sectionName="UpComming"
            data={upCommingData}
            isLoading={loadingUpComming}
          />
          {/* 오버레이 부분(클릭하면 커지는 것) */}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovieContainer
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
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
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovieContainer>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
