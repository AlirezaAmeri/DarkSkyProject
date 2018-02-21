//Global variables
var input_city = $("#city");
var city_name, city_latitude, city_longitude;
//Lists for storing api response information for past week's 7 days
var day_list = [];
var skicons_list = [];
var humidity_list = [];
var temperatureMin_list = [];
var temperatureMax_list = [];
var date_list = [];

//when the city is selected and the form is submitted
$('form').submit(function(event){
  //prevent refreshing the page
  event.preventDefault();
  //make sure the city_latitude and city_longitude are retrieved
  if(city_latitude == '' || city_longitude == ''){
    console.log('Not enough informaiton!');
  }
  else{
    //remove previosu contents for previous city search
    $('#content_area').remove();
    //add a blank content to DOM for new city search
    var content_area_DOM = '<div id="content_area"></div>';
    $('#city_selection').after(content_area_DOM);
    //calling the main function for retreiving last week's weather information
    ShowLastWeakWeather(city_latitude, city_longitude);
  }
});

// function for calling the Time Machine API call to retrieve weather
// on specific date in the past or future
//excluding all unnecessary information from JSON including
//currently,flags,alerts,hourly,minutely
function createTimeMachineAPIcall(desired_time, c_lat, c_long) {
  var apiKey       = '0716b0c482c045e47ec0e9f3343c5e6a';
	var api_url     = 'https://api.darksky.net/forecast/' + apiKey + "/" +
                    c_lat + "," + c_long + "," + desired_time +
                    "?exclude=currently,flags,alerts,hourly,minutely&callback=?";
  return api_url;
}

//Main function for retrieving information for the selected location
function ShowLastWeakWeather(c_lat, c_long) {
  var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'];
  var api_url ='';
  var current_date = new Date();
  var current_date_day = current_date.getDay();
  //identifying the Monday of last week considering the current browser date
  var begining_of_last_week_unix = Math.round((current_date.getTime() - (86400000*current_date_day) - 518400000)/1000);
  var last_weeks_days_unix = [];
  var requests_processed = 0;

  //populating the list of unix times for identifying 7 days of last week
  for(i=0; i<7; i++){
    last_weeks_days_unix.push(begining_of_last_week_unix + (i*86400));
    console.log(last_weeks_days_unix[i]);
  }
  //looping over each of the days in last week
  last_weeks_days_unix.forEach(function(elem, n) {
    api_url = createTimeMachineAPIcall(elem, c_lat, c_long);
    //runnign API calls for each day and waiting for the response
    $.getJSON(api_url)
    .then(function(forecast) {
      //receiving and extracting weather information for each day
      //and storing it in the global lists
      var date = new Date(forecast.daily.data[0].time * 1000);
      var day_digit = parseInt(date.getDay());
      day_list[day_digit] = days[day_digit];
      skicons_list[day_digit] = forecast.daily.data[0].icon;
      humidity_list[day_digit] = forecast.daily.data[0].humidity;
      temperatureMin_list[day_digit] = Math.round(forecast.daily.data[0].temperatureMin);
      temperatureMax_list[day_digit] = Math.round(forecast.daily.data[0].temperatureMax);
      date_list[day_digit] = timeConverter(date);
      //making sure all the 7 day's information is received
      requests_processed++;
      if(requests_processed==7){
        //updating the DOM when all information is received
        update_weather_elements();
        //animate the icons for weather information
        skycons();
      }
    });
  });
}

//function for converting date object to DD MM YY format
function timeConverter(date_to_convert){
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = date_to_convert.getFullYear();
  var month = months[date_to_convert.getMonth()];
  var date = date_to_convert.getDate();
  var time = date + ' ' + month + ' ' + year;
  return time;
}

//fucntion for updating the icons according to the latest weather information
function skycons() {
  icons = new Skycons({
    "color" : "#BFBFBF"
  });
  var icons_list  = [
    "clear-day",
    "clear-night",
    "partly-cloudy-day",
    "partly-cloudy-night",
    "cloudy",
    "rain",
    "sleet",
    "snow",
    "wind",
    "fog"
  ];

  for(i = icons_list.length; i--;) {
    //retrieving icons using the class names which are associated with each weather type
		var weatherType = icons_list[i];
	  var canvas_elements = document.getElementsByClassName( weatherType );

		for (e = canvas_elements.length; e--;) {
			icons.set(canvas_elements[e], weatherType);
		}
	}
  icons.play();
}

//function for updating the DOM for each day when all weather information is received
function update_weather_elements() {
  var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'];

  //adding the div blocks for each day in the order starting from Monday
  var day_list_from_monday = [1, 2, 3, 4, 5, 6, 0]
  day_list_from_monday.forEach(function(day){
    $('#content_area').append(
      "<div id='day" + day + "' class='daySection'>" +
      "<div class='dayName'>" + days[day] + "</div>" +
      "<div class='weatherData' id='wd0'>" + date_list[day] + "</div>" +
      "<div class='animatedIcon'><canvas class=" + skicons_list[day] + "></canvas></div>" +
      "<div class='weatherData' id='wd1'><b>Min Temp.</b>: " + temperatureMin_list[day] + "</div>" +
      "<div class='weatherData' id='wd2'><b>Max Temp.</b>: " + temperatureMax_list[day] + "</div>" +
      "<div class='weatherData' id='wd3'><b>Humidity</b>: " + humidity_list[day] + "</div>" +
      "</div>"
    );
  });
}

//fucntion for initializing the Google API which is called in the API call
function GoogleAPIinitialization() {
  var autocomplete = new google.maps.places.SearchBox(document.querySelector("#city"));
  //when a new city is selected using autofill
	autocomplete.addListener('places_changed', function() {
    //update the global variables city_latitude and city_longitude and city_name
    //after new city is selected
	   var place = autocomplete.getPlaces()[0];
     city_latitude = place.geometry.location.lat();
		 city_longitude = place.geometry.location.lng();
     city_name = input_city.val();
	});
}

//function for adding the google API script to the DOM
//This API is used for autofill feature when city is getting selected
function addGoogleAPIscriptToDOM() {
  var google_api = document.createElement('script');
	var api_key = 'AIzaSyDhL2GYz6s7DX_BYSBO8u8qH5Pxkyzh6b4';

	google_api.src = 'https://maps.googleapis.com/maps/api/js?key='+ api_key +'&callback=GoogleAPIinitialization&libraries=places,geometry';
	document.body.appendChild(google_api);
}

//add google API script to DOM
addGoogleAPIscriptToDOM();
