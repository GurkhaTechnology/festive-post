
/**
 * @file downloadHandler.js
 * @description This module handles downloading the final post.
 */

/**
 * @function initializeDownloadHandler
 * @description Initializes the download event listener.
 * @param {fabric.Canvas} canvas - The fabric canvas object.
 * @param {HTMLButtonElement} downloadBtn - The button to download the post.
 * @param {HTMLSelectElement} downloadFormatSelect - The select for the download format.
 */
function initializeDownloadHandler(canvas, downloadBtn, downloadFormatSelect) {

    // Event listener
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
}

export { initializeDownloadHandler };
