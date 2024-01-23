import { useQuery } from "react-query";
import { IGetMoviesResult, getNowPlaying } from "../api";
import { makeImagePath } from "../utils";
import styled from "styled-components";
import { useEffect, useState } from "react";

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
  @media screen and (max-width: 1024px) {
    font-size: 40px;
  }
`;

const Overview = styled.p`
  font-size: 24px;
  width: 50%;
  @media screen and (max-width: 1024px) {
    font-size: 20px;
  }
`;

function Banner() {
  const [banner, setBanner] = useState(0);
  const { data } = useQuery<IGetMoviesResult>(["movies"], getNowPlaying);

  useEffect(() => {
    // 난수 생성해서 메인 배너 상태 무작위로 바꾸기
    const bannerRandom = Math.floor(Math.random() * 20);
    setBanner(bannerRandom);
  }, []);

  return (
    <BannerContainer
      bgPhoto={makeImagePath(data?.results[banner].backdrop_path || "")}
    >
      <Title>{data?.results[banner].title}</Title>
      <Overview>
        {data?.results[banner].overview || "제공하는 줄거리가 없습니다."}
      </Overview>
    </BannerContainer>
  );
}

export default Banner;
