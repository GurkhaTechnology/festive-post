
/**
 * @file textControls.js
 * @description This module handles all text-related controls and canvas interactions.
 */

/**
 * @function initializeTextControls
 * @description Initializes all the text-related event listeners.
 * @param {fabric.Canvas} canvas - The fabric canvas object.
 * @param {fabric.Textbox} activeTextObject - The active text object.
 * @param {HTMLInputElement} companyNameInput - The input for the company name.
 * @param {HTMLInputElement} brandColorInput - The input for the brand color.
 * @param {HTMLElement} colorPalette - The container for the color palette.
 * @param {HTMLSelectElement} fontFamilySelect - The select for the font family.
 * @param {HTMLElement} textAlignButtons - The container for the text align buttons.
 * @param {HTMLInputElement} fontSizeInput - The input for the font size.
 * @param {HTMLInputElement} textRotationInput - The input for the text rotation.
 * @param {HTMLInputElement} textOutlineWidthInput - The input for the text outline width.
 * @param {HTMLInputElement} textOutlineColorInput - The input for the text outline color.
 * @param {HTMLInputElement} textShadowColorInput - The input for the text shadow color.
 * @param {HTMLInputElement} textShadowBlurInput - The input for the text shadow blur.
 * @param {HTMLInputElement} textShadowOffsetXInput - The input for the text shadow offset x.
 * @param {HTMLInputElement} textShadowOffsetYInput - The input for the text shadow offset y.
 * @param {HTMLButtonElement} addTextBtn - The button to add a new text box.
 */
function initializeTextControls(canvas, activeTextObject, companyNameInput, brandColorInput, colorPalette, fontFamilySelect, textAlignButtons, fontSizeInput, textRotationInput, textOutlineWidthInput, textOutlineColorInput, textShadowColorInput, textShadowBlurInput, textShadowOffsetXInput, textShadowOffsetYInput, addTextBtn) {

    /**
     * @function addTextObject
     * @description Adds a new text object to the canvas.
     * @param {string} text - The text to be added.
     */
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

    // Event listeners
    companyNameInput.addEventListener('input', (e) => {
        if (activeTextObject && activeTextObject.type === 'textbox') {
            activeTextObject.set('text', e.target.value);
        } else {
            addTextObject(e.target.value);
        }
        canvas.renderAll();
    });

    brandColorInput.addEventListener('input', (e) => {
        if (activeTextObject) {
            activeTextObject.set('fill', e.target.value);
            canvas.renderAll();
        }
    });

    colorPalette.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('color-swatch')) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const selectedColor = e.target.dataset.color;
                brandColorInput.value = selectedColor;
                if (activeTextObject) {
                    activeTextObject.set('fill', selectedColor);
                    canvas.renderAll();
                }
            }
        }
    });

    addTextBtn.addEventListener('click', () => {
        addTextObject('New Text');
    });

    fontFamilySelect.addEventListener('change', () => {
        if (activeTextObject) {
            activeTextObject.set('fontFamily', fontFamilySelect.value);
            canvas.renderAll();
        }
    });

    textAlignButtons.querySelectorAll('.align-btn').forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.querySelectorAll('.align-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                if (activeTextObject) {
                    activeTextObject.set('textAlign', button.dataset.align);
                    canvas.renderAll();
                }
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

    /**
     * @function updateTextShadow
     * @description Updates the shadow of the active text object.
     */
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

    /**
     * @function updateControls
     * @description Updates the control panel with the properties of the active text object.
     * @param {fabric.Textbox} textObject - The active text object.
     */
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

    /**
     * @function resetControls
     * @description Resets the control panel when no text object is selected.
     */
    function resetControls() {
        companyNameInput.value = '';
        // Keep other controls at their default or last used values, or reset as desired
    }

    // Add initial text object
    addTextObject('Your Company Name');
}

export { initializeTextControls, updateControls, resetControls };
