import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './MovieModal.module.css';
import type { Movie } from '../../types/movie';
import { getImageUrl } from '../../services/movieService';


interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const body = document.body;


export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      body.style.overflow = 'unset'; 
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} aria-label="Close modal" onClick={onClose}>
          &times;
        </button>
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className={styles.image}
        />
        <div className={styles.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
