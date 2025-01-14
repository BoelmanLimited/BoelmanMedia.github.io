class PropertyWebsite {
    static generateHTML(property) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${property.title || property.address} | Boelman Media</title>
                <link rel="stylesheet" href="/assets/css/property-site.css">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            </head>
            <body>
                <header class="hero" style="background-image: url('${property.gallery[0]?.url || ''}')">
                    <div class="hero-overlay"></div>
                    <div class="container">
                        <h1>${property.title || property.address}</h1>
                        <p class="address">${property.address}, ${property.city}</p>
                        <div class="property-highlights">
                            <span><i class="fas fa-bed"></i> ${property.bedrooms} Beds</span>
                            <span><i class="fas fa-bath"></i> ${property.bathrooms} Baths</span>
                            <span><i class="fas fa-ruler-combined"></i> ${property.squareFootage} Sq Ft</span>
                            <span class="price">$${Number(property.price).toLocaleString()}</span>
                        </div>
                    </div>
                </header>

                <main class="container">
                    <section class="property-details">
                        <div class="description">
                            <h2>About This Property</h2>
                            <p>${property.description || 'No description available.'}</p>
                        </div>

                        <div class="features">
                            <h2>Features</h2>
                            <ul class="features-list">
                                ${property.features.map(feature => `
                                    <li><i class="fas fa-check"></i> ${feature}</li>
                                `).join('')}
                            </ul>
                        </div>

                        <div class="gallery">
                            <h2>Photo Gallery</h2>
                            <div class="gallery-grid">
                                ${property.gallery.map((image, index) => `
                                    <div class="gallery-item">
                                        <img src="${image.url}" alt="${image.caption || `Property photo ${index + 1}`}">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </section>

                    <aside class="agent-info">
                        <div class="agent-card">
                            <img src="/assets/images/logo-dark-large.png" alt="Boelman Media" class="agent-logo">
                            <div class="agent-contact">
                                <p class="agent-name">${property.clientName}</p>
                                <p><i class="fas fa-phone"></i> ${property.clientPhone}</p>
                                <p><i class="fas fa-envelope"></i> ${property.clientEmail}</p>
                            </div>
                        </div>
                    </aside>
                </main>
            </body>
            </html>
        `;
    }

    static async create(property) {
        try {
            const websiteHtml = this.generateHTML(property);
            
            console.log('Sending request to create website...');
            // Send to PHP endpoint to create file
            const response = await fetch(window.location.origin + '/api/create-property-website.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyId: property.id,
                    html: websiteHtml
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            console.log('Server response:', result);
            
            if (!result.success) {
                throw new Error(result.message);
            }

            // Store the URL in localStorage for tracking
            const websites = JSON.parse(localStorage.getItem('propertyWebsites') || '{}');
            websites[property.id] = result.url;
            localStorage.setItem('propertyWebsites', JSON.stringify(websites));
            
            return true;
        } catch (error) {
            console.error('Error creating property website:', error);
            return false;
        }
    }

    static exists(propertyId) {
        const websites = JSON.parse(localStorage.getItem('propertyWebsites') || '{}');
        // Check if the website file exists
        return fetch(this.getUrl(propertyId), { method: 'HEAD' })
            .then(response => response.ok)
            .catch(() => false);
    }

    static getUrl(propertyId) {
        const websites = JSON.parse(localStorage.getItem('propertyWebsites') || '{}');
        return websites[propertyId] || `/properties/sites/${propertyId}.html`;
    }

    static preview(property) {
        const previewHtml = this.generateHTML(property);
        const previewFrame = document.getElementById('preview-frame');
        const modal = document.getElementById('preview-modal');
        
        // Write the HTML to the iframe
        previewFrame.contentDocument.open();
        previewFrame.contentDocument.write(previewHtml);
        previewFrame.contentDocument.close();
        
        // Show the modal
        modal.style.display = 'flex';
    }
} 