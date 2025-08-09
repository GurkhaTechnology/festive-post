
/**
 * @file saveLoadHandler.js
 * @description This module handles saving and loading designs.
 */

/**
 * @function initializeSaveLoadHandler
 * @description Initializes the save and load event listeners.
 * @param {fabric.Canvas} canvas - The fabric canvas object.
 * @param {HTMLButtonElement} saveDesignBtn - The button to save the design.
 * @param {HTMLButtonElement} loadDesignBtn - The button to load the design.
 * @param {HTMLInputElement} loadDesignInput - The hidden input for loading the design.
 * @param {fabric.Textbox} activeTextObject - The active text object.
 * @param {function} updateControls - The function to update the controls.
 * @param {function} resetControls - The function to reset the controls.
 */
function initializeSaveLoadHandler(canvas, saveDesignBtn, loadDesignBtn, loadDesignInput, activeTextObject, updateControls, resetControls) {

    // Event listeners
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
}

export { initializeSaveLoadHandler };
