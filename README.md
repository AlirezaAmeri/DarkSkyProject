# DarkSkyProject

## Goal: 
This projected is developed to show weather information for the past week at a specific location selected by the user.

## Tools:
I developed the service using Java script and two APIs. 

The first API is “DarkSky” for retrieving the weather information. This API has two main request types; First is “Forcast Request” which returns the current weather conditions, a minute-by-minute forecast for the next hour (where available), an hour-by-hour forecast for the next 48 hours, and a day-by-day forecast for the next week. The second request type is “Time Machine Request” which is used in my code. This request returns the observed (in the past) or forecasted (in the future) hour-by-hour weather and daily weather conditions for a particular date. 

The second API is “Google Map” for providing autofill functionality when the user selects a specific location. This API give recommendations to the user by showing a drop menu on the screen when he/she enters a location name. 
The service is deployed using Google APP engine. 

## Hierarchy:
The hierarchy of the project is as follows:
-	www: Directory for storing all files, including HTML, CSS, images, and JavaScript.
  -	css: Directory to store stylesheets.
    -	style.css: Basic stylesheet that formats the look of website
  -	images: Directory to store images.
    -	cloudybkgd.jpg: Background image for the website
  -	js: Directory to store JavaScript files
    -	index.js: Java script file which handles the APIs
  -	index.html: An HTML file that displays content for website.
-	App.yaml: Configure the settings of App Engine application.

## Description:
- The HTML body consists of one “div” which is divided into four div sections including “header”, “city selection”, “content area”, and “footer”:
  - Header: Includes the title of the page
    - City selection: Includes a form for selecting the city name and submit button for requesting the weather information
    - Content area: This section will be populated later according to the user’s request. The weather information for the past week (7 days) will be shown here.
    - Footer: Includes the copyright information
- The CSS file is written for adding a proper look for the website. This included defining the dimensions of different elements on the page, colors, styles, and fonts.
- The Java script file is the core of this project. In a normal flow, the following will occur:
  - First the user uses the text box inside the form to select a location. This text box is equipped with an auto fill capability which is enabled using Google Map API. When the city is selected, the user clicks on the “Go” button where the form submits the user data. 
  - Google API extracts the longitude and latitude information of the selected location and stores them in global variables. 
  - Then the Time Machine request calls will be executed using the Darksky API. With that, we can retrieve the weather information in the past days. However, this call will be done for each of the 7 days in the past week. Thereby, the JSON responses have to be handled separately for all the 7 API calls. 
  - After the weather data is extracted from the JSON files, they will be used to create the main structure of the GUI. Here, I add “div” tags to the HTML body (DOM). In each “div” section, I show the day, the date, an animated figure, humidity, minimum temperature, and maximum temperature. The animated figures for different weather conditions are enabled using DarkSky extension called skycon.
