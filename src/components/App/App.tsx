import { useState } from 'react'; // useEffect більше не імпортується
import { Toaster, toast } from 'react-hot-toast';
import styles from './App.module.css';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

// import { ReactPaginateProps } from 'react-paginate'; // Цей імпорт більше не потрібен, якщо не використовується явно

// Імпортуємо типи та сервіси
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import type { ApiResponse } from '../../services/movieService'; // Імпортуємо ApiResponse тип

// Імпортуємо компоненти
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Використовуємо useQuery для керування станом запиту
  // Явно вказано дженерик-типи для useQuery: <ApiResponse, Error>
  // Деструктуруємо 'error' для використання в ErrorMessage
  
  const { data, isLoading, isError} = useQuery<ApiResponse, Error>(
    ['movies', query, page], // Ключ запиту, залежить від query та page
     ({ queryKey }: { queryKey: [string, string, number] }) => fetchMovies({ query: queryKey[1] as string, page: queryKey[2] as number }), // Функція, яка виконує запит
    {
      enabled: !!query, // Запит виконується лише якщо query не порожній
      keepPreviousData: true, // Зберігає попередні дані під час переходу між сторінками
      onSuccess: (data: ApiResponse) => { // Явно типізовано 'data' як ApiResponse
        if (data.results.length === 0 && query !== '') {
          toast.error('No movies found for your request.');
        }
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error('An unknown error occurred');
        }
      },
    }
  );

  // Отримуємо дані про фільми та загальну кількість сторінок
  // Використовуємо опціональний ланцюжок для безпечного доступу до data.results та data.total_pages
  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  // Обробник зміни сторінки для ReactPaginate
  const handlePageClick = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleSearch = (newQuery: string) => {
    if (newQuery !== query) {
      setQuery(newQuery);
      setPage(1); // Скидаємо сторінку на першу при новому пошуку
    }
  }

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      <main className={styles.main}>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />} {/* Використовуємо isError для відображення компонента */}

        {!isLoading && !isError && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleMovieSelect} />
        )}

        {/* Пагінація рендериться, якщо є більше 1 сторінки та не завантажуємо/немає помилки */}
        {!isLoading && !isError && totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages} // totalPages вже має тип number
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={handlePageClick}
            forcePage={page - 1} // Встановлює активну сторінку (0-based)
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
      </main>
      
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}