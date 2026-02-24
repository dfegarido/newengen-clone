// ================================
// New Engen Clone - JavaScript
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Announcement Bar ---
    const announcementBar = document.querySelector('.announcement-bar');
    const closeBtn = document.querySelector('.announcement-close');
    const header = document.getElementById('header');

    if (announcementBar) {
        header.classList.add('has-announcement');

        closeBtn.addEventListener('click', () => {
            announcementBar.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            announcementBar.style.transform = 'translateY(-100%)';
            announcementBar.style.opacity = '0';
            header.classList.remove('has-announcement');
            setTimeout(() => {
                announcementBar.style.display = 'none';
            }, 400);
        });
    }

    // --- Header Scroll Effect ---
    let lastScroll = 0;

    const handleScroll = () => {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        }
    );

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Stat Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(element) {
        const text = element.textContent;
        const hasPercent = text.includes('%');
        const hasX = text.includes('x');

        // Handle special format like "3–4x"
        if (text.includes('–') || text.includes('-')) {
            element.style.opacity = '1';
            return;
        }

        const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (isNaN(numericValue)) return;

        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(numericValue * ease);

            let display = current.toString();
            if (hasPercent) display += '%';
            if (hasX) display += 'x';

            element.textContent = display;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = text; // Restore original text
            }
        }

        requestAnimationFrame(update);
    }

    // --- Smooth Scroll for internal links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Parallax Effect for Hero ---
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrollY < heroHeight) {
                const progress = scrollY / heroHeight;
                heroContent.style.opacity = 1 - progress * 0.6;
            }
        }, { passive: true });
    }

    // --- Scroll-driven Accordion (How We're Different) ---
    const liftScrollWrap = document.getElementById('liftAccordionScroll');
    const liftSticky = document.getElementById('liftAccordionSticky');
    const liftItems = document.querySelectorAll('.lift-acc-item');

    if (liftScrollWrap && liftSticky && liftItems.length) {
        const totalItems = liftItems.length;

        // Set CSS variable for count
        document.querySelector('.lift-section').style.setProperty('--acc-count', totalItems);

        // Open first item by default
        liftItems[0].classList.add('is-active');
        let currentActive = 0;

        // Smooth scroll tracking with lerp
        let targetProgress = 0;
        let smoothProgress = 0;
        let liftRafId = null;

        function liftTick() {
            // Lerp toward target for buttery smooth transitions
            smoothProgress += (targetProgress - smoothProgress) * 0.12;

            // Snap when very close
            if (Math.abs(smoothProgress - targetProgress) < 0.001) {
                smoothProgress = targetProgress;
            }

            const activeIndex = Math.min(totalItems - 1, Math.floor(smoothProgress * totalItems));

            if (activeIndex !== currentActive) {
                liftItems[currentActive].classList.remove('is-active');
                liftItems[activeIndex].classList.add('is-active');
                currentActive = activeIndex;
            }

            if (Math.abs(smoothProgress - targetProgress) > 0.0005) {
                liftRafId = requestAnimationFrame(liftTick);
            } else {
                liftRafId = null;
            }
        }

        function updateLiftAccordion() {
            const rect = liftScrollWrap.getBoundingClientRect();
            const scrolled = -rect.top;
            const totalScroll = liftScrollWrap.offsetHeight - window.innerHeight;
            if (totalScroll <= 0) return;

            targetProgress = Math.max(0, Math.min(0.999, scrolled / totalScroll));

            if (!liftRafId) {
                liftRafId = requestAnimationFrame(liftTick);
            }
        }

        window.addEventListener('scroll', updateLiftAccordion, { passive: true });
        window.addEventListener('resize', updateLiftAccordion);
        updateLiftAccordion();
    }

    // --- Clients Logo Grid Navigation ---
    const ctaLogosGrid = document.getElementById('ctaLogosGrid');
    const ctaLogoPrev = document.getElementById('ctaLogoPrev');
    const ctaLogoNext = document.getElementById('ctaLogoNext');

    if (ctaLogosGrid && ctaLogoPrev && ctaLogoNext) {
        const logoCards = ctaLogosGrid.querySelectorAll('.cta-logo-card');
        let ctaPage = 0;
        const getPerPage = () => window.innerWidth >= 769 ? 15 : 6;
        const getTotalPages = () => Math.ceil(logoCards.length / getPerPage());

        function updateCtaLogos() {
            const perPage = getPerPage();
            const totalPages = getTotalPages();
            ctaPage = Math.min(ctaPage, totalPages - 1);

            logoCards.forEach((card, i) => {
                const startIdx = ctaPage * perPage;
                const endIdx = startIdx + perPage;
                if (i >= startIdx && i < endIdx) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        ctaLogoPrev.addEventListener('click', () => {
            if (ctaPage > 0) {
                ctaPage--;
                updateCtaLogos();
            }
        });

        ctaLogoNext.addEventListener('click', () => {
            if (ctaPage < getTotalPages() - 1) {
                ctaPage++;
                updateCtaLogos();
            }
        });

        window.addEventListener('resize', updateCtaLogos);
        updateCtaLogos();
    }

    // --- Newsletter Form ---
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            if (input.value.trim()) {
                const btn = newsletterForm.querySelector('button');
                btn.textContent = 'Subscribed!';
                btn.style.background = '#6c5ce7';
                input.value = '';
                setTimeout(() => {
                    btn.textContent = 'Subscribe';
                    btn.style.background = '';
                }, 2500);
            }
        });
    }

    // --- (Hero gradient effect removed - using solid green bg) ---

    // --- Network Section - Infinite Draggable Carousel ---
    const networkSection = document.getElementById('network');
    const networkSlider = document.getElementById('networkSlider');
    const networkTrack = document.getElementById('networkTrack');
    const networkDragCursor = document.getElementById('networkDragCursor');

    if (networkSlider && networkTrack) {
        const slides = networkTrack.querySelectorAll('.network-slide');
        const slideCount = slides.length;

        // Clone all slides and append for seamless infinite loop
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            networkTrack.appendChild(clone);
        });

        let scrollX = 0;
        let autoScrollSpeed = 0; // no auto-scroll, only drag
        let isDragging = false;
        let dragStartX = 0;
        let dragScrollStart = 0;
        let dragVelocity = 0;
        let lastDragX = 0;
        let animationId = null;
        let currentTilt = 0; // smoothly interpolated tilt angle

        // Calculate total width of original slides
        function getTotalOriginalWidth() {
            let total = 0;
            for (let i = 0; i < slideCount; i++) {
                const slide = networkTrack.children[i];
                const style = getComputedStyle(slide);
                total += slide.offsetWidth + parseFloat(style.marginRight);
            }
            return total;
        }

        function animate() {
            let effectiveVelocity = autoScrollSpeed;

            if (!isDragging) {
                scrollX += autoScrollSpeed + dragVelocity;
                effectiveVelocity = autoScrollSpeed + dragVelocity;
                dragVelocity *= 0.95; // Friction for momentum

                if (Math.abs(dragVelocity) < 0.1) {
                    dragVelocity = 0;
                }
            } else {
                effectiveVelocity = dragVelocity;
            }

            // --- Tilt effect: bow from top based on scroll direction ---
            // Drag left (positive velocity) → tilt left (negative angle)
            // Drag right (negative velocity) → tilt right (positive angle)
            const maxTilt = 8; // max degrees
            const targetTilt = Math.max(-maxTilt, Math.min(maxTilt, -effectiveVelocity * 0.8));

            // Smooth interpolation toward target
            currentTilt += (targetTilt - currentTilt) * 0.08;

            // Apply tilt to all slide figures (transform-origin is top center in CSS)
            const allFigures = networkTrack.querySelectorAll('.network-slide-figure');
            allFigures.forEach(fig => {
                fig.style.transform = `rotate(${currentTilt.toFixed(3)}deg)`;
            });

            const totalWidth = getTotalOriginalWidth();

            // Wrap around for infinite loop
            if (scrollX >= totalWidth) {
                scrollX -= totalWidth;
            }
            if (scrollX < 0) {
                scrollX += totalWidth;
            }

            networkTrack.style.transform = `translate3d(${-scrollX}px, 0, 0)`;
            animationId = requestAnimationFrame(animate);
        }

        // Start animation
        animationId = requestAnimationFrame(animate);

        // --- Drag handling (mouse) ---
        networkSlider.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStartX = e.clientX;
            dragScrollStart = scrollX;
            lastDragX = e.clientX;
            dragVelocity = 0;
            networkSlider.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - dragStartX;
            scrollX = dragScrollStart - dx;

            // Track velocity for momentum
            dragVelocity = lastDragX - e.clientX;
            lastDragX = e.clientX;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                networkSlider.style.cursor = 'grab';
            }
        });

        // --- Drag handling (touch) ---
        networkSlider.addEventListener('touchstart', (e) => {
            isDragging = true;
            dragStartX = e.touches[0].clientX;
            dragScrollStart = scrollX;
            lastDragX = e.touches[0].clientX;
            dragVelocity = 0;
        }, { passive: true });

        networkSlider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const dx = e.touches[0].clientX - dragStartX;
            scrollX = dragScrollStart - dx;
            dragVelocity = lastDragX - e.touches[0].clientX;
            lastDragX = e.touches[0].clientX;
        }, { passive: true });

        networkSlider.addEventListener('touchend', () => {
            isDragging = false;
        });

        // --- Drag cursor follow ---
        if (networkDragCursor && networkSection) {
            networkSection.addEventListener('mouseenter', () => {
                networkDragCursor.style.display = 'block';
                requestAnimationFrame(() => {
                    networkDragCursor.classList.add('is-visible');
                });
            });

            networkSection.addEventListener('mouseleave', () => {
                networkDragCursor.classList.remove('is-visible');
                setTimeout(() => {
                    networkDragCursor.style.display = 'none';
                }, 300);
            });

            networkSection.addEventListener('mousemove', (e) => {
                const rect = networkSection.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                networkDragCursor.style.left = x + 'px';
                networkDragCursor.style.top = y + 'px';
            });
        }
    }

    // --- Offerings / Sticky Card Fan + Scrolling Text ---
    const partnersStickyWrap = document.getElementById('partnersStickyWrap');
    const partnersCardStack = document.getElementById('partnersCardStack');
    const partnersTextCol = document.getElementById('partnersTextCol');
    const partnersTextTrack = document.getElementById('partnersTextTrack');

    if (partnersStickyWrap && partnersCardStack && partnersTextCol && partnersTextTrack) {
        const cards = partnersCardStack.querySelectorAll('.partners-card');
        const textItems = partnersTextTrack.querySelectorAll('.partners-text-item');
        const totalCards = cards.length;
        // 2 text items per card step
        const textsPerCard = 2;
        const totalSteps = Math.ceil(textItems.length / textsPerCard);
        let vh = window.innerHeight;

        const setHeight = () => {
            vh = window.innerHeight;
            partnersStickyWrap.style.height = `${(totalSteps + 2) * 80}vh`;
        };
        setHeight();

        // Card fan-out values
        const maxX = 40;
        const maxY = 800;
        const maxRot = 10;

        // Precompute item heights for smooth offset interpolation
        let itemHeights = [];
        const cacheHeights = () => {
            itemHeights = Array.from(textItems).map(item => item.offsetHeight);
        };
        // Initial cache (items may be hidden, so we temporarily show them)
        textItems.forEach(item => { item.style.visibility = 'hidden'; item.classList.add('is-visible'); });
        cacheHeights();
        textItems.forEach(item => { item.style.visibility = ''; item.classList.remove('is-visible'); });

        function updatePartnersFan() {
            const wrapRect = partnersStickyWrap.getBoundingClientRect();
            const scrolled = -wrapRect.top;
            const totalScroll = partnersStickyWrap.offsetHeight - vh;

            if (totalScroll <= 0) return;

            const baseProgress = Math.max(0, Math.min(1, scrolled / totalScroll));
            const perStep = 1 / totalSteps;
            // Start with first card + first 2 texts already visible
            const progress = baseProgress * (1 - 0.5 * perStep) + 0.5 * perStep;

            // Smooth step value (not floored) for interpolation
            const smoothStep = Math.max(0, Math.min(totalSteps - 1, (progress / perStep) - 0.5));
            const currentStep = Math.min(totalSteps - 1, Math.floor(smoothStep));
            const stepFraction = smoothStep - currentStep; // 0–1 within current step

            // --- Cards: 1 card per step, smooth fan ---
            cards.forEach((card, i) => {
                const inner = card.querySelector('.partners-card-inner');

                if (i >= totalSteps) {
                    card.style.transform = `translate(${maxX}%, 0%) translate3d(0px, ${maxY}px, 0px) rotate(${maxRot}deg)`;
                    if (inner) inner.style.opacity = '0.25';
                    return;
                }

                const raw = (progress - i * perStep) / perStep;
                const clamped = Math.max(-1, Math.min(2, raw));

                let tx, ty, rot, innerOpacity;

                if (clamped <= 0) {
                    const waitFactor = Math.min(1, Math.abs(clamped) * 0.5 + (totalSteps - i) * 0.15);
                    tx = maxX * Math.min(1, waitFactor);
                    ty = maxY * Math.min(1, waitFactor);
                    rot = maxRot * Math.min(1, waitFactor);
                    innerOpacity = 0.25;
                } else if (clamped <= 1) {
                    const fanOut = clamped;
                    tx = maxX * (1 - fanOut * 2);
                    ty = maxY * (1 - fanOut * 2);
                    rot = maxRot * (1 - Math.abs(fanOut - 0.5) * 1.5);
                    innerOpacity = fanOut < 0.5
                        ? 0.25 + fanOut * 1.5
                        : Math.max(0.25, 1 - (fanOut - 0.5) * 1.5);
                } else {
                    tx = -maxX;
                    ty = -maxY;
                    rot = 1;
                    innerOpacity = 0.25;
                }

                card.style.transform = `translate(${tx}%, 0%) translate3d(0px, ${ty}px, 0px) rotate(${rot}deg)`;
                if (inner) inner.style.opacity = String(innerOpacity);
            });

            // --- Text: scroll previous pair up, new pair takes their position ---
            const activeStart = currentStep * textsPerCard;
            const activeEnd = Math.min(textItems.length, activeStart + textsPerCard);

            // All text items are always in the DOM flow; we show them all but
            // grey out non-active ones
            textItems.forEach((item, i) => {
                item.classList.add('is-visible');
                item.style.opacity = '';
                item.style.transform = '';

                if (i >= activeStart && i < activeEnd) {
                    // Current active pair — full brightness
                    item.classList.remove('is-inactive');
                } else {
                    // Previous or future — greyed out
                    item.classList.add('is-inactive');
                }
            });

            // Smooth track scroll — scroll so current pair is at the top of the text area
            // The track translateY moves up by the cumulative height of all items before the active pair
            if (textItems.length > 0) {
                // Target offset: scroll to show currentStep's pair at top
                let targetOffset = 0;
                for (let j = 0; j < activeStart && j < itemHeights.length; j++) {
                    targetOffset += itemHeights[j];
                }

                // Next step offset for smooth interpolation
                let nextOffset = targetOffset;
                const nextStart = Math.min(textItems.length, activeEnd);
                for (let j = activeStart; j < nextStart && j < itemHeights.length; j++) {
                    nextOffset += itemHeights[j];
                }

                // Interpolate between current and next position using stepFraction
                const smoothOffset = targetOffset + (nextOffset - targetOffset) * Math.max(0, (stepFraction - 0.5) * 2);
                partnersTextTrack.style.transform = `translateY(-${smoothOffset}px)`;
            }
        }

        window.addEventListener('scroll', updatePartnersFan, { passive: true });
        window.addEventListener('resize', setHeight);
        updatePartnersFan();
    }

    // --- Publisher Carousel (2 images, 9 buttons) ---
    const carouselSection = document.getElementById('publisherCarousel');
    if (carouselSection) {
        const slides = carouselSection.querySelectorAll('.carousel-slide');
        const buttons = carouselSection.querySelectorAll('.carousel-btn');
        const TIMER_DURATION = 4000; // 4 seconds per publisher
        const totalButtons = buttons.length; // 9 publishers
        const totalSlides = slides.length;   // 2 images
        let currentBtnIndex = 0;
        let currentSlideIndex = 0;
        let autoPlayTimer = null;
        let isTransitioning = false;

        // Set CSS variable for progress bar timing
        carouselSection.style.setProperty('--carousel-timer', `${TIMER_DURATION}ms`);

        // Set data-text on progress bars for the text mask effect
        buttons.forEach(btn => {
            const text = btn.querySelector('.carousel-btn-text').textContent;
            const progress = btn.querySelector('.carousel-btn-progress');
            if (progress) {
                progress.setAttribute('data-text', text);
            }
        });

        // Initialize: show first slide, first button active
        if (slides.length > 0) {
            slides[0].classList.add('is-active');
        }

        function swipeToSlide(nextSlideIndex) {
            if (nextSlideIndex === currentSlideIndex) return;

            const currentSlide = slides[currentSlideIndex];
            const nextSlide = slides[nextSlideIndex];

            isTransitioning = true;

            // Place the next slide underneath, visible and ready
            nextSlide.classList.add('is-entering');

            // Current slide sits on top, about to swipe left
            currentSlide.classList.remove('is-active');
            currentSlide.classList.add('is-exiting');

            // Trigger the swipe-out to the left (behind the left column)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    currentSlide.classList.add('swipe-out');
                });
            });

            // After transition, clean up
            setTimeout(() => {
                currentSlide.classList.remove('is-exiting', 'swipe-out');
                nextSlide.classList.remove('is-entering');
                nextSlide.classList.add('is-active');

                currentSlideIndex = nextSlideIndex;
                isTransitioning = false;
            }, 450);
        }

        function goToButton(nextBtnIndex) {
            if (isTransitioning || nextBtnIndex === currentBtnIndex) return;

            // Reset all buttons
            buttons.forEach(btn => {
                btn.classList.remove('is-active');
                const progress = btn.querySelector('.carousel-btn-progress');
                if (progress) {
                    progress.style.animation = 'none';
                    progress.offsetHeight; // force reflow
                    progress.style.animation = '';
                }
            });

            // Determine which of the 2 slides to show
            // Alternate between slide 0 and slide 1 on each button change
            const nextSlideIndex = (currentSlideIndex === 0) ? 1 : 0;

            // Swipe to the other image
            swipeToSlide(nextSlideIndex);

            currentBtnIndex = nextBtnIndex;

            // Activate the target button for progress bar
            buttons[nextBtnIndex].classList.add('is-active');
        }

        function advance() {
            const next = (currentBtnIndex + 1) % totalButtons;
            goToButton(next);
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(advance, TIMER_DURATION);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        // Button click handlers
        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index, 10);
                stopAutoPlay();
                goToButton(index);
                setTimeout(startAutoPlay, TIMER_DURATION);
            });
        });

        // Infinite auto-play — never pauses
        startAutoPlay();
    }
});

