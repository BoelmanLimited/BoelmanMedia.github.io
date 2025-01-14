function generatePropertyHTML(property) {
    // Sanitize inputs
    const sanitizedProperty = {
        title: escapeHtml(property.title || property.address),
        address: escapeHtml(property.address),
        city: escapeHtml(property.city),
        description: escapeHtml(property.description),
        price: Number(property.price).toLocaleString(),
        bedrooms: escapeHtml(property.bedrooms),
        bathrooms: escapeHtml(property.bathrooms),
        squareFootage: escapeHtml(property.squareFootage),
        features: property.features.map(f => escapeHtml(f)),
        clientName: escapeHtml(property.clientName),
        clientPhone: escapeHtml(property.clientPhone),
        clientEmail: escapeHtml(property.clientEmail)
    };

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${sanitizedProperty.title} | Boelman Media</title>
            <link rel="stylesheet" href="/assets/css/property-site.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        </head>
        <body>
            <!-- Hero Section -->
            <header class="hero" style="background-image: url('${escapeHtml(property.gallery[0]?.url)}')">
                <div class="hero-overlay"></div>
                <div class="container">
                    <h1>${sanitizedProperty.title}</h1>
                    <p class="address">${sanitizedProperty.address}, ${sanitizedProperty.city}</p>
                    <div class="property-highlights">
                        <span><i class="fas fa-bed"></i> ${sanitizedProperty.bedrooms} Beds</span>
                        <span><i class="fas fa-bath"></i> ${sanitizedProperty.bathrooms} Baths</span>
                        <span><i class="fas fa-ruler-combined"></i> ${sanitizedProperty.squareFootage} Sq Ft</span>
                        <span class="price">$${sanitizedProperty.price}</span>
                    </div>
                </div>
            </header>

            <main class="container">
                <!-- Gallery Section -->
                <section class="gallery-section">
                    <h2>Property Gallery</h2>
                    <div class="gallery-grid">
                        ${property.gallery.slice(0, 8).map((img, index) => `
                            <div class="gallery-item" onclick="openLightbox(${index})">
                                <img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.caption || `Property photo ${index + 1}`)}">
                            </div>
                        `).join('')}
                        ${property.gallery.length > 8 ? `
                            <div class="gallery-item view-all" onclick="openLightbox(8)">
                                <div class="overlay">
                                    <i class="fas fa-images"></i>
                                    <span>View All Photos (${property.gallery.length})</span>
                                </div>
                                <img src="${escapeHtml(property.gallery[8].url)}" alt="More photos">
                            </div>
                        ` : ''}
                    </div>
                </section>

                <!-- Property Details -->
                <section class="property-details">
                    <div class="details-grid">
                        <div class="main-details">
                            <h2>About This Property</h2>
                            <p class="description">${sanitizedProperty.description}</p>
                            
                            <div class="features">
                                <h3>Property Features</h3>
                                <ul class="features-list">
                                    ${sanitizedProperty.features.map(feature => `
                                        <li><i class="fas fa-check"></i> ${feature}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                        
                        <div class="side-details">
                            <div class="agent-info">
                                <h3>Contact Agent</h3>
                                <div class="agent-card">
                                    <img src="../assets/images/logo-dark-large.png" alt="Boelman Media" class="agent-logo">
                                    <div class="agent-contact">
                                        <p class="agent-name">${sanitizedProperty.clientName}</p>
                                        <p class="agent-phone">${sanitizedProperty.clientPhone}</p>
                                        <p class="agent-email">${sanitizedProperty.clientEmail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Lightbox -->
            <div id="lightbox" class="lightbox">
                <button class="close-lightbox" onclick="closeLightbox()">&times;</button>
                <button class="nav-btn prev" onclick="changeImage(-1)">❮</button>
                <button class="nav-btn next" onclick="changeImage(1)">❯</button>
                <div class="lightbox-content">
                    <img id="lightbox-img" src="" alt="Property photo">
                    <div class="caption-container">
                        <p id="caption"></p>
                        <span id="photo-number"></span>
                    </div>
                </div>
            </div>

            <script>
                // Safely inject gallery data
                window.propertyGallery = ${JSON.stringify(property.gallery)};
                
                let currentImageIndex = 0;
                const images = window.propertyGallery;

                function openLightbox(index) {
                    currentImageIndex = index;
                    document.getElementById('lightbox').style.display = 'flex';
                    updateLightboxImage();
                    document.body.style.overflow = 'hidden';
                }

                function closeLightbox() {
                    document.getElementById('lightbox').style.display = 'none';
                    document.body.style.overflow = 'auto';
                }

                function changeImage(direction) {
                    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
                    updateLightboxImage();
                }

                function updateLightboxImage() {
                    const img = document.getElementById('lightbox-img');
                    const caption = document.getElementById('caption');
                    const number = document.getElementById('photo-number');
                    
                    img.src = images[currentImageIndex].url;
                    caption.textContent = images[currentImageIndex].caption || '';
                    number.textContent = \`Photo \${currentImageIndex + 1} of \${images.length}\`;
                }

                // Keyboard navigation
                document.addEventListener('keydown', function(e) {
                    if (document.getElementById('lightbox').style.display === 'flex') {
                        if (e.key === 'ArrowLeft') changeImage(-1);
                        if (e.key === 'ArrowRight') changeImage(1);
                        if (e.key === 'Escape') closeLightbox();
                    }
                });
            </script>
        </body>
        </html>
    `;
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
    if (unsafe === undefined || unsafe === null) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
} 