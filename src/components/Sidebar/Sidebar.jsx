import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import './css/Sidebar.css';

import Info from './Info';
import Itemlist from './Itemlist';
import Filters from './Filter/Filters';
import Reader from './Reader';

function Sidebar({
  selectedArticle,
  articlePreviews,
  selectedLocation,
  setSelectedLocation,
  locationToggleProps,
  categoryToggle,
  categoryState,
  dateFilterProps,
  handleItemClick,
  closeReaderButton,
  zoomToLocation
}) {
  return (
    <div className="sidebarWrapper">
      <div className="infoContainer">
        <Info />
      </div>

      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            className="mainContainer"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 40, stiffness: 300 }}
          >
            <Itemlist
              items={articlePreviews}
              title={selectedLocation.name}
              setSelectedLocation={setSelectedLocation}
              handleItemClick={handleItemClick}
            />

            <AnimatePresence>
              {selectedArticle && (
                <motion.div
                  className="readerContainer"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 40, stiffness: 300 }}
                >
                  <Reader
                    article={selectedArticle}
                    onCloseButtonClick={closeReaderButton}
                    zoomToLocation={zoomToLocation}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!selectedLocation && (
          <motion.div
            className="filterContainer"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 40, stiffness: 300 }}
          >
            <Filters
              locationToggleProps={locationToggleProps}
              categoryToggle={categoryToggle}
              categoryState={categoryState}
              dateFilterProps={dateFilterProps}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Sidebar;