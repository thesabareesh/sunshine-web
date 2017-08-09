/*
 *   Calls the OpenWeatherMap API and appends the data to the HTML card
 *   Constructor Accepts forecast-details and targetElement as parameters
 */
class GetWeather {

    constructor(params) {
        this.forecastDays = 5;
        this.targetEl = 'weatherCard';
        this.location = params.location;
        this.units = params.units;
        this.displayName = params.cityName;
        this.appid = "1553ba29fdbe693e315bec55b795fc57";
        const formedUrl = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${this.location}&cnt=${this.forecastDays}&units=${this.units}&appid=${this.appid}`;
        this.getForecast(formedUrl, this.displayName);

    }


    /*
     Calls the OpenWeatherMap API for the forecast data
     - Success ? Calls AppendData with response as an argument.
     - Fail    ?  Displays a no-connectivity-icon
     */
    getForecast(formedUrl, cityName) {
        console.log("formedUrl " + formedUrl);
        $.getJSON(formedUrl, (res) => {
            console.log("API response " + JSON.stringify(res));
            this.appendData(res, cityName);

        }).fail((jqXHR, textStatus, errorThrown) => {
            console.log(`Error: ${errorThrown}`);
            console.log(`TextStatus: ${textStatus}`);
            $("." + this.targetEl).append(`<div class="network"><i class="material-icons ">cloud_off</i></div>`);
        });
    }


    returnUpcomingForecast(n) {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const today = (new Date()).getDay();
        let nextDays = [];
        for (let i = 0; i < n; i++) {
            nextDays.push(days[(today + 1 + i) % days.length]);
        }
        return nextDays;
    }

    appendData(res, city) {
        const cityName = city;
        const country = res.city.country;
        const temp = res.list[0].temp.day.toFixed(0);
        const tempMin = res.list[0].temp.min.toFixed(0);
        const tempMax = res.list[0].temp.max.toFixed(0);
        const shortDesc = res.list[0].weather[0].description;

        let html = `<div class="cityContainer cityCard">
            <div class="weatherDesc">${shortDesc}</div>
            <div class="iconTempWrapper">
                <div class="weatherIcon">
                
                </div>
                <div class="tempAndCity">
                  <p class="weatherTemp">${temp}°C</p>
                  <div class="currentMinMax">
                  <p class="currentMax">↑ ${tempMax}°C</p>
                  <p class="currentMin">↓ ${tempMin}°C</p>
                  </div>
                  <p class="cityName">${cityName}, ${country}</p>
                </div>
            </div>
        </div>
        <div class="forecast"></div>`;

        // Append the today's data to the card
        $("." + this.targetEl).append(html);


        //Traverses the list object and appends the forecast to the card
        const upcomingForecast = this.returnUpcomingForecast(4);
        let forecast = upcomingForecast.map((nextDay, i) => {
            return `<div class="forecastCard"><p>${nextDay}</p>
                  <p class="forecastIcons"></p>
                  <p class="forecastMax">${res.list[i+1].temp.max.toFixed(0)}°</p>
                  <p class="forecastMin">${res.list[i+1].temp.min.toFixed(0)}°</p></div>`
        }).join('');
        $('.' + this.targetEl + ' .forecast').append(forecast);

    }

}

$(function() {
    //calls GetWeather class
    new GetWeather({
        location: 'Hyderabad, IN',
        cityName: 'Hyderabad',
        units: 'metric'
    });
});