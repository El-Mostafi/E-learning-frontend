import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // Swiper 9+ requires modules to be imported and used
import instructorsService from '../../../services/instructorsService';
import { Instructor } from '../../../services/interfaces/user.interface';



// --- Swiper Settings ---
// Note: It's good practice to include Navigation module for it to work
const setting = {
  modules: [Navigation], // Add the Navigation module here
  spaceBetween: 20, // A little space is often better than 0
  speed: 1500,
  loop: true,
  navigation: {
    nextEl: ".array-prev", // Check your HTML for these selectors
    prevEl: ".array-next", // Check your HTML for these selectors
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
  // --- State Management ---
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchTopInstructors = async () => {
      try {
        setLoading(true);
        const data = await instructorsService.getTopInstructors();
        setInstructors(data);
        setError(null);
      } catch (err) {
        console.log(err);
        // console.error("Failed to fetch top instructors:", err);
        // setError("Could not load instructors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopInstructors();
  }, []); // The empty array [] ensures this effect runs only once when the component mounts

  // --- Conditional Rendering ---
  if (loading) {
    // You can replace this with a more sophisticated skeleton loader
    return <section className="team-section fix"><p>Loading Instructors...</p></section>;
  }

  if (error) {
    return <section className="team-section fix"><p style={{ color: 'red' }}>{error}</p></section>;
  }
  
  if (!instructors || instructors.length === 0) {
    return <section className="team-section fix"><p>No top instructors found.</p></section>;
  }

  // --- Dynamic Rendering ---
  return (
    <>
      <section className="team-section fix">
        {/* You should have these buttons somewhere in your parent component's HTML */}
        {/* <div className="array-prev"><i className="fal fa-arrow-left"></i></div> */}
        {/* <div className="array-next"><i className="fal fa-arrow-right"></i></div> */}
        
        <Swiper {...setting} className="swiper team-slider">
          {instructors.map((instructor) => (
            <SwiperSlide key={instructor._id} className="swiper-slide">
              <div className="team-box-items">
                <div className="team-image">
                  <img src={instructor.profileImg} alt={instructor.userName} />
                  <div className="team-content">
                    <h3>
                      {/* Make the link dynamic to the specific instructor's detail page */}
                      <Link to="/instructor-details" state={{ instructorId: instructor._id }}>
                        {instructor.userName}
                      </Link>
                    </h3>
                    {/* Use the expertise or biography from the fetched data */}
                    <p>{instructor.expertise || 'Expert Instructor'}</p>
                  </div>
                  <div className="social-profile">
                    <span className="plus-btn">
                      <i className="fas fa-share-alt"></i>
                    </span>
                    {/* If you have social links in your API, you can make these dynamic too */}
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