
# Project Documentation: Festive Post Generator

This document provides a detailed overview of the Festive Post Generator project, including its architecture, code structure, and customization options. It is intended for developers who want to understand, modify, or contribute to the project.

## 1. Project Overview

The Festive Post Generator is a client-side web application built with HTML, CSS, and JavaScript. It uses the Fabric.js library to provide image manipulation capabilities in the browser. The application allows users to create custom festive posts by combining templates, logos, and text.

### 1.1. Core Technologies

- **HTML5:** Provides the structure of the web application.
- **CSS3:** Used for styling and responsive design.
- **JavaScript (ES6+):** Powers the application's logic and interactivity.
- **Fabric.js:** A powerful JavaScript library that provides an interactive object model on top of the HTML5 canvas.

## 2. File Structure

```
/
|-- index.html
|-- style.css
|-- script.js
|-- js/
|   |-- downloadHandler.js
|   |-- imageControls.js
|   |-- saveLoadHandler.js
|   |-- templateHandler.js
|   `-- textControls.js
|-- templates/
|   |-- template1.png
|   |-- ...
|   `-- templates.json
|-- assets/
|   `-- logo-placeholder.png
|-- dist/
|-- build/
|-- CONTRIBUTING.md
|-- README.md
|-- CHANGELOG.md
|-- PLAN.md
`-- DOCUMENTATION.md
```

- **`index.html`**: The main entry point of the application.
- **`style.css`**: Contains all the styles for the application.
- **`script.js`**: The core JavaScript file where all the application logic resides.
- **`js/`**: This directory contains the JavaScript modules.
    - **`downloadHandler.js`**: Handles downloading the final post.
    - **`imageControls.js`**: Handles logo uploading, drag and drop, and opacity.
    - **`saveLoadHandler.js`**: Handles saving and loading designs.
    - **`templateHandler.js`**: Handles loading and displaying templates.
    - **`textControls.js`**: Handles all text-related controls and canvas interactions.
- **`templates/`**: This directory holds the template images and the `templates.json` file.
- **`assets/`**: Contains static assets like the placeholder logo.
- **`dist/`**: This directory contains the minified files for production.
- **`build/`**: This directory contains the build scripts.
- **`CONTRIBUTING.md`**: Guidelines for contributing to the project.
- **`README.md`**: A general overview of the project.
- **`CHANGELOG.md`**: A log of all changes made to the project.
- **`PLAN.md`**: The development plan for future features and improvements.
- **`DOCUMENTATION.md`**: This file.

## 3. Code Deep Dive

### 3.1. `script.js`

This is the heart of the application. It is responsible for:

- **Canvas Initialization:** A new `fabric.Canvas` instance is created and linked to the `<canvas>` element in `index.html`.
- **Event Handling:** The script listens for various user interactions, such as file uploads, text input, and button clicks.
- **Template Loading:** The `loadTemplates` function fetches the `templates.json` file and dynamically creates the template gallery.
- **Image and Text Manipulation:** When a user uploads a logo or enters text, new Fabric.js objects (`fabric.Image`, `fabric.Textbox`) are created and added to the canvas.
- **Styling:** The brand color picker updates the `fill` property of the text object.
- **Downloading:** The `toDataURL` method of the canvas is used to generate a downloadable PNG image.

### 3.2. `templates.json`

This file acts as a simple database for the templates. It is an array of objects, where each object represents a template and has the following properties:

- `name`: The display name of the template.
- `thumbnail`: The path to the thumbnail image for the gallery.
- `path`: The path to the full-resolution template image.

### 3.3. Fabric.js Usage

Fabric.js is used for all canvas-related operations. Here are some of the key Fabric.js features used in this project:

- **`fabric.Canvas`**: The main canvas object.
- **`canvas.setBackgroundImage`**: Used to set the selected template as the canvas background.
- **`fabric.Textbox`**: For adding and editing the company name.
- **`fabric.Image`**: For adding the uploaded logo.
- **`canvas.add`**, **`canvas.remove`**, **`canvas.renderAll`**: For managing objects on the canvas.

## 4. How to Customize

### 4.1. Adding Fonts

To add new fonts:

1.  **Add Font Files:** Place your font files (e.g., in WOFF or WOFF2 format) in a new `fonts/` directory.
2.  **Update CSS:** Include the fonts in your `style.css` using the `@font-face` rule.
3.  **Update JavaScript:** Modify the `script.js` file to include the new fonts in the font selection UI (this feature is planned for a future release).

### 4.2. Changing the Output Resolution

The output resolution is currently hardcoded to 1080x1080 pixels. To change this, you need to update the following:

- In `index.html`, change the `width` and `height` attributes of the `<canvas>` element.
- In `script.js`, adjust the scaling calculations in the `selectTemplate` function and the `multiplier` in the download function to match the new resolution.

## 5. Future Development

For a detailed list of planned features and improvements, please refer to the `PLAN.md` file.
