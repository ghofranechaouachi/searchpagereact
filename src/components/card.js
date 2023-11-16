import React, { useState } from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText } from 'reactstrap';
import '../App.css';

export default function AnimeCard({ anime }) {
  const MAX_DESCRIPTION_LENGTH = 200; // Maximum number of characters for the description
  const [showFullDescription, setShowFullDescription] = useState(false);

  let description = anime.attributes.description;
  if (!showFullDescription && description.length > MAX_DESCRIPTION_LENGTH) {
    description = description.substring(0, MAX_DESCRIPTION_LENGTH) + '...';
  }

  // Check if rating is null and set it to 0.0%
  const rating = anime.attributes.averageRating || '0.0';

  // Check if age rating is null and add a text for all age ratings
  const ageRating = anime.attributes.ageRatingGuide || 'All Ages';

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <Card className="animeCard" key={anime.id}>
      <CardImg top src={anime.attributes.posterImage.small} alt={anime.attributes.canonicalTitle} />
      <CardBody>
        <CardTitle><strong>{anime.attributes.canonicalTitle}</strong></CardTitle>
        <CardText>
          <strong>Date de création:</strong> {anime.attributes.startDate}<br />
          <strong>Rating:</strong> {rating}%<br />
          <strong>Age Rating:</strong> {ageRating}<br />
          {ageRating === 'All Ages' }
          <br />
          {description}
          {description.length > MAX_DESCRIPTION_LENGTH && (
            <span className="seeMoreLink" onClick={toggleDescription}>
              See More
            </span>
          )}
        </CardText>
      </CardBody>
    </Card>
  );
}
