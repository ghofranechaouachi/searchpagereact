import React, { useState, useEffect } from 'react'; // Importation des dépendances de React et des hooks useState et useEffect
import { Container, Input } from 'reactstrap'; // Importation du composant Container et Input de la bibliothèque Reactstrap
import './App.css'; // Importation du fichier CSS spécifique à ce composant
import AnimeCard from './components/card'; // Importation du composant AnimeCard depuis './components/card'
import { Link, useNavigate, Route, Routes } from 'react-router-dom'; // Importation des éléments de la bibliothèque react-router-dom
import Page1 from './page1'; // Importation du composant Page1 depuis './page1'


function App() {
  const navigate = useNavigate(); // Initialisation du hook useNavigate qui permet de naviguer entre les pages
  const [searchTerm, setSearchTerm] = useState(''); // Déclaration de l'état searchTerm et de la fonction setSearchTerm avec la valeur initiale ''
  const [animeData, setAnimeData] = useState([]); // Déclaration de l'état animeData et de la fonction setAnimeData avec la valeur initiale un tableau vide
  const [filteredAnime, setFilteredAnime] = useState([]); // Déclaration de l'état filteredAnime et de la fonction setFilteredAnime avec la valeur initiale un tableau vide
  const [minRating, setMinRating] = useState(0); // Déclaration de l'état minRating et de la fonction setMinRating avec la valeur initiale 0
  const [searchHistory, setSearchHistory] = useState([]); // Déclaration de l'état searchHistory et de la fonction setSearchHistory avec la valeur initiale un tableau vide
  const [showSearchHistory, setShowSearchHistory] = useState(false); // Déclaration de l'état showSearchHistory et de la fonction setShowSearchHistory avec la valeur initiale false


  useEffect(() => {
    fetchAnimeData();
  }, []);
  // Effectue fetchAnimeData() au montage du composant (une seule fois)

  useEffect(() => {
    filterResults();
  }, [searchTerm, animeData, minRating]);
  // Effectue filterResults() lorsque searchTerm, animeData ou minRating changent

  useEffect(() => {
    const storedSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    // Récupère l'historique des recherches depuis le stockage local, ou utilise un tableau vide s'il n'y a pas d'historique
    setSearchHistory(storedSearchHistory);// Met à jour l'état searchHistory avec l'historique récupéré
  }, []);// Effectue cette fonction au montage du composant (une seule fois)

  async function fetchAnimeData() {
    try {
      const response = await fetch(
        'https://kitsu.io/api/edge/anime?page[limit]=18&page[offset]=12062'
      );// Effectue une requête HTTP pour récupérer les données des animes depuis une API
      const data = await response.json();// Convertit la réponse en format JSON
      setAnimeData(data.data);// Met à jour l'état animeData avec les données des animes récupérées

      // Update search history
      if (searchTerm.trim() !== '') {
        const updatedSearchHistory = [...searchHistory, searchTerm];// Ajoute le terme de recherche actuel à l'historique des recherches
        setSearchHistory(updatedSearchHistory);
        // Met à jour l'état searchHistory avec l'historique mis a jour
        localStorage.setItem('searchHistory', JSON.stringify(updatedSearchHistory));
        // Enregistre l'historique des recherches dans le stockage local au format JSON
      }
    } catch (error) {
      console.log(error); // Affiche l'erreur dans la console s'il y a une erreur lors de la récupération des données des animes
    }
  }

  function filterResults() {
    const filteredAnime = animeData.filter(
      (anime) =>
        anime.attributes.canonicalTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (anime.attributes.averageRating || 0) >= minRating
    );// Filtre les animes en fonction du terme de recherche et de la note minimale
    setFilteredAnime(filteredAnime);// Met à jour l'état filteredAnime avec les animes filtrés
  }

  function handleSearchInput(e) {
    setSearchTerm(e.target.value); // Met à jour l'état searchTerm avec la valeur de l'entrée de recherche
    setShowSearchHistory(e.target.value.trim() !== '');// Affiche l'historique des recherches si le terme de recherche n'est pas vide
  }

  function selectSearchHistory(query) {
    setSearchTerm(query);// Met à jour l'état searchTerm avec le terme de recherche sélectionné dans l'historique
    setShowSearchHistory(false);// Masque l'historique des recherches
  }

  function deleteSearchHistory(index) {
    const updatedSearchHistory = [...searchHistory];// Crée une copie de l'historique des recherches
    updatedSearchHistory.splice(index, 1); // Supprime l'élément correspondant à l'index spécifié de l'historique
    setSearchHistory(updatedSearchHistory); // Met à jour l'état searchHistory avec l'historique mis à jour
    localStorage.setItem('searchHistory', JSON.stringify(updatedSearchHistory));// Enregistre l'historique des recherches dans le stockage local au format JSON
  }

 return (
  <div className="divstyle">
    <Container>
    
        <h1>Anime Search Page</h1>
        <Input
          type="text"
          placeholder="Search Anime"
          value={searchTerm}
          onChange={handleSearchInput}
        />

{showSearchHistory && (
            <div className="searchHistoryCard">
              <ul>
                {searchHistory.map((query, index) => (
                  <ol key={index} onClick={() => selectSearchHistory(query)}>
                    {query}
                    <button onClick={() => deleteSearchHistory(index)}>Delete</button>
                  </ol>
                ))} {/* Affiche l'historique des recherches avec la possibilité de sélectionner un terme de recherche ou de le supprimer */}
              </ul>
            </div>
          )}
           <Input
        type="number"
        placeholder="Minimum Rating"
        value={minRating}
        onChange={(e) => setMinRating(parseFloat(e.target.value))}
      />{/* Champ de saisie de la note minimale des animes à afficher */}
        <div className="resultsContainer">
          {filteredAnime.map((anime) => (
            <AnimeCard anime={anime} key={anime.id} />
          ))}
          
        </div>
      
      
  
    </Container>
    <div className="navigation">
      <Routes>
        <Route path="/page1" element={<Page1 searchTerm={searchTerm} minRating={minRating} />} />
      </Routes>{/* Définition des itinéraires de navigation */}
      <ul>
        <li onClick={() => navigate('/page1')}>See More</li>
      </ul> {/* Affiche un bouton pour voir plus de résultats et déclenche la navigation vers la page 1 */}
    </div>
  </div>
);

}

export default App;// Exporte le composant App en tant que composant par défaut