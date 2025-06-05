import React, { useState } from 'react';
import './ModernReviewForm.css';

interface ReviewFormProps {
  onSubmit: (review: { rating: number; comment: string }) => Promise<void>;
  isSubmitting: boolean;
  statusMessage: string;
  statusType: string;
}

const ModernReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  isSubmitting,
  statusMessage,
  statusType,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      await onSubmit({ rating, comment });
      setComment('');
      setRating(0);
    }
  };

  const getStarClass = (position: number) => {
    const currentRating = hoveredRating !== null ? hoveredRating : rating;
    if (position <= currentRating) {
      return 'star filled';
    }
    return 'star';
  };

  return (
    <div className="modern-review-form-container">
      <h3>Share Your Experience</h3>
      
      <form onSubmit={handleSubmit} className="modern-review-form">
        <div className="rating-container">
          <p>How would you rate this course?</p>
          <div className="stars-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={getStarClass(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(null)}
                onClick={() => setRating(star)}
              >
                <i className="fas fa-star"></i>
              </div>
            ))}
            <span className="rating-text">
              {rating > 0 ? getRatingText(rating) : 'Select a rating'}
            </span>
          </div>
        </div>

        <div className={`comment-container ${focused ? 'focused' : ''}`}>
          <textarea
            placeholder="Tell us about your experience with this course..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-review-btn"
          disabled={isSubmitting || rating === 0 || comment.trim() === ''}
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-circle-notch fa-spin"></i> Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>

      {statusMessage && (
        <div className={`status-message ${statusType}`}>
          <i className={statusType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}></i>
          {statusMessage}
        </div>
      )}
    </div>
  );
};

function getRatingText(rating: number): string {
  switch (rating) {
    case 1: return 'Poor';
    case 2: return 'Fair';
    case 3: return 'Good';
    case 4: return 'Very Good';
    case 5: return 'Excellent';
    default: return '';
  }
}

export default ModernReviewForm;