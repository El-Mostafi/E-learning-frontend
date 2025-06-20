import React from 'react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5 }) => {
  return (
    <div className="star">
      {Array.from({ length: maxStars }).map((_, index) => (
        <i
          key={index}
          className={`fas fa-star ${index < rating ? '' : 'empty'}`}
          // Add a style for empty stars if your CSS doesn't handle it
          style={index >= rating ? { color: '#e0e0e0' } : {}}
        ></i>
      ))}
    </div>
  );
};

export default StarRating;