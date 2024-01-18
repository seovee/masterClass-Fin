import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  getNowPlaying,
  getTopRated,
  getUpcoming,
} from "../api";
import styled from "styled-components";
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";
import { Types } from "../utils";

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

function Home() {
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
  return (
    <Wrapper>
      {totalIsLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* 메인 Banner */}
          <Banner />
          {/* 슬라이더 컴포넌트 */}
          <Slider type={Types.now_playing} />
          <Slider type={Types.popular} />
          <Slider type={Types.top_rated} />
          <Slider type={Types.upcoming} />

          {/* 오버레이(클릭하면 커지는 것) */}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
