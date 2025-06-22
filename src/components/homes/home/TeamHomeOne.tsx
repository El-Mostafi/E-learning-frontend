import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import instructorsService from '../../../services/instructorsService';
import { Instructor } from '../../../services/interfaces/user.interface';

// --- Swiper Settings ---
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
                setError("Could not load instructors. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTopInstructors();
    }, []);

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
            <style>{`
                .amazing-team-slider .team-box-items {
                    background: #fff;
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(60,60,120,0.12);
                    overflow: hidden;
                    transition: transform 0.3s, box-shadow 0.3s;
                    position: relative;
                    width: 340px;
                    min-height: 420px;
                    max-width: 100%;
                    margin: 0 auto;
                }
                .amazing-team-slider .team-box-items:hover {
                    transform: translateY(-10px) scale(1.03);
                    box-shadow: 0 16px 48px rgba(60,60,120,0.18);
                }
                .amazing-team-slider .team-image {
                    position: relative;
                    overflow: hidden;
                }
                .amazing-team-slider .team-image img {
                    width: 100%;
                    height: 320px;
                    object-fit: cover;
                    border-radius: 0 0 20px 20px;
                    transition: filter 0.3s;
                }
                .amazing-team-slider .team-box-items:hover .team-image img {
                    filter: brightness(0.85) blur(1px);
                }
                .amazing-team-slider .team-content {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background: linear-gradient(0deg, rgba(30,30,60,0.95) 60%, rgba(30,30,60,0.1) 100%);
                    color: #fff;
                    padding: 28px 22px 22px 22px;
                    border-radius: 0 0 20px 20px;
                    transition: background 0.3s;
                }
                .amazing-team-slider .team-content h3 {
                    margin: 0 0 8px 0;
                    font-size: 1.35rem;
                    font-weight: 700;
                }
                .amazing-team-slider .team-content h3 a {
                    color: #fff;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .amazing-team-slider .team-content h3 a:hover {
                    color: #ffd700;
                }
                .amazing-team-slider .team-content p {
                    margin: 0;
                    font-size: 1.08rem;
                    opacity: 0.85;
                }
                .amazing-team-slider .social-profile {
                    position: absolute;
                    top: 22px;
                    right: 22px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    z-index: 2;
                }
                .amazing-team-slider .plus-btn {
                    background: #fff;
                    color: #333;
                    border-radius: 50%;
                    width: 42px;
                    height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    cursor: pointer;
                    margin-bottom: 10px;
                    transition: background 0.2s, color 0.2s;
                }
                .amazing-team-slider .plus-btn:hover {
                    background: #ffd700;
                    color: #222;
                }
                .amazing-team-slider .social-profile ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(-10px);
                    transition: opacity 0.3s, transform 0.3s;
                }
                .amazing-team-slider .team-box-items:hover .social-profile ul {
                    opacity: 1;
                    pointer-events: auto;
                    transform: translateY(0);
                }
                .amazing-team-slider .social-profile ul li a {
                    background: #fff;
                    color: #333;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.08rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    transition: background 0.2s, color 0.2s;
                }
                .amazing-team-slider .social-profile ul li a:hover {
                    background: #ffd700;
                    color: #222;
                }
                @media (max-width: 991px) {
                    .amazing-team-slider .team-box-items {
                        width: 90vw;
                        min-height: 340px;
                    }
                    .amazing-team-slider .team-image img {
                        height: 220px;
                    }
                }
            `}</style>
            <section className="team-section fix amazing-team-slider">
                <Swiper {...setting} className="swiper team-slider">
                    {instructors.map((instructor) => (
                        <SwiperSlide key={instructor._id} className="swiper-slide">
                            <div className="team-box-items">
                                <div className="team-image">
                                    <img src={instructor.profileImg} alt={instructor.userName} />
                                    <div className="team-content">
                                        <h3>
                                            <Link to= "/instructor-details" state={{ instructorId: instructor._id }}>
                                                {instructor.userName}
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