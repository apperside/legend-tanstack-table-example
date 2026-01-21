import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";

interface WeatherCardProps {
  locationId: string;
}

export const WeatherCard = ({ locationId }: WeatherCardProps) => {
  useRenderCount(`WeatherCard-${locationId}`);

  // Fine-grained subscription to this specific location
  const location = useValue(dashboard$.weather.locations[locationId]);

  if (!location) return null;

  const getConditionIcon = (condition: string): string => {
    switch (condition) {
      case "sunny": return "☀️";
      case "cloudy": return "☁️";
      case "rainy": return "🌧️";
      case "stormy": return "⛈️";
      case "snowy": return "❄️";
      default: return "🌤️";
    }
  };

  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className="weather-card">
      <div className="weather-main">
        <div className="weather-icon">{getConditionIcon(location.current.condition)}</div>
        <div className="weather-temp">{location.current.temperature}°F</div>
        <div className="weather-condition">{location.current.condition}</div>
      </div>
      <div className="weather-details">
        <div className="weather-detail">
          <span className="detail-label">Feels Like</span>
          <span className="detail-value">{location.current.feelsLike}°F</span>
        </div>
        <div className="weather-detail">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{location.current.humidity}%</span>
        </div>
        <div className="weather-detail">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{location.current.windSpeed} mph</span>
        </div>
      </div>
      <div className="weather-location">
        <span>{location.city}, {location.country}</span>
        <span className="weather-updated">Updated {getTimeAgo(location.lastUpdated)}</span>
      </div>
    </div>
  );
};
