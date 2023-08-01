using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WeatherAppController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public WeatherAppController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet]
        [Route("coordinates")]
        public async Task<ActionResult> GetCoordinates(string address)
        {
            try
            {
                var encodedAddress = Uri.EscapeDataString(address);
                var httpClient = _httpClientFactory.CreateClient();
                var geoCodeApiUrl = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?format=json&benchmark=2020&format=json&address=" + encodedAddress;
                var geoCodeResponse = await httpClient.GetAsync(geoCodeApiUrl);
                var responseData = geoCodeResponse.Content.ReadAsStringAsync().Result;

                return Ok(responseData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to fetch coordinate Data" + ex.Message });
            }
        }

        [HttpGet]
        [Route("weather")]
        public async Task<ActionResult<IEnumerable<WeatherDataModel>>> GetWeather(string x, string y)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                var productValue = new ProductInfoHeaderValue("WeatherApp", "1.0");
                httpClient.DefaultRequestHeaders.UserAgent.Add(productValue);

                var weatherApiUrl = $"https://api.weather.gov/points/{y},{x}";
                var weatherResponse = await httpClient.GetAsync(weatherApiUrl);
                var weatherData = weatherResponse.Content.ReadAsStringAsync().Result;

                return Ok(weatherData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to fetch weather data. " + ex.Message });
            }
        }
    }
}

