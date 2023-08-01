namespace WebApplication1.Models
{
    public class WeatherDataModel
    {
        public string Name { get; set; }
        public string Temperature { get; set; }
        public string DetailedForecast { get; set; }
    }
    public class WeatherApiResponse
    {
        public WeatherProperties Properties { get; set; }
    }

    public class WeatherProperties
    {
        public List<WeatherDataModel> Periods { get; set; }
    }

}
