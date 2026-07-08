import { useState, useEffect } from 'react';
import './css/Filters.css';
import DateFilter from './DateFilter';
import LocationFilter from './LocationFilter';
import CategoryFilter from './CategoryFilter';

function Filters({ locationToggleProps, categoryToggle, categoryState, dateFilterProps }) {
  return (
    <div className="filtersWrapper">
      <LocationFilter locationToggleProps={locationToggleProps} />
      <DateFilter dateFilterProps={dateFilterProps} />
      <CategoryFilter
        categoryToggle={categoryToggle}
        categoryState={categoryState}
      />
    </div>
  );
}

export default Filters;