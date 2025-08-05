
import styles from './MovieGrid.module.css';
import type { Movie } from '../../types/movie';
import { getImageUrl } from '../../services/movieService';


interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}


export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <ul className={styles.grid}>
      {movies.map(movie => (
        <li key={movie.id} onClick={() => onSelect(movie)}>
          <div className={styles.card}>
            <img
              className={styles.image}
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              loading="lazy"
            />
            <h2 className={styles.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}



