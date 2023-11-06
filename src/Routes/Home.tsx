import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  getNowPlaying,
  getTopRated,
  getUpcoming,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
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
      ["nowPlaying"],
      getNowPlaying
    );
    const topRated = useQuery<IGetMoviesResult>(["topRated"], getTopRated);
    const upComing = useQuery<IGetMoviesResult>(["upcoming"], getUpcoming);

    return [nowPlaying, topRated, upComing];
  };
  // 멀티플 Query 배열
  const [
    { isLoading: loadingNowPlaying, data: nowPlayingData },
    { isLoading: loadingTopRated, data: topRatedData },
    { isLoading: loadingUpComing, data: upComingData },
  ] = useMultipleQuery();
  const totalIsLoading =
    loadingNowPlaying || loadingTopRated || loadingUpComing;

  // 영화 상세정보 보기
  // const onBoxClicked = (movieId: number) => {
  //   history.push(`/movies/${movieId}`);
  // };
  // // 영화 상세정보 빠져나오기
  // const onOverlayClick = () => history.push("/");
  // const clickedMovie =
  //   bigMovieMatch?.params.movieId &&
  //   nowPlayingData?.results.find(
  //     (movie: any) => movie.id === +bigMovieMatch.params.movieId
  //   );
  return (
    <Wrapper>
      {totalIsLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* 메인 Banner */}
          <Banner />
          {/* 슬라이더 컴포넌트 */}
          <Slider sectionName="Now Playing" data={nowPlayingData} />
          <Slider sectionName="Top Rated" data={topRatedData} />
          <Slider sectionName="Upcoming" data={upComingData} />
          {/* 오버레이(클릭하면 커지는 것) */}
          {/* <AnimatePresence>
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
          </AnimatePresence> */}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
