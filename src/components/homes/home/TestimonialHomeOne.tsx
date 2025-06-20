import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Make sure to import Autoplay along with Pagination
import { Autoplay, Pagination } from 'swiper/modules';
import reviewService, { TopReview } from '../../../services/reviewsService';
import StarRating from '../../../common/StarRating';


// --- STYLE OBJECTS FOR UNIFORM CARD HEIGHTS ---
const slideStyle: React.CSSProperties = {
  height: 'auto',
  display: 'flex',
};
const cardStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
};
const contentStyle: React.CSSProperties = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
};
const textStyle: React.CSSProperties = {
  flexGrow: 1,
};

const TestimonialHomeOne = () => {
  const [reviews, setReviews] = useState<TopReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopReviews = async () => {
      try {
        setLoading(true);
        const data = await reviewService.getTopReviews();
        setReviews(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch top reviews:", err);
        setError("Could not load testimonials. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopReviews();
  }, []);

  if (loading) {
    return <section className="testimonial-section fix section-padding"><p>Loading Testimonials...</p></section>;
  }
  if (error) {
    return <section className="testimonial-section fix section-padding"><p style={{ color: 'red', textAlign: 'center' }}>{error}</p></section>;
  }
  if (!reviews || reviews.length === 0) {
    return <section className="testimonial-section fix section-padding"><p>No testimonials found.</p></section>;
  }

  return (
    <>
      <section className="testimonial-section fix section-padding">
        <div className="container">
          <div className="section-title text-center">
            <h6 className="wow fadeInUp">Students Reviews</h6>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              What Our Students Say About Our <br /> Courses and Instructors
            </h2>
          </div>
          <Swiper
            // 1. ADD AUTOPLAY MODULE HERE
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            speed={2000}
            loop={true}
            // 2. ADD THE AUTOPLAY CONFIGURATION BACK
            autoplay={{
              delay: 3000, // A 3-second delay is good for readability
              disableOnInteraction: false,
            }}
            pagination={{
              el: ".dot",
              clickable: true,
            }}
            breakpoints={{
              1199: { slidesPerView: 2 },
              767: { slidesPerView: 1 },
              0: { slidesPerView: 1 },
            }}
            className="swiper testimonial-slider"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={review._id} className="swiper-slide" style={slideStyle}>
                <div 
                  className={`testimonial-box-items ${index % 2 === 1 ? 'bg-2' : ''}`}
                  style={cardStyle}
                >
                  <div className="testimonial-content" style={contentStyle}>
                    <StarRating rating={review.rating} />
                    <p style={textStyle}>"{review.text}"</p>
                    <div className="client-info">
                      <h4>{review.user.name}</h4>
                      <span>On: {review.course.title}</span>
                    </div>
                  </div>
                  <div className="testimonial-image">
                    <img src={review.user.image} alt={review.user.name} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
            
            <div className="swiper-dot text-center mt-5">
              <div className="dot"></div>
            </div>
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default TestimonialHomeOne;