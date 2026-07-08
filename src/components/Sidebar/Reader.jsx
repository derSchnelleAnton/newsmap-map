import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/Reader.css';
import { languageEmoji, categoryStyles } from '../../utils';
import { fetchArticleLocations } from '../../data/newsmapApi';

function Reader({ article, onCloseButtonClick, zoomToLocation }) {
  const formattedDate = new Date(article.date_published ?? new Date()).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const headerDate = new Date(article.date_published ?? new Date()).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const importedDate = new Date(article.date_imported ?? new Date()).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const authorsArray = article.authors_list.split(":");
  let authors = "";
  authorsArray.forEach((author, i) => {
    const separator = (i + 1 === authorsArray.length && authorsArray.length !== 1) ? " and " : i === 0 ? "" : ", ";
    authors = authors.concat(separator);
    authors = authors.concat(author);
  });

  const [articleLocations, setArticleLocations] = useState([]);
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await fetchArticleLocations(article.id);
        const locations = response.results;
        setArticleLocations(locations)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(axios.isAxiosError(err) ? err.message : 'Unknown error');
        }
      }
    };
    loadLocations();
  }, [article]);

  const tagsArray = article.tags_list.split(":");
  const categoriesArray = article.categories_list.split(":");
  const locationsArray = article.location_list.split(":");

  const langEmoji = languageEmoji[article.language_code ?? "other"] ?? "🌍";

  return (
    <>
      <div className="reader">
        <div className="header">
          <div className="headerIcon">
            <h2>📰</h2>
          </div>
          <div className="publishedDate">
            <h3>{headerDate}</h3>
          </div>
          <div
            className="readFullArticleButton"
            onClick={() => window.open(article.url, '_blank')}
          >
            <div className="fullArticleIcon">🔗</div>
            <div className="fullarticleText">Visit Article</div>
          </div>
          <div
            className="headerCloseButton"
            onClick={onCloseButtonClick}
          >
            ❌
          </div>
        </div>

        <div className="articleArea">
          <div className="headline">
            <h1>{article.headline}</h1>
          </div>
          <div className="summary">
            {article.summary}
          </div>
          <div className="readerSpacer"></div>

          <div className="infotext">
            Written by {authorsArray.length > 1 ? "👥" : "👤"} {authors},
            published on 🗞️ {article.source_url} in {langEmoji} {
              article.language_name_english === "Other" ? "Other language" : article.language_name_english
            } on 📅 {formattedDate} and imported onto newsmap on 📌 {importedDate} with #️⃣ id {article.id}.
          </div>

          <div className="readerSpacer"></div>
          <div className="readerSpaceNoline"></div>

          <div className="additionalProperties">
            {categoriesArray.map(category => {
              const categoryStyle = categoryStyles[category];
              return (
                <SelectAttribute
                  key={category}
                  text={category}
                  icon={categoryStyle.emoji}
                  attributeColor={categoryStyle.color}
                />
              );
            })}
          </div>

          <div className="additionalProperties">
            {tagsArray.map(tag => (
              <SelectAttributeIconFront
                key={tag}
                text={tag}
                icon={"#️⃣"}
              />
            ))}
          </div>

          <div className="additionalProperties">
            {locationsArray.map(location => {
              const coordinates = articleLocations.filter(e => e.name === location)[0]
              return(
                <SelectAttributeLocation
                  zoomToLocation={zoomToLocation}
                  latitude={coordinates?.latitude ?? undefined}
                  longitude={coordinates?.longitude ?? undefined}
                  key={location}
                  text={location}
                  icon={"📍"}
                />)
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function SelectAttribute({ text, icon, attributeColor }) {
  return (
    <div className="additionalAttribute" style={{borderColor: attributeColor, borderWidth: '2px', borderStyle: 'solid', boxSizing: 'border-box'}}>
      <div className="additionalAttributeText">{text}</div>
      <div className="additionalAttributeIcon">{icon}</div>
    </div>
  );
}

function SelectAttributeLocation({ text, icon, zoomToLocation, latitude, longitude }) {
  return (
    <div className="additionalAttributeLocation" onClick={() => zoomToLocation(latitude, longitude, 8)}>
      <div className="additionalAttributeTextLocation">{text}</div>
      <div className="additionalAttributeIconLocation">{icon}</div>
    </div>
  );
}

function SelectAttributeIconFront({ text, icon }) {
  return (
    <div className="additionalAttribute">
      <div className="additionalAttributeIcon">{icon}</div>
      <div className="additionalAttributeTextFront">{text}</div>
    </div>
  );
}

export default Reader;