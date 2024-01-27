import { Types } from "./utils";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: [number, number, number, number];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

// 장르별 영화 검색
export function getMovies(type: Types) {
  return fetch(
    `${BASE_PATH}/movie/${type}?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}
// TODO: 한글화 안되어있는 것 예외처리 필요 ko-KR

// 영화 상세 검색
export function getMovieDetail(movieId: number) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}

// 영화 비디오 검색
export function getMovieVideo(movieId: number) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}

export function getNowPlaying() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}
