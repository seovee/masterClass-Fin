import { useQuery } from "react-query";
import { IGetMoviesResult, getNowPlaying } from "../api";
import styled from "styled-components";
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";
import { Types } from "../utils";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 50px;
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

  const { isLoading } = useQuery<IGetMoviesResult>(
    ["nowPlaying"],
    getNowPlaying
  );

  return (
    <Wrapper>
      {isLoading ? (
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
        </>
      )}
    </Wrapper>
  );
}

export default Home;
