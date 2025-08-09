
document.addEventListener('DOMContentLoaded', () => {
    const canvas = new fabric.Canvas('canvas');
    const companyNameInput = document.getElementById('company-name');
    const logoUpload = document.getElementById('logo-upload');
    const dropZone = document.getElementById('drop-zone');
    const logoOpacityInput = document.getElementById('logo-opacity');
    const brandColorInput = document.getElementById('brand-color');
    const colorPalette = document.getElementById('color-palette');
    const downloadBtn = document.getElementById('download-btn');
    const downloadFormatSelect = document.getElementById('download-format');
    const templateGallery = document.getElementById('template-gallery');
    const categoryFilters = document.getElementById('category-filters');
    const searchInput = document.getElementById('search-template');
    const fontFamilySelect = document.getElementById('font-family');
    const textAlignButtons = document.getElementById('text-align-buttons');
    const fontSizeInput = document.getElementById('font-size');
    const textRotationInput = document.getElementById('text-rotation');
    const textOutlineWidthInput = document.getElementById('text-outline-width');
    const textOutlineColorInput = document.getElementById('text-outline-color');
    const textShadowColorInput = document.getElementById('text-shadow-color');
    const textShadowBlurInput = document.getElementById('text-shadow-blur');
    const textShadowOffsetXInput = document.getElementById('text-shadow-offset-x');
    const textShadowOffsetYInput = document.getElementById('text-shadow-offset-y');
    const imageFilters = document.getElementById('image-filters');
    const saveDesignBtn = document.getElementById('save-design-btn');
    const loadDesignBtn = document.getElementById('load-design-btn');
    const loadDesignInput = document.getElementById('load-design-input');

    let activeTextObject, logoImg, templates = [];
    const addTextBtn = document.getElementById('add-text-btn');

    // Function to load templates from JSON
    async function loadTemplates() {
        try {
            const response = await fetch('templates/templates.json');
            templates = await response.json();
            displayCategories();
            displayTemplates('all');
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    }

    // Function to display category filters
    function displayCategories() {
        const categories = ['all', ...new Set(templates.map(t => t.category))];
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            btn.classList.add('category-btn');
            if (category === 'all') btn.classList.add('active');
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                displayTemplates(category, searchInput.value);
            });
            categoryFilters.appendChild(btn);
        });
    }

    // Function to display templates
    function displayTemplates(category, searchTerm = '') {
        templateGallery.innerHTML = '';
        let filteredTemplates = category === 'all' ? templates : templates.filter(t => t.category === category);

        if (searchTerm) {
            filteredTemplates = filteredTemplates.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });

        filteredTemplates.forEach(template => {
            const img = document.createElement('img');
            img.dataset.src = template.thumbnail;
            img.alt = template.name;
            observer.observe(img);
            const item = document.createElement('div');
            item.classList.add('template-item');
            item.appendChild(img);
            item.addEventListener('click', () => {
                selectTemplate(template.path);
                document.querySelectorAll('.template-item').forEach(el => el.classList.remove('selected'));
                item.classList.add('selected');
            });
            templateGallery.appendChild(item);
        });
    }

    // Function to select a template
    function selectTemplate(path) {
        fabric.Image.fromURL(path, (img) => {
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / img.width,
                scaleY: canvas.height / img.height,
                // Apply current filter if any
                filters: canvas.backgroundImage.filters || []
            });
        });
    }

    // Apply image filter
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

    // Function to add a new text object
    function addTextObject(text = '') {
        const newText = new fabric.Textbox(text, {
            left: canvas.width / 2,
            top: canvas.height / 2,
            fill: brandColorInput.value,
            fontSize: parseInt(fontSizeInput.value),
            fontFamily: fontFamilySelect.value,
            textAlign: document.querySelector('.align-btn.active').dataset.align,
            originX: 'center',
            angle: parseInt(textRotationInput.value),
            strokeWidth: parseInt(textOutlineWidthInput.value),
            stroke: textOutlineColorInput.value,
            shadow: new fabric.Shadow({
                color: textShadowColorInput.value,
                blur: parseInt(textShadowBlurInput.value),
                offsetX: parseInt(textShadowOffsetXInput.value),
                offsetY: parseInt(textShadowOffsetYInput.value)
            })
        });
        canvas.add(newText);
        canvas.setActiveObject(newText);
        activeTextObject = newText;
        canvas.renderAll();
    }

    // Handle company name input
    companyNameInput.addEventListener('input', (e) => {
        if (activeTextObject && activeTextObject.type === 'textbox') {
            activeTextObject.set('text', e.target.value);
        } else {
            addTextObject(e.target.value);
        }
        canvas.renderAll();
    });

    // Handle brand color change
    brandColorInput.addEventListener('input', (e) => {
        if (activeTextObject) {
            activeTextObject.set('fill', e.target.value);
            canvas.renderAll();
        }
    });

    // Handle color palette selection
    colorPalette.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-swatch')) {
            const selectedColor = e.target.dataset.color;
            brandColorInput.value = selectedColor;
            if (activeTextObject) {
                activeTextObject.set('fill', selectedColor);
                canvas.renderAll();
            }
        }
    });

    // Handle logo upload
    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleLogoFile(file);
    });

    // Handle drag and drop
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

    // Handle download
    downloadBtn.addEventListener('click', () => {
        const format = downloadFormatSelect.value;
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `festive-post.${format}`;
            link.click();
            URL.revokeObjectURL(url);
        }, `image/${format}`, 1); // Quality 1 for best quality
    });

    // Handle save design
    saveDesignBtn.addEventListener('click', () => {
        const json = JSON.stringify(canvas.toJSON());
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'festive-post-design.json';
        link.click();
        URL.revokeObjectURL(url);
    });

    // Handle load design
    loadDesignBtn.addEventListener('click', () => {
        loadDesignInput.click(); // Trigger the hidden file input
    });

    loadDesignInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (f) => {
                canvas.loadFromJSON(f.target.result, () => {
                    canvas.renderAll();
                    // Re-select the active text object if it was a textbox
                    const objects = canvas.getObjects();
                    const textObjects = objects.filter(obj => obj.type === 'textbox');
                    if (textObjects.length > 0) {
                        activeTextObject = textObjects[0]; // Select the first text object by default
                        canvas.setActiveObject(activeTextObject);
                        updateControls(activeTextObject);
                    } else {
                        activeTextObject = null;
                        resetControls();
                    }
                });
            };
            reader.readAsText(file);
        }
    });

    // Initial setup
    loadTemplates();
    addTextObject('Your Company Name');

    // Handle adding new text box
    addTextBtn.addEventListener('click', () => {
        addTextObject('New Text');
    });

    // Update controls when a text object is selected
    canvas.on('selection:created', (e) => {
        if (e.selected[0] && e.selected[0].type === 'textbox') {
            activeTextObject = e.selected[0];
            updateControls(activeTextObject);
        }
    });

    canvas.on('selection:updated', (e) => {
        if (e.selected[0] && e.selected[0].type === 'textbox') {
            activeTextObject = e.selected[0];
            updateControls(activeTextObject);
        }
    });

    canvas.on('selection:cleared', () => {
        activeTextObject = null;
        resetControls();
    });

    function updateControls(textObject) {
        companyNameInput.value = textObject.text;
        brandColorInput.value = textObject.fill;
        fontFamilySelect.value = textObject.fontFamily;
        fontSizeInput.value = textObject.fontSize;
        textRotationInput.value = textObject.angle;
        textOutlineWidthInput.value = textObject.strokeWidth || 0;
        textOutlineColorInput.value = textObject.stroke || '#000000';

        // Update text align buttons
        document.querySelectorAll('.align-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.align === textObject.textAlign) {
                btn.classList.add('active');
            }
        });

        // Update shadow controls
        if (textObject.shadow) {
            textShadowColorInput.value = textObject.shadow.color;
            textShadowBlurInput.value = textObject.shadow.blur;
            textShadowOffsetXInput.value = textObject.shadow.offsetX;
            textShadowOffsetYInput.value = textObject.shadow.offsetY;
        } else {
            textShadowColorInput.value = '#000000';
            textShadowBlurInput.value = 0;
            textShadowOffsetXInput.value = 0;
            textShadowOffsetYInput.value = 0;
        }
    }

    function resetControls() {
        companyNameInput.value = '';
        // Keep other controls at their default or last used values, or reset as desired
    }

    fontFamilySelect.addEventListener('change', () => {
        if (activeTextObject) {
            activeTextObject.set('fontFamily', fontFamilySelect.value);
            canvas.renderAll();
        }
    });

    textAlignButtons.querySelectorAll('.align-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.align-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            if (activeTextObject) {
                activeTextObject.set('textAlign', button.dataset.align);
                canvas.renderAll();
            }
        });
    });

    fontSizeInput.addEventListener('input', () => {
        if (activeTextObject) {
            activeTextObject.set('fontSize', parseInt(fontSizeInput.value));
            canvas.renderAll();
        }
    });

    textRotationInput.addEventListener('input', () => {
        if (activeTextObject) {
            activeTextObject.set('angle', parseInt(textRotationInput.value));
            canvas.renderAll();
        }
    });

    textOutlineWidthInput.addEventListener('input', () => {
        if (activeTextObject) {
            activeTextObject.set('strokeWidth', parseInt(textOutlineWidthInput.value));
            canvas.renderAll();
        }
    });

    textOutlineColorInput.addEventListener('input', () => {
        if (activeTextObject) {
            activeTextObject.set('stroke', textOutlineColorInput.value);
            canvas.renderAll();
        }
    });

    textShadowColorInput.addEventListener('input', updateTextShadow);
    textShadowBlurInput.addEventListener('input', updateTextShadow);
    textShadowOffsetXInput.addEventListener('input', updateTextShadow);
    textShadowOffsetYInput.addEventListener('input', updateTextShadow);

    logoOpacityInput.addEventListener('input', () => {
        if (logoImg) {
            logoImg.set('opacity', parseFloat(logoOpacityInput.value));
            canvas.renderAll();
        }
    });

    function updateTextShadow() {
        if (activeTextObject) {
            activeTextObject.set('shadow', new fabric.Shadow({
                color: textShadowColorInput.value,
                blur: parseInt(textShadowBlurInput.value),
                offsetX: parseInt(textShadowOffsetXInput.value),
                offsetY: parseInt(textShadowOffsetYInput.value)
            }));
            canvas.renderAll();
        }
    }

    searchInput.addEventListener('input', () => {
        const activeCategory = document.querySelector('.category-btn.active').textContent.toLowerCase();
        displayTemplates(activeCategory, searchInput.value);
    });
});
