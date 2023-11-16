import React, { useState, useEffect } from 'react';
import { Container} from 'reactstrap';
import './App.css';
import AnimeCard from './components/card';


function Page1({ searchTerm, minRating }) {

  const [animeData, setAnimeData] = useState([]);
  const [filteredAnime, setFilteredAnime] = useState([]);

  useEffect(() => {
    fetchAnimeData();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchTerm, animeData,minRating]);

  async function fetchAnimeData() {
    try {
      const response = await fetch('https://kitsu.io/api/edge/anime?page[limit]=20&page[offset]=5');
      const data = await response.json();
      setAnimeData(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  function filterResults() {
    const filteredAnime = animeData.filter((anime) =>
      anime.attributes.canonicalTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (anime.attributes.averageRating || 0) >= minRating
    );
    setFilteredAnime(filteredAnime);
  }
  

  return (
    <div className='divstyle'>
      <Container>
        
        <div className="resultsContainer">
          {filteredAnime.map((anime) => (
            <AnimeCard anime={anime} key={anime.id} />
          ))}
        </div>
      </Container>
     
    </div>
  );
}

export default Page1;