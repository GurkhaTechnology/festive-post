
/**
 * @file script.js
 * @description This is the main script file for the Festive Post Generator.
 * It initializes the canvas and all the modules.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get all the necessary DOM elements
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
    const addTextBtn = document.getElementById('add-text-btn');

    // Initialize variables
    let activeTextObject, logoImg, templates = [];

    // Load templates and initialize the template gallery
    loadTemplates((loadedTemplates) => {
        templates = loadedTemplates;
        displayCategories(templates, categoryFilters, (category) => displayTemplates(templates, category, searchInput.value, templateGallery, selectTemplate));
        displayTemplates(templates, 'all', '', templateGallery, selectTemplate);
    });

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

    // Initialize all the modules
    initializeTextControls(canvas, activeTextObject, companyNameInput, brandColorInput, colorPalette, fontFamilySelect, textAlignButtons, fontSizeInput, textRotationInput, textOutlineWidthInput, textOutlineColorInput, textShadowColorInput, textShadowBlurInput, textShadowOffsetXInput, textShadowOffsetYInput, addTextBtn);
    initializeImageControls(canvas, logoUpload, dropZone, logoOpacityInput, logoImg, imageFilters);
    initializeSaveLoadHandler(canvas, saveDesignBtn, loadDesignBtn, loadDesignInput, activeTextObject, updateControls, resetControls);
    initializeDownloadHandler(canvas, downloadBtn, downloadFormatSelect);

    // Event listener for the search input
    searchInput.addEventListener('input', () => {
        const activeCategory = document.querySelector('.category-btn.active').textContent.toLowerCase();
        displayTemplates(templates, activeCategory, searchInput.value, templateGallery, selectTemplate);
    });
});
