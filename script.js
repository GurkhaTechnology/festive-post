
document.addEventListener('DOMContentLoaded', () => {
    const canvas = new fabric.Canvas('canvas');
    const companyNameInput = document.getElementById('company-name');
    const logoUpload = document.getElementById('logo-upload');
    const brandColorInput = document.getElementById('brand-color');
    const downloadBtn = document.getElementById('download-btn');
    const templateGallery = document.getElementById('template-gallery');

    let companyNameText, logoImg;

    // Function to load templates from JSON
    async function loadTemplates() {
        try {
            const response = await fetch('templates/templates.json');
            const templates = await response.json();
            templates.forEach(template => {
                const img = document.createElement('img');
                img.src = template.thumbnail;
                img.alt = template.name;
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
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    }

    // Function to select a template
    function selectTemplate(path) {
        canvas.setBackgroundImage(path, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / 1080,
            scaleY: canvas.height / 1080,
        });
    }

    // Handle company name input
    companyNameInput.addEventListener('input', (e) => {
        if (!companyNameText) {
            companyNameText = new fabric.Textbox(e.target.value, {
                left: canvas.width / 2,
                top: canvas.height - 100,
                fill: brandColorInput.value,
                fontSize: 60,
                fontFamily: 'Arial',
                textAlign: 'center',
                originX: 'center',
            });
            canvas.add(companyNameText);
        } else {
            companyNameText.set('text', e.target.value);
        }
        canvas.renderAll();
    });

    // Handle brand color change
    brandColorInput.addEventListener('input', (e) => {
        if (companyNameText) {
            companyNameText.set('fill', e.target.value);
            canvas.renderAll();
        }
    });

    // Handle logo upload
    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (f) => {
                fabric.Image.fromURL(f.target.result, (img) => {
                    if (logoImg) {
                        canvas.remove(logoImg);
                    }
                    logoImg = img;
                    logoImg.scaleToWidth(200); // Resize logo
                    logoImg.set({
                        left: canvas.width / 2,
                        top: 100,
                        originX: 'center',
                    });
                    canvas.add(logoImg);
                    canvas.renderAll();
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle download
    downloadBtn.addEventListener('click', () => {
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 1080 / canvas.width
        });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'festive-post.png';
        link.click();
    });

    // Initial setup
    loadTemplates();
});
