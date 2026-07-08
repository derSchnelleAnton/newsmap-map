import { useState, useRef, useEffect } from 'react';
import './css/LocationFilter.css';

function LocationFilter({ locationToggleProps }) {
  return (
    <div className="locationFilterWrapper">
      <SelectAttribute
        text="Cities"
        show={locationToggleProps.showCities}
        select={locationToggleProps.toggleCities}
      />
      <SelectAttribute
        text="Regions"
        show={locationToggleProps.showRegions}
        select={locationToggleProps.toggleRegions}
      />
      <SelectAttribute
        text="Countries"
        show={locationToggleProps.showCountries}
        select={locationToggleProps.toggleCountries}
      />
    </div>
  );
}

function SelectAttribute({ text, show, select }) {
  return (
    <div className="attribute" onClick={select}>
      <div className="icon">{show ? "✅" : "❌"}</div>
      <div className="text">{text}</div>
    </div>
  );
}

export default LocationFilter;