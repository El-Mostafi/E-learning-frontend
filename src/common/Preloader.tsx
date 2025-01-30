import { useState, useEffect } from "react";

export default function Preloader() {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		// Set a timer to hide the preloader after 10 seconds
		const timer = setTimeout(() => {
			setIsVisible(false);
		}, 3000);

		// Clean up the timer when the component is unmounted
		return () => clearTimeout(timer);
	}, []);

	if (!isVisible) return null;

	return (
		<>
			{/* <div className="preloader">
				<div className="book-style">
					<div className="inner">
						<div className="left"></div>
						<div className="middle"></div>
						<div className="right"></div>
					</div>
					<ul>
						{Array(18)
							.fill(null)
							.map((_, index) => (
								<li key={index}></li>
							))}
					</ul>
				</div>
			</div> */}
			{/* {isVisible && (
				<div className="loader-wrap">
					<div className="preloader">
						<div className="preloader-close">x</div>
						<div id="handle-preloader" className="handle-preloader">
							<div className="animation-preloader">
								<div className="spinner"></div>
								<div className="txt-loading">
									<span data-text-preloader="g" className="letters-loading">
										g
									</span>
									<span data-text-preloader="a" className="letters-loading">
										a
									</span>
									<span data-text-preloader="r" className="letters-loading">
										r
									</span>
									<span data-text-preloader="d" className="letters-loading">
										d
									</span>
									<span data-text-preloader="n" className="letters-loading">
										n
									</span>
									<span data-text-preloader="m" className="letters-loading">
										m
									</span>
									<span data-text-preloader="a" className="letters-loading">
										a
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)} */}

      {isVisible && 
			<div id="preloader" className="preloader">
				<div className="animation-preloader">
					<div className="edu-preloader-icon">
						<img src="assets/img/preloader.gif" alt="" />
					</div>
					<div className="txt-loading">
						<span data-text-preloader="E" className="letters-loading">
							E
						</span>
						<span data-text-preloader="D" className="letters-loading">
							D
						</span>
						<span data-text-preloader="U" className="letters-loading">
							U
						</span>
						<span data-text-preloader="S" className="letters-loading">
							S
						</span>
						<span data-text-preloader="P" className="letters-loading">
							P
						</span>
						<span data-text-preloader="A" className="letters-loading">
							A
						</span>
						<span data-text-preloader="C" className="letters-loading">
							C
						</span>
						<span data-text-preloader="E" className="letters-loading">
							E
						</span>
					</div>
					<p className="text-center">Loading</p>
				</div>
				<div className="loader">
					<div className="row">
						<div className="col-3 loader-section section-left">
							<div className="bg"></div>
						</div>
						<div className="col-3 loader-section section-left">
							<div className="bg"></div>
						</div>
						<div className="col-3 loader-section section-right">
							<div className="bg"></div>
						</div>
						<div className="col-3 loader-section section-right">
							<div className="bg"></div>
						</div>
					</div>
				</div>
			</div>
      
      }
		</>
	);
}
