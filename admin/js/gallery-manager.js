class GalleryManager {
    constructor(galleryId) {
        this.gallery = document.getElementById(galleryId);
        this.photos = [];
        this.initializeUpload();
    }

    initializeUpload() {
        const photoUpload = document.getElementById('photoUpload');
        photoUpload.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    async handleFiles(files) {
        for (const file of files) {
            await this.uploadPhoto(file);
        }
    }

    async uploadPhoto(file) {
        try {
            const formData = new FormData();
            formData.append('photo', file);
            formData.append('propertyId', document.querySelector('[name="property-id"]').value);

            const response = await fetch('/api/upload-photo.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.addPhotoToGallery(result.photo);
                showNotification('Photo uploaded successfully', 'success');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('Error uploading photo', 'error');
        }
    }

    addPhotoToGallery(photo) {
        const photoElement = document.createElement('div');
        photoElement.className = 'gallery-item';
        photoElement.dataset.id = photo.id;
        photoElement.innerHTML = `
            <div class="photo-container">
                <img src="${photo.url}" alt="${photo.caption || 'Property photo'}">
                <div class="photo-overlay">
                    <div class="photo-actions">
                        <button onclick="galleryManager.deletePhoto('${photo.id}')" class="photo-action">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.gallery.appendChild(photoElement);
        this.photos.push(photo);
    }

    async deletePhoto(photoId) {
        if (!confirm('Are you sure you want to delete this photo?')) {
            return;
        }

        try {
            const response = await fetch('/api/delete-photo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyId: document.querySelector('[name="property-id"]').value,
                    photoId: photoId
                })
            });

            const result = await response.json();
            if (result.success) {
                const element = this.gallery.querySelector(`[data-id="${photoId}"]`);
                element.remove();
                this.photos = this.photos.filter(p => p.id !== photoId);
                showNotification('Photo deleted successfully', 'success');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error deleting photo:', error);
            showNotification('Error deleting photo', 'error');
        }
    }

    loadGallery(photos) {
        this.gallery.innerHTML = '';
        this.photos = [];
        photos.forEach(photo => this.addPhotoToGallery(photo));
    }
}

// Initialize gallery manager
const galleryManager = new GalleryManager('propertyGallery'); 