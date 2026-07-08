import { useState, useEffect } from 'react';
import './css/Info.css';

function Info() {
  return (
    <>
      <div className="titleInfoWrapper">
        <div className="titleWrapper">
          <div className="separatorLine">
            ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗
          </div>
          <div className="banner">
            The News Map Times
          </div>
          <div className="separatorLine">
            ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗ ⪘ ⪗
          </div>
        </div>

        <div className="infoWrapper">
          <div className="infoText">
            <p>This application was created by Anton Wörndle as part of his Bachelors Thesis.</p>
            <p>It is the prototype of a map-based newsreader that gathers news articles from the internet.</p>
            <p>It does not use cookies and it does not try to draw your attention to anything specific.
              The map is designed for you to explore what is happing around the globe and/or in your neighbourhood.</p>
            <p>Contact me at wa7205@mci4me.at.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Info;