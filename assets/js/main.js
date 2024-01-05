document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	/**
	 * Easy selector helper function
	 */
	const select = (el, all = false) => {
		el = el.trim();
		if (all) {
			return [...document.querySelectorAll(el)];
		} else {
			return document.querySelector(el);
		}
	};

	/**
	 * Easy event listener function
	 */
	const on = (type, el, listener, all = false) => {
		if (all) {
			select(el, all).forEach((e) => e.addEventListener(type, listener));
		} else {
			select(el, all).addEventListener(type, listener);
		}
	};

	/**
	 * Easy on scroll event listener
	 */
	const onscroll = (el, listener) => {
		el.addEventListener('scroll', listener);
	};

	/**
	 * Navbar links active state on scroll
	 */
	let navbarlinks = select('#navbar .scrollto', true);
	const navbarlinksActive = () => {
		let position = window.scrollY + 200;
		navbarlinks.forEach((navbarlink) => {
			if (!navbarlink.hash) return;
			let section = select(navbarlink.hash);
			if (!section) return;
			if (
				position >= section.offsetTop &&
				position <= section.offsetTop + section.offsetHeight
			) {
				navbarlink.classList.add('active');
			} else {
				navbarlink.classList.remove('active');
			}
		});
	};
	window.addEventListener('load', navbarlinksActive);
	onscroll(document, navbarlinksActive);

	/**
	 * Scrolls to an element with header offset
	 */
	const scrollto = (el) => {
		let header = select('#header');
		let offset = header.offsetHeight;

		if (!header.classList.contains('header-scrolled')) {
			offset -= 10;
		}

		let elementPos = select(el).offsetTop;
		window.scrollTo({
			top: elementPos - offset,
			behavior: 'smooth',
		});
	};

	/**
	 * Toggle .header-scrolled class to #header when page is scrolled
	 */
	let selectHeader = select('#header');
	if (selectHeader) {
		const headerScrolled = () => {
			if (window.scrollY > 100) {
				selectHeader.classList.add('header-scrolled');
			} else {
				selectHeader.classList.remove('header-scrolled');
			}
		};
		window.addEventListener('load', headerScrolled);
		onscroll(document, headerScrolled);
	}

	/**
	 * Mobile nav toggle
	 */
	on('click', '.mobile-nav-toggle', function (e) {
		select('#navbar').classList.toggle('navbar-mobile');
		this.classList.toggle('bi-list');
		this.classList.toggle('bi-x');
	});

	/**
	 * Scroll with ofset on links with a class name .scrollto
	 */
	on(
		'click',
		'.scrollto',
		function (e) {
			if (select(this.hash)) {
				e.preventDefault();

				let navbar = select('#navbar');
				if (navbar.classList.contains('navbar-mobile')) {
					navbar.classList.remove('navbar-mobile');
					let navbarToggle = select('.mobile-nav-toggle');
					navbarToggle.classList.toggle('bi-list');
					navbarToggle.classList.toggle('bi-x');
				}
				scrollto(this.hash);
			}
		},
		true
	);

	/**
	 * Scroll with ofset on page load with hash links in the url
	 */
	window.addEventListener('load', () => {
		if (window.location.hash) {
			if (select(window.location.hash)) {
				scrollto(window.location.hash);
			}
		}
	});

	/**
	 * Preloader
	 */
	let preloader = select('#preloader');
	if (preloader) {
		window.addEventListener('load', () => {
			setTimeout(() => {
				preloader.remove();
			}, 1000);
		});
	}

	/**
	 * Intro Carousel
	 */
	new Swiper('.intro', {
		speed: 600,
		loop: true,
		autoplay: {
			delay: 4000,
			disableOnInteraction: false,
		},
		slidesPerView: 'auto',
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: true,
		},
	});

	/**
	 * Init swiper sliders
	 */
	function initSwiper() {
		document.querySelectorAll('.swiper').forEach(function (swiper) {
			let configElement = swiper.querySelector('.swiper-config');
			if (configElement) {
				let config = JSON.parse(configElement.innerHTML.trim());
				new Swiper(swiper, config);
			}
		});
	}
	window.addEventListener('load', initSwiper);

	/**
	 * Initiate glightbox
	 */
	const glightbox = GLightbox({
		selector: '.glightbox',
	});

	/**
	 * Destinations isotope and filter
	 */
	let destinationIsotope = document.querySelector('.destinations-isotope');

	if (destinationIsotope) {
		let destinationFilter = destinationIsotope.getAttribute(
			'data-destinations-filter'
		)
			? destinationIsotope.getAttribute('data-destinations-filter')
			: '*';
		let destinationLayout = destinationIsotope.getAttribute(
			'data-destinations-layout'
		)
			? destinationIsotope.getAttribute('data-destinations-layout')
			: 'masonry';
		let destinationSort = destinationIsotope.getAttribute(
			'data-destinations-sort'
		)
			? destinationIsotope.getAttribute('data-destinations-sort')
			: 'original-order';

		window.addEventListener('load', () => {
			let destinationsIsotope = new Isotope(
				document.querySelector('.destinations-container'),
				{
					itemSelector: '.destinations-item',
					layoutMode: destinationLayout,
					filter: destinationFilter,
					sortBy: destinationSort,
				}
			);

			let menuFilters = document.querySelectorAll(
				'.destinations-isotope .destinations-flters li'
			);
			menuFilters.forEach(function (el) {
				el.addEventListener(
					'click',
					function () {
						document
							.querySelector(
								'.destinations-isotope .destinations-flters .filter-active'
							)
							.classList.remove('filter-active');
						this.classList.add('filter-active');
						destinationsIsotope.arrange({
							filter: this.getAttribute('data-filter'),
						});
						if (typeof aos_init === 'function') {
							aos_init();
						}
					},
					false
				);
			});
		});
	}

	/**
	 * Animation on scroll
	 */
	function aos_init() {
		AOS.init({
			duration: 1000,
			easing: 'ease-in-out',
			once: true,
			mirror: false,
		});
	}
	window.addEventListener('load', () => {
		aos_init();
	});
});
