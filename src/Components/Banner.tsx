//* 메인 Banner 컴포넌트
import { useQuery } from "react-query";
import { IGetMoviesResult, getNowPlaying } from "../api";
import { makeImagePath } from "../utils";
import styled from "styled-components";

const BannerContainer = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
  font-weight: 600;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

function Banner() {
  const { data } = useQuery<IGetMoviesResult>(["movies"], getNowPlaying);
  // 난수 생성해서 메인 배너 상태 무작위로 바꾸기
  const bannerRandom = Math.floor(Math.random() * 20);
  return (
    <BannerContainer
      bgPhoto={makeImagePath(data?.results[bannerRandom].backdrop_path || "")}
    >
      <Title>{data?.results[bannerRandom].title}</Title>
      <Overview>{data?.results[bannerRandom].overview}</Overview>
    </BannerContainer>
  );
}

export default Banner;
