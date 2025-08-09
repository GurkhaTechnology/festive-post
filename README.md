
# Festive Post Generator for Businesses

This is a fully client-side web application that allows users to create festive posts for their businesses. Users can upload their logo, enter their company name, select a brand color, and choose from a variety of festive templates to generate a social media-ready post.

## Features

- **Client-Side Image Editing:** All image processing is done in the browser using the Fabric.js library.
- **Customizable Templates:** Easily add or modify templates by updating a JSON file.
- **Logo and Text Overlay:** Overlay your company logo and name onto any template.
- **Color Picker:** Choose a brand color to apply to the text.
- **Real-time Preview:** See your changes reflected in real-time on the canvas.
- **Downloadable Posts:** Download the final post as a 1080x1080 PNG file, perfect for social media.
- **Responsive Design:** The application is designed to work on both desktop and mobile devices.

## How to Use

1.  **Open the Application:** Simply open the `index.html` file in your web browser.
2.  **Upload Your Logo:** Click the "Upload Logo" button to select your company's logo (PNG, JPG, or SVG).
3.  **Enter Company Name:** Type your company's name in the text field.
4.  **Choose Brand Color:** Use the color picker to select your brand's primary color.
5.  **Select a Template:** Click on a template from the gallery to apply it to the canvas.
6.  **Preview and Download:** The preview will update as you make changes. Once you are happy with the result, click the "Download Post" button to save it as a PNG file.

## Customization

### Adding New Templates

1.  **Add Template Images:** Place your new template images (e.g., `my-template.png`) in the `templates/` directory.
2.  **Update `templates.json`:** Open the `templates/templates.json` file and add a new entry for your template. Follow this format:

    ```json
    {
      "name": "My Awesome Template",
      "thumbnail": "templates/my-template.png",
      "path": "templates/my-template.png"
    }
    ```

    *   `name`: The name of the template that will be displayed.
    *   `thumbnail`: The path to the thumbnail image (usually the same as the full image).
    *   `path`: The path to the full-size template image.

### Modifying Styles

- The visual appearance of the application can be customized by editing the `style.css` file.

## Project Structure

```
/
|-- index.html
|-- style.css
|-- script.js
|-- templates/
|   |-- template1.png
|   |-- template2.png
|   |-- ...
|   `-- templates.json
|-- assets/
|   `-- logo-placeholder.png
`-- README.md
```

## Technologies Used

- HTML5
- CSS3
- JavaScript
- [Fabric.js](http://fabricjs.com/)
