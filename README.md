# TickerLookupWebApplication

This repository contains a Python web application that fetches financial data from the Alpha Vantage API and displays it in a web browser. The project has been structured as a single-page web application (SPA), which relies on JavaScript for rendering and Python (Flask) for handling API calls. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

- Python 3.x
- Flask
- Pandas
- Requests
- flask_cors

You can install the Python packages using pip:

### Setup

1. Clone this repository to your local machine.
2. Navigate to the cloned repository using the command line.

### Running the App

To start the server, run the following command in your terminal:


The application can be accessed in a web browser at `http://localhost:5500/`.

## File Descriptions

- `workspace.code-workspace` : Visual Studio Code workspace settings file.
- `webappPython.py` : Flask server that communicates with the Alpha Vantage API.
- `style.css` : Stylesheet for the web page.
- `script.js` : JavaScript file that handles the client-side logic.
- `main.html` : HTML file for the web page.
- `connector.js` : Connects the Flask server to the client-side JavaScript.
- `templates/data.html` : Template for displaying the fetched data.

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

The code in this project is licensed under MIT license. See the LICENSE file for more information.


