
/**
 * @file templateHandler.js
 * @description This module handles loading and displaying templates.
 */

let templates = [];

/**
 * @function loadTemplates
 * @description Loads templates from a JSON file.
 * @param {function} callback - The callback function to be executed after the templates are loaded.
 */
async function loadTemplates(callback) {
    try {
        const response = await fetch('templates/templates.json');
        templates = await response.json();
        callback(templates);
    } catch (error) {
        console.error('Error loading templates:', error);
    }
}

/**
 * @function displayCategories
 * @description Displays the template category filters.
 * @param {Array} templates - The array of templates.
 * @param {HTMLElement} categoryFilters - The container for the category filters.
 * @param {function} displayTemplatesCallback - The callback function to display the templates.
 */
function displayCategories(templates, categoryFilters, displayTemplatesCallback) {
    const categories = ['all', ...new Set(templates.map(t => t.category))];
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        btn.classList.add('category-btn');
        if (category === 'all') btn.classList.add('active');
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayTemplatesCallback(category);
        });
        categoryFilters.appendChild(btn);
    });
}

/**
 * @function displayTemplates
 * @description Displays the templates in the gallery.
 * @param {Array} templates - The array of templates.
 * @param {string} category - The selected category.
 * @param {string} searchTerm - The search term.
 * @param {HTMLElement} templateGallery - The container for the template gallery.
 * @param {function} selectTemplateCallback - The callback function to select a template.
 */
function displayTemplates(templates, category, searchTerm = '', templateGallery, selectTemplateCallback) {
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
        item.setAttribute('role', 'option');
        item.setAttribute('tabindex', '0');
        item.appendChild(img);
        item.addEventListener('click', () => {
            selectTemplateCallback(template.path);
            document.querySelectorAll('.template-item').forEach(el => {
                el.classList.remove('selected');
                el.setAttribute('aria-selected', 'false');
            });
            item.classList.add('selected');
            item.setAttribute('aria-selected', 'true');
        });
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
        templateGallery.appendChild(item);
    });
}

export { loadTemplates, displayCategories, displayTemplates };
