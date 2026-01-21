import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";
import { WeatherCard } from "./WeatherCard";

export const WeatherWidget = () => {
  useRenderCount("WeatherWidget");
  const locationIds = useValue(dashboard$.weather.locationIds);
  const selectedId = useValue(dashboard$.weather.selectedLocationId);

  const selectLocation = (id: string) => {
    dashboard$.weather.selectedLocationId.set(id);
  };

  return (
    <div className="widget weather-widget">
      <h3 className="widget-title">Weather</h3>
      <p className="widget-subtitle">Each location updates independently every 3s</p>
      <div className="weather-tabs">
        {locationIds.map(id => (
          <WeatherTab key={id} locationId={id} isSelected={id === selectedId} onSelect={selectLocation} />
        ))}
      </div>
      <WeatherCard locationId={selectedId} />
    </div>
  );
};

interface WeatherTabProps {
  locationId: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const WeatherTab = ({ locationId, isSelected, onSelect }: WeatherTabProps) => {
  useRenderCount(`WeatherTab-${locationId}`);

  const city = useValue(dashboard$.weather.locations[locationId].city);

  return (
    <button
      className={`weather-tab ${isSelected ? "active" : ""}`}
      onClick={() => onSelect(locationId)}
    >
      {city}
    </button>
  );
};
