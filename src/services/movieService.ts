import axios from 'axios';
import  type { Movie } from '../types/movie';


export interface ApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}


const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;


const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

interface FetchMoviesParams {
  query: string;
}

export const fetchMovies = async ({ query }: FetchMoviesParams): Promise<Movie[]> => {
  if (!TMDB_TOKEN) {
    throw new Error("TMDB token is not set. Please add VITE_TMDB_TOKEN to your .env file.");
  }

  const config = {
    params: {
      query: query,
    },
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  try {
    const response = await axios.get<ApiResponse>(`${BASE_URL}/search/movie`, config);
    return response.data.results;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.status_message || "Failed to fetch movies.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};


export const getImageUrl = (path: string | null, size: 'w500' | 'original'): string => {
  if (!path) {
    return `https://placehold.co/500x750/cccccc/333333?text=No+Image`;
  }
  return `${IMAGE_BASE_URL}${size}${path}`;
};
