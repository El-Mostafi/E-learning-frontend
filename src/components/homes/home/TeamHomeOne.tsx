import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import instructorsService from '../../../services/instructorsService';
import { Instructor } from '../../../services/interfaces/user.interface';

// Swiper settings remain the same
const setting = {
  modules: [Navigation],
  spaceBetween: 20,
  speed: 1500,
  loop: true,
  navigation: {
    nextEl: ".array-prev",
    prevEl: ".array-next",
  },
  breakpoints: {
      1399: { slidesPerView: 5 },
      1199: { slidesPerView: 4 },
      991: { slidesPerView: 3 },
      767: { slidesPerView: 2 },
      575: { slidesPerView: 2 },
      0: { slidesPerView: 1 },
  },
};

const TeamHomeOne = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopInstructors = async () => {
      try {
        setLoading(true);
        const data = await instructorsService.getTopInstructors();
        setInstructors(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch top instructors:", err);
        setError("Could not load instructors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopInstructors();
  }, []);

  // --- Forceful CSS to ensure uniform image size ---
  // This targets the image more specifically and uses !important
  // to override any conflicting global styles.
  const componentStyles = `
    .team-section .team-image img {
      width: 100%;
      height: 420px !important; /* Force a fixed height */
      object-fit: cover; /* Scale image to fill the container without stretching */
      object-position: center; /* Center the image within its frame */
    }
  `;

  if (loading) {
    return <section className="team-section fix"><p>Loading Instructors...</p></section>;
  }

  if (error) {
    return <section className="team-section fix"><p style={{ color: 'red' }}>{error}</p></section>;
  }
  
  if (!instructors || instructors.length === 0) {
    return <section className="team-section fix"><p>No top instructors found.</p></section>;
  }

  return (
    <>
      {/* This <style> tag injects the forceful CSS rules into the page */}
      <style>{componentStyles}</style>

      <section className="team-section fix">
        <Swiper {...setting} className="swiper team-slider">
          {instructors.map((instructor) => (
            <SwiperSlide key={instructor._id} className="swiper-slide">
              <div className="team-box-items">
                <div className="team-image">
                  {/* No className is needed on the img tag now */}
                  <img
                    src={instructor.profileImg}
                    alt={instructor.userName.replace("|", " ")}
                  />
                  <div className="team-content">
                    <h3>
                      <Link to="/instructor-details" state={{ instructorId: instructor._id }}>
                        {instructor.userName.replace("|", " ")}
                      </Link>
                    </h3>
                    <p>{instructor.expertise || 'Expert Instructor'}</p>
                  </div>
                  <div className="social-profile">
                    <span className="plus-btn">
                      <i className="fas fa-share-alt"></i>
                    </span>
                    <ul>
                      <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                      <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                      <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
};

export default TeamHomeOne;