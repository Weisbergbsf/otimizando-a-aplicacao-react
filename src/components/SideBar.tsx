import { memo, useCallback } from "react";
import { api } from "../services/api";
import { Button } from "./Button";

import '../styles/sidebar.scss';
import { useQuery } from "react-query";
interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}
interface SideBarProps {
  selectedGenreId: number;
  buttonClickCallback: (args: any) => void;
}

export function SideBarComponent({
  selectedGenreId,
  buttonClickCallback
}: SideBarProps) {

  

  const handleClickButton = useCallback((id: number) => {
    buttonClickCallback(id);
  }, [])

  const getGenres = async (): Promise<GenreResponseProps[]> => {
    const { data } = await api.get<GenreResponseProps[]>('genres');
    return data
  }

  const { data, isLoading } = useQuery('genres', getGenres);

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <nav className="sidebar">
      <span>Watch<p>Me</p></span>

      <div className="buttons-container">
        {data?.map(genre => (
          <Button
            key={String(genre.id)}
            title={genre.title}
            iconName={genre.name}
            onClick={() => handleClickButton(genre.id)}
            selected={selectedGenreId === genre.id}
          />
        ))}
      </div>
    </nav>
  )
}

export const SideBar = memo(SideBarComponent, (prevProps, nextProps) => {
  return Object.is(prevProps.selectedGenreId, nextProps.selectedGenreId)
}); 