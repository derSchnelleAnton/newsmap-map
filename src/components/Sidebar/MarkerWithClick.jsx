import React, { useRef, useCallback, useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { countriesWithFlags } from '../../utils';

const MarkerWithClick = ({ location, setSelectedLocation, resetArticle }) => {
  const markerRef = useRef(null);

  const { locationSymbol, locationColor } = useMemo(() => {
    let symbol, color;

    if (location.location_type === "country") {
      symbol = countriesWithFlags[location.name] ?? "❓";
      color = "#ffffff";
    } else if (location.location_type === "state" || location.location_type === "district" || location.location_type == "region") {
      symbol = "🗺️";
      color = "#33a1ff";
    } else if (location.location_type === "city") {
      symbol = "🏘️";
      color = "#FF5733";
    } else {
      symbol = "?";
      color = "#FF5733";
    }

    return { locationSymbol: symbol, locationColor: color };
  }, [location.location_type, location.name]);

  const customIcon = useMemo(() => {
    return createCustomIcon(locationColor, locationSymbol, 30);
  }, [locationColor, locationSymbol]);

  const handleClick = useCallback(() => {
    setSelectedLocation(location);
    resetArticle();
  }, [location, setSelectedLocation, resetArticle]);

  const handleMouseOver = useCallback(() => {
    if (markerRef.current) markerRef.current.openPopup();
  }, []);

  const handleMouseOut = useCallback(() => {
    if (markerRef.current) markerRef.current.closePopup();
  }, []);

  return (
    <Marker
      ref={markerRef}
      position={[location.latitude, location.longitude]}
      icon={customIcon}
      eventHandlers={{
        click: handleClick,
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
      }}
    >
      <Popup>
        <div>{location.name}</div>
      </Popup>
    </Marker>
  );
};

export const createCustomIcon = (color, label, size) => {
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        font-size: 18px;
        line-height: ${size}px;
        opacity: 1; /* Standard-Opacity */
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      ">
        ${label}
      </div>
    `,
    className: 'custom-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export default React.memo(MarkerWithClick);