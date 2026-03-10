function submitMail(){
let mail = {
title: document.getElementById("title").value,
name: document.getElementById("name").value,
message: document.getElementById("message").value,
email: document.getElementById("email").value
}
emailjs.send("service_cajwo1c","template_3qv43gg", mail).then(alert("Message Sent!"));
}

// Project Modal & Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Project Swiper
    const projectSwiper = new Swiper('.projectSwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        grabCursor: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
    });

    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('closeModal');
    const carouselWrapper = document.getElementById('carouselImages');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const visitSiteBtn = document.getElementById('visitSiteBtn');
    
    let currentSlide = 0;
    let totalSlides = 0;
    let autoSlideInterval;

    // Open modal when clicking View Project button
    document.querySelectorAll('.view-project-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.project-card');
            openModal(card);
        });
    });

    function openModal(card) {
        const title = card.dataset.title;
        const description = card.dataset.description;
        const images = JSON.parse(card.dataset.images);
        const url = card.dataset.url;

        modalTitle.textContent = title;
        modalDescription.textContent = description;
        visitSiteBtn.href = url;

        // Clear previous carousel content
        carouselWrapper.innerHTML = '';
        indicatorsContainer.innerHTML = '';

        // Create slides
        images.forEach((imgSrc, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `<img src="${imgSrc}" alt="${title} - Image ${index + 1}">`;
            carouselWrapper.appendChild(slide);

            // Create indicator
            const indicator = document.createElement('button');
            indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        totalSlides = images.length;
        currentSlide = 0;
        updateCarousel();

        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Start auto-slide
        startAutoSlide();
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        stopAutoSlide();
    }

    function updateCarousel() {
        carouselWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update indicators
        document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
        resetAutoSlide();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    prevBtn.addEventListener('click', function() {
        prevSlide();
        resetAutoSlide();
    });

    nextBtn.addEventListener('click', function() {
        nextSlide();
        resetAutoSlide();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('hidden')) return;
        
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoSlide();
        }
    });
});
