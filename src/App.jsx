// React
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// External libraries
import L from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

// Styles
import 'leaflet/dist/leaflet.css';
import './App.css';

// Local components
import MarkerWithClick from './components/Sidebar/MarkerWithClick.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';

// Utilities
import {
  fetchLocationsWithFilters,
  fetchArticlePreviewsWithFilters,
  fetchArticleById
} from './data/newsmapApi.js';
import axios from 'axios';

delete L.Icon.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
};

const compareIds = (arrayOne, arrayTwo) => {
  if (!arrayOne || !arrayTwo || arrayOne.length !== arrayTwo.length) {
    return false;
  }
  const idsOne = arrayOne.map(item => item.id).sort().join("-");
  const idsTwo = arrayTwo.map(item => item.id).sort().join("-");
  return idsOne === idsTwo;
};

function App() {
  const [center] = useState({ lat: 42.267130, lng: 11.391391 });
  const [error, setError] = useState(null);
  const [zoomLevel] = useState(4);
  const mapRef = useRef(null);

  const [showMarkerClusterGroup, setShowMarkerClusterGroup] = useState(true);
  const zoomToLocation = useCallback((latitude, longitude, zoom = 10) => {
    if (
      !mapRef.current
      || latitude === undefined || latitude === null
      || longitude === undefined || longitude === null
    ) return;

    const map = mapRef.current;
    setShowMarkerClusterGroup(false);

    map.flyTo([latitude, longitude], zoom, {
      duration: 1,
    });

    const handleMoveEnd = () => {
      setShowMarkerClusterGroup(true);
      map.off('moveend', handleMoveEnd);
    };

    map.on('moveend', handleMoveEnd);
  }, []);

  // Article selection
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Date filter
  const today = useMemo(() => new Date(), []);
  const [endDate, setEndDate] = useState(today);
  const [startDate, setStartDate] = useState(addDays(today, -365));

  // Location selection
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);

  // Toggle states
  const [showCities, setShowCities] = useState(true);
  const [showRegions, setShowRegions] = useState(true);
  const [showCountries, setShowCountries] = useState(true);

  // Category filter
  const [selectedCategories, setSelectedCategories] = useState({
    sports: true,
    politics: true,
    culture: true,
    society: true,
    mobility: true,
    environment: true,
    scienceAndTechnology: true,
    economy: true,
    education: true,
    mediaAndCommunication: true,
    travel: true,
    career: true,
    internationalRelations: true,
    health: true,
    entertainment: true,
    celebs: true,
    nature: true
  });

  // Article previews
  const [articlePreviews, setArticlePreviews] = useState([]);

  // Memoized excluded categories
  const excludedCategories = useMemo(() => {
    const categories = [
      selectedCategories.sports ? null : "Sports",
      selectedCategories.politics ? null : "Politics",
      selectedCategories.culture ? null : "Culture",
      selectedCategories.society ? null : "Society",
      selectedCategories.mobility ? null : "Mobility",
      selectedCategories.environment ? null : "Environment",
      selectedCategories.scienceAndTechnology ? null : "Science and Technology",
      selectedCategories.economy ? null : "Economy",
      selectedCategories.education ? null : "Education",
      selectedCategories.mediaAndCommunication ? null : "Media and Communication",
      selectedCategories.travel ? null : "Travel",
      selectedCategories.career ? null : "Career",
      selectedCategories.internationalRelations ? null : "International Relations",
      selectedCategories.health ? null : "Health",
      selectedCategories.entertainment ? null : "Entertainment",
      selectedCategories.celebs ? null : "Celebs",
      selectedCategories.nature ? null : "Nature",
    ].filter(item => item !== null);
    return categories;
  }, [selectedCategories]);

  // --- Memoized Derived Data ---
  const filteredLocations = useMemo(() => {
    return locations.filter(location => {
      if (!showCities && location.type === 'city') return false;
      if (!showRegions && location.type === 'region') return false;
      if (!showCountries && location.type === 'country') return false;
      return true;
    });
  }, [locations, showCities, showRegions, showCountries]);

  const dateFilterProps = useMemo(() => ({
    startDate,
    endDate,
    handleEndDateChange: setEndDate,
    handleStartDateChange: setStartDate
  }), [startDate, endDate]);

  const locationToggleProps = useMemo(() => ({
    showCities,
    showRegions,
    showCountries,
    toggleCities: () => setShowCities(prev => !prev),
    toggleRegions: () => setShowRegions(prev => !prev),
    toggleCountries: () => setShowCountries(prev => !prev)
  }), [showCities, showRegions, showCountries]);

  const resetArticle = useCallback(() => {
    setSelectedArticleId(null);
    setSelectedArticle(null);
  }, []);

  const toggleCategory = useCallback((propertyName) => {
    setSelectedCategories(prev => ({
      ...prev,
      [propertyName]: !prev[propertyName]
    }));
  }, []);

  const handleItemClick = useCallback((id) => {
    setSelectedArticleId(id);
  }, []);

  useEffect(() => {
    const loadArticle = async () => {
      if (selectedArticleId === null) return;

      try {
        const response = await fetchArticleById(selectedArticleId);
        const articles = response.results;
        setSelectedArticle(articles.length > 0 ? articles[0] : null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(axios.isAxiosError(err) ? err.message : 'Unknown error');
        }
      }
    };
    loadArticle();
  }, [selectedArticleId]);

  // Fetch article previews
  useEffect(() => {
    const loadArticlePreviews = async () => {
      try {
        const previews = await fetchArticlePreviewsWithFilters(
          selectedLocation?.id ?? null,
          excludedCategories.length > 0 ? excludedCategories.join(",") : null,
          startDate.toISOString(),
          endDate.toISOString()
        );
        setArticlePreviews(previews.results ?? []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(axios.isAxiosError(err) ? err.message : 'Unknown error');
        }
      }
    };
    loadArticlePreviews();
  }, [selectedLocation, excludedCategories, startDate, endDate]);

  // Fetch locations
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const ignoreLocations = [
          !showCities ? "city" : null,
          !showRegions ? "region,state,district" : null,
          !showCountries ? "country" : null
        ].filter(Boolean);

        const receivedLocations = await fetchLocationsWithFilters(
          excludedCategories.length > 0 ? excludedCategories.join(",") : null,
          ignoreLocations.length > 0 ? ignoreLocations.join(",") : null,
          startDate.toISOString(),
          endDate.toISOString()
        );

        if (!compareIds(receivedLocations.results, locations) || locations === null) {
          setLocations(receivedLocations.results ?? []);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(axios.isAxiosError(err) ? err.message : 'Unknown error');
        }
      }
    };
    loadLocations();
  }, [showCities, showRegions, showCountries, excludedCategories, startDate, endDate]);

  // --- Render ---
  return (
    <div id="wrapper">
      <div id="mapArea">
        <MapContainer
          id="mapContainer"
          center={center}
          zoom={zoomLevel}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={0}
          worldCopyJump={false}
          noWrap={true}
          minZoom={4}
          maxZoom={10}
          ref={mapRef}
        >
          <TileLayer
            attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
            url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
            subdomains={['a', 'b', 'c']}
          />
          {showMarkerClusterGroup &&
          <MarkerClusterGroup
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            maxClusterRadius={20}
            animate={false}
            key={filteredLocations.length}
            spiderLegPolylineOptions={{ weight: 5 }}
            iconCreateFunction={cluster => {
              const count = cluster.getChildCount();
              return L.divIcon({
                html: `<div style="width: 30px; height: 30px; background-color: white; border-radius: 50%;
                  display: flex; justify-content: center; align-items: center; color: black; font-weight: bold;
                  border: 2px solid black; opacity: 1; transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;">${count}</div>`,
                className: 'custom-cluster-icon',
                iconSize: [30, 30],
              });
            }}
          >
            {filteredLocations.map(location => (
              <MarkerWithClick
                key={location.id}
                location={location}
                setSelectedLocation={setSelectedLocation}
                resetArticle={resetArticle}
              />
            ))}
          </MarkerClusterGroup>
          }
        </MapContainer>
      </div>
      <div id="infoArea">
        <Sidebar
          selectedLocation={selectedLocation}
          articlePreviews={articlePreviews}
          setSelectedLocation={setSelectedLocation}
          locationToggleProps={locationToggleProps}
          categoryToggle={toggleCategory}
          categoryState={selectedCategories}
          dateFilterProps={dateFilterProps}
          selectedArticle={selectedArticle}
          handleItemClick={handleItemClick}
          closeReaderButton={resetArticle}
          zoomToLocation={zoomToLocation}
        />
      </div>
    </div>
  );
}

export default App;