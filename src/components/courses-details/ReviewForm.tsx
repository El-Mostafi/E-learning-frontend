import React, { useState } from 'react';

interface ReviewFormProps {
  courseId: string;
  onSubmitReview: (review: {
    rating: number;
    comment: string;
  }) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ courseId, onSubmitReview }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Course ID:", courseId);
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      setError('Please provide a comment (minimum 10 characters)');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmitReview({
        rating,
        comment
      });
      setSuccess(true);
      setRating(0);
      setComment('');
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form-container mt-4 mb-5">
      <h4 className="mb-3">Write a Review</h4>
      
      {success && (
        <div className="alert alert-success">
          Your review has been submitted successfully! Thank you for your feedback.
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="rating-container mb-3">
          <div className="d-flex align-items-center">
            <label className="me-3">Your Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fas fa-star ${
                    star <= (hoverRating || rating) ? 'text-warning' : 'text-muted'
                  }`}
                  style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: '0.25rem' }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                ></i>
              ))}
            </div>
          </div>
        </div>
        
        <div className="form-group mb-3">
          <label htmlFor="reviewComment">Your Review:</label>
          <textarea
            id="reviewComment"
            className="form-control"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this course..."
            disabled={isSubmitting}
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="theme-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;