// System Dark Mode Detection
const htmlElement = document.documentElement;

// Check if user's system is set to dark mode
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Initial setup
function setTheme(e) {
    if (e.matches) {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
    }
}

// Set theme on load
setTheme(prefersDarkScheme);

// Listen for system dark mode changes
prefersDarkScheme.addListener(setTheme);

// Reveal animations when scrolling
function reveal() {
    const reveals = document.querySelectorAll('[class*="reveal-"]');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
reveal(); // Initial check

// Enhanced smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 60;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced scroll to top button
const scrollToTopBtn = document.getElementById('scrollToTop');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 300) {
        scrollToTopBtn.classList.add('visible');
        
        // Hide when scrolling down
        if (scrollTop > lastScrollTop) {
            scrollToTopBtn.style.opacity = '0';
        } else {
            scrollToTopBtn.style.opacity = '1';
        }
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
    
    lastScrollTop = scrollTop;
});

// Resources Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Page Loading Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    loader.classList.add('fade-out');
});

// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.setProperty('--scroll', `${scrollPercent}%`);
});

// Enhanced Lightbox Gallery
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-image');
const closeBtn = document.querySelector('.close-lightbox');
const prevBtn = document.querySelector('.lightbox-prev');
const nextBtn = document.querySelector('.lightbox-next');
const counter = document.querySelector('.lightbox-counter');
let currentIndex = 0;
let portfolioItems;

function openLightbox(item) {
    portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
    currentIndex = portfolioItems.indexOf(item);
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateLightboxImage() {
    const currentItem = portfolioItems[currentIndex];
    const img = currentItem.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    counter.textContent = `${currentIndex + 1} / ${portfolioItems.length}`;
}

function nextImage() {
    currentIndex = (currentIndex + 1) % portfolioItems.length;
    updateLightboxImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + portfolioItems.length) % portfolioItems.length;
    updateLightboxImage();
}

// Event Listeners
closeBtn?.addEventListener('click', closeLightbox);
nextBtn?.addEventListener('click', nextImage);
prevBtn?.addEventListener('click', prevImage);

// Close on background click
lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Performance-focused image loading
function loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    
    const tempImage = new Image();
    tempImage.src = src;
    tempImage.onload = () => {
        img.src = src;
        img.classList.add('loaded');
    };
}

// Add text reveal animation to sections
document.querySelectorAll('.section-title, .hero-content *').forEach(element => {
    element.classList.add('text-reveal');
    // Add slight delay between elements
    element.style.animationDelay = Math.random() * 0.3 + 's';
});

// Update image loading to use the new performance-focused system
const images = document.querySelectorAll('img[data-src]');
const imageOptions = {
    threshold: 0,
    rootMargin: '50px'
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadImage(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, imageOptions);

images.forEach(img => {
    // Add loading="lazy" attribute for native lazy loading
    img.setAttribute('loading', 'lazy');
    imageObserver.observe(img);
});

// Blog posts data
const blogPosts = [
    {
        id: 'virtual-staging-benefits',
        title: 'The Power of Virtual Staging in Real Estate Photography',
        date: '2024-03-17',
        url: 'posts/virtual-staging-benefits.html',
        image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87',
        category: 'Virtual Staging',
        description: 'Discover how virtual staging can transform empty spaces and increase property appeal.'
    },
    {
        id: 'lighting-techniques',
        title: 'Advanced Lighting Techniques for Real Estate Photography',
        date: '2024-03-12',
        url: 'posts/lighting-techniques.html',
        image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea',
        category: 'Photography Tips',
        description: 'Master the art of lighting to create stunning, professional property photos.'
    },
    {
        id: 'staging-tips-photography',
        title: 'Expert Staging Tips for Real Estate Photography',
        date: '2024-03-19',
        url: 'posts/staging-tips-photography.html',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
        category: 'Interior Tips',
        description: 'Learn how to stage properties for maximum impact in your real estate photography.'
    },
    {
        id: 'twilight-photography-tips',
        title: 'Creating Stunning Twilight Photos for Real Estate',
        date: '2024-03-14',
        url: 'posts/twilight-photography-tips.html',
        image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154',
        category: 'Photography Tips',
        description: 'Master the art of twilight photography to create dramatic and emotional property photos that sell.'
    },
    {
        id: 'real-estate-photography-guide',
        title: 'The Ultimate Guide to Real Estate Photography',
        date: '2024-03-09',
        url: 'posts/real-estate-photography-guide.html',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
        category: 'Photography Tips',
        description: 'A comprehensive guide covering everything from equipment selection to post-processing techniques for stunning real estate photos.'
    },
    {
        id: 'interior-composition',
        title: 'Mastering Interior Composition',
        date: '2024-03-04',
        url: 'posts/interior-composition.html',
        image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
        category: 'Interior Tips',
        description: 'Expert tips on capturing each room\'s best angles and highlighting key features that buyers look for.'
    },
    {
        id: 'aerial-photography-guide',
        title: 'Aerial Photography: Taking Your Listings to New Heights',
        date: '2024-02-29',
        url: 'posts/aerial-photography-guide.html',
        image: 'https://images.unsplash.com/photo-1513125370-3460ebe3401b',
        category: 'Drone Photography',
        description: 'Master the art of drone photography to showcase properties from stunning new perspectives.'
    }
];

// Function to populate blog grid
function setupBlogGrid(category = 'all') {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return; // Exit if not on blog listing page

    // Sort posts by date (newest first)
    const sortedPosts = [...blogPosts].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );

    // Filter posts by category if not 'all'
    const filteredPosts = category === 'all' 
        ? sortedPosts 
        : sortedPosts.filter(post => post.category.toLowerCase().includes(category.toLowerCase()));

    // Clear existing content
    blogGrid.innerHTML = '';

    // Add featured post (newest)
    const featuredPost = filteredPosts[0];
    if (featuredPost) {
        const featuredHTML = `
            <article class="blog-post featured">
                <div class="blog-image">
                    <img src="${featuredPost.image}" alt="${featuredPost.title}">
                    <div class="featured-badge">Featured</div>
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">${new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span class="blog-category">${featuredPost.category}</span>
                    </div>
                    <h2>${featuredPost.title}</h2>
                    <p>${featuredPost.description}</p>
                    <a href="${featuredPost.url}" class="blog-link">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `;
        blogGrid.innerHTML = featuredHTML;
    }

    // Add remaining posts
    filteredPosts.slice(1).forEach(post => {
        const postHTML = `
            <article class="blog-post">
                <div class="blog-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">${new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span class="blog-category">${post.category}</span>
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.description}</p>
                    <a href="${post.url}" class="blog-link">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `;
        blogGrid.innerHTML += postHTML;
    });
}

// Function to handle category button clicks
function setupCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    if (!categoryButtons.length) return;

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter posts
            setupBlogGrid(button.dataset.category);
        });
    });
}

// Function to populate blog preview on homepage
function setupBlogPreview() {
    const blogPreviewGrid = document.querySelector('.blog-section .blog-grid');
    if (!blogPreviewGrid) return; // Exit if not on homepage

    // Get 3 most recent posts
    const recentPosts = [...blogPosts]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    blogPreviewGrid.innerHTML = recentPosts.map(post => `
        <article class="blog-post">
            <div class="blog-image">
                <img data-src="${post.image}" alt="${post.title}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-date">${new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span class="blog-category">${post.category}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <a href="blog/${post.url}" class="blog-link">Read More ></a>
            </div>
        </article>
    `).join('');

    // Reinitialize lazy loading for the new images
    const newImages = blogPreviewGrid.querySelectorAll('img[data-src]');
    newImages.forEach(img => {
        img.setAttribute('loading', 'lazy');
        imageObserver.observe(img);
    });
}

// Call the functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
    setupBlogGrid();
    setupCategoryButtons();
    setupBlogPreview();
    
    // Remove any existing related articles sections
    document.querySelectorAll('.related-articles').forEach(section => {
        section.remove();
    });
    
    // Remove any existing post navigation
    document.querySelectorAll('.post-navigation').forEach(nav => {
        nav.remove();
    });
    
    // Remove newsletter section from blog posts
    document.querySelectorAll('.apple-newsletter').forEach(section => {
        section.remove();
    });
    
    // Update footer on blog posts
    if (document.querySelector('.blog-post-page')) {
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.innerHTML = `
                <div class="footer-content">
                    <div class="footer-section">
                        <h4>Boelman Media</h4>
                        <p>Professional real estate photography and media services.</p>
                        <div class="social-links">
                            <a href="#"><i class="fab fa-instagram"></i></a>
                            <a href="#"><i class="fab fa-facebook"></i></a>
                            <a href="#"><i class="fab fa-linkedin"></i></a>
                        </div>
                    </div>
                    <div class="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="../../index.html#services">Services</a></li>
                            <li><a href="../../index.html#portfolio">Portfolio</a></li>
                            <li><a href="../../index.html#pricing">Pricing</a></li>
                            <li><a href="../../index.html#contact">Contact</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Service Areas</h4>
                        <ul>
                            <li><a href="#">Des Moines</a></li>
                            <li><a href="#">Ames</a></li>
                            <li><a href="#">Ankeny</a></li>
                            <li><a href="#">West Des Moines</a></li>
                            <li><a href="#">Johnston</a></li>
                            <li><a href="#">All of Central Iowa</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 Boelman Media. All rights reserved.</p>
                </div>
            `;
        }
    }
}); 