
/**
 * @file imageControls.js
 * @description This module handles logo uploading, drag and drop, and opacity.
 */

/**
 * @function initializeImageControls
 * @description Initializes all the image-related event listeners.
 * @param {fabric.Canvas} canvas - The fabric canvas object.
 * @param {HTMLInputElement} logoUpload - The input for the logo upload.
 * @param {HTMLElement} dropZone - The drop zone for the logo.
 * @param {HTMLInputElement} logoOpacityInput - The input for the logo opacity.
 * @param {fabric.Image} logoImg - The logo image object.
 */
function initializeImageControls(canvas, logoUpload, dropZone, logoOpacityInput, logoImg, imageFilters) {

    // Event listeners
    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleLogoFile(file);
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('highlight');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('highlight');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('highlight');
        const file = e.dataTransfer.files[0];
        handleLogoFile(file);
    });

    /**
     * @function handleLogoFile
     * @description Handles the logo file upload and adds the logo to the canvas.
     * @param {File} file - The logo file.
     */
    function handleLogoFile(file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (f) => {
                const img = new Image();
                img.onload = () => {
                    const tempCanvas = document.createElement('canvas');
                    const MAX_WIDTH = 400; // Max width for the logo
                    const MAX_HEIGHT = 400; // Max height for the logo
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    tempCanvas.width = width;
                    tempCanvas.height = height;
                    const ctx = tempCanvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataURL = tempCanvas.toDataURL('image/png', 0.8); // Compress to PNG with 80% quality

                    fabric.Image.fromURL(dataURL, (fabricImg) => {
                        if (logoImg) {
                            canvas.remove(logoImg);
                        }
                        logoImg = fabricImg;
                        logoImg.set({
                            left: canvas.width / 2,
                            top: 100,
                            originX: 'center',
                            opacity: parseFloat(logoOpacityInput.value)
                        });
                        canvas.add(logoImg);
                        canvas.renderAll();
                    });
                };
                img.src = f.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    logoOpacityInput.addEventListener('input', () => {
        if (logoImg) {
            logoImg.set('opacity', parseFloat(logoOpacityInput.value));
            canvas.renderAll();
        }
    });

    imageFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const filterType = e.target.dataset.filter;
            if (canvas.backgroundImage) {
                canvas.backgroundImage.filters = [];
                if (filterType === 'grayscale') {
                    canvas.backgroundImage.filters.push(new fabric.Image.filters.Grayscale());
                } else if (filterType === 'sepia') {
                    canvas.backgroundImage.filters.push(new fabric.Image.filters.Sepia());
                } else if (filterType === 'invert') {
                    canvas.backgroundImage.filters.push(new fabric.Image.filters.Invert());
                }
                canvas.backgroundImage.applyFilters();
                canvas.renderAll();
            }
        }
    });

    imageFilters.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                const filterType = e.target.dataset.filter;
                if (canvas.backgroundImage) {
                    canvas.backgroundImage.filters = [];
                    if (filterType === 'grayscale') {
                        canvas.backgroundImage.filters.push(new fabric.Image.filters.Grayscale());
                    } else if (filterType === 'sepia') {
                        canvas.backgroundImage.filters.push(new fabric.Image.filters.Sepia());
                    } else if (filterType === 'invert') {
                        canvas.backgroundImage.filters.push(new fabric.Image.filters.Invert());
                    }
                    canvas.backgroundImage.applyFilters();
                    canvas.renderAll();
                }
            }
        }
    });

}

export { initializeImageControls };
