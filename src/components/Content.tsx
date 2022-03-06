import { useQuery } from "react-query";
import { Grid, GridCellRenderer } from "react-virtualized";
import { api } from "../services/api";
import { Header } from "./Header";
import { MovieCard } from "./MovieCard";

import '../styles/content.scss';

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

type MovieProps = {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}
interface ContentProps {
  selectedGenreId: number;
}
//source example: https://codesandbox.io/s/m70j8k0lqp?file=/src/Table.js:201-213
const generateData = (movies: MovieProps[]) => {
  const rows: Array<MovieProps[]> = [];
  const collums = 3
  let index = 0

  for (let i = 0; i < Math.ceil(movies.length / collums); i++) {
    rows[i] = [];

    for (let j = 0; j < collums; j++) {

      if (movies[index] !== undefined) {
        rows[i].push(movies[index]);
        index++
      }
    }
  }

  return rows; // [Array[{},{},{}], Array[,{}, {}]]
}

export function Content({ selectedGenreId }: ContentProps) {
  const getGenres = async (selectedGenreId: number): Promise<GenreResponseProps> => {
    const { data } = await api.get(`genres/${selectedGenreId}`);
    return data
  }

  const getMovies = async (selectedGenreId: number): Promise<any> => {
    const { data } = await api.get(`movies/?Genre_id=${selectedGenreId}`);
    return generateData(data);
  }

  const genre = useQuery(['genres', selectedGenreId], () => getGenres(selectedGenreId), { staleTime: 1000 * 60 * 10 });
  const movies = useQuery(['movies', selectedGenreId], () => getMovies(selectedGenreId), { staleTime: 1000 * 60 * 10 });

  const cellRenderer: GridCellRenderer = ({ rowIndex, columnIndex, key, style }) => {
    const movie = movies.data[rowIndex][columnIndex]
    
    if (movie) {
      return (
        <div key={key} style={style} className="movies-list">
          <MovieCard movie={movie} />
        </div>
      );
    }
  }

  if (movies.isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="container">
      <Header title={genre.data?.title} />

      <main>
          <Grid
            columnCount={3}
            rowCount={movies.data.length}
            width={840}
            height={770}
            rowHeight={400}
            columnWidth={304}
            cellRenderer={cellRenderer}
            style={{ overflow: 'hidden' }}
          />
      </main>
    </div>
  )
}