import React from 'react';
import './ReviewsList.css';
import { Review } from '../../../services/coursService';


interface ReviewsListProps {
  reviews: Review[];
}
const ReviewsList: React.FC<ReviewsListProps> = ( {reviews} ) => {
  return (
    <div className="modern-reviews-list max-h-[300px] overflow-y-auto">
      <h3>Student Feedback</h3>
      
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <i className="far fa-comment-alt"></i>
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div className="review-card\" key={index}>
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    <img 
                      src={review.userImg || "assets/img/courses/instructors-3.png"} 
                      alt={review.userName} 
                    />
                  </div>
                  <div className="reviewer-details">
                    <h4>{review.userName!.replace("|", " ")}</h4>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i 
                          key={star} 
                          className={`${star <= review.rating ? 'fas' : 'far'} fa-star`}
                        ></i>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="review-badge">
                  <span>{getRatingLabel(review.rating)}</span>
                </div>
              </div>
              
              <div className="review-content">
                <p>"{review.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 3.5) return 'Very Good';
  if (rating >= 2.5) return 'Good';
  if (rating >= 1.5) return 'Fair';
  return 'Poor';
}

export default ReviewsList;