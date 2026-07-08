import { useState, useEffect } from 'react';
import './css/Itemlist.css';
import { languageEmoji, categoryStyles } from '../../utils';

import { motion, AnimatePresence } from 'framer-motion';

function Itemlist({ items, title, setSelectedLocation, handleItemClick }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${title}-${items.length}`}
        className="itemList"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className='header'>
          <div className="headerIcon"><h2>📍</h2></div>
          <div className='headerText'><h2>{title ?? "Articles"}</h2></div>
          <div className="headerCloseButton" onClick={() => setSelectedLocation(null)}>❌</div>
        </div>
        <div className='list'>
          {items.sort((a, b) => new Date(b.date_published) - new Date(a.date_published)).map(item => {
            const headline = item.headline.substring(0, Math.min(85, item.headline.length))
              .concat(item.headline.length >= 85 ? "..." : "");
            return (
              <ItemlistItem
                handleItemClick={handleItemClick}
                text={headline}
                date={item.date_published}
                language={item.language_code}
                sourceUrl={item.source_url}
                articleUrl={item.url}
                categories={item.categories_list.split(":") ?? "Global News"}
                languageNameNative={item.language_name_native}
                languageNameEnglish={item.language_name_english}
                articleId={item.id}
              />
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ItemlistItem({
  text, date, language, languageNameNative, languageNameEnglish, sourceUrl, articleUrl, categories, handleItemClick, articleId
}) {
  const formattedDate = new Date((date ?? new Date())).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const langEmoji = languageEmoji[language ?? "other"] ?? "🌍";
  const selectedStyles = categories.map(item => categoryStyles[item] ?? { color: "#f700ff", emoji: "🎾" });
  const emojis = selectedStyles.map(item => item.emoji);
  const colors = selectedStyles.map(item => item.color);
  const pieceSize = 360 / colors.length;

  var pieces = `conic-gradient(from ${(360 / colors.length) * ((colors.length === 2) ? 1 : 2)}deg at 50% 50%,`;
  colors.forEach((color, i) => {
    const startDegrees = i * pieceSize;
    const endDegrees = startDegrees + pieceSize;
    pieces = pieces.concat(`${color} ${startDegrees}deg ${endDegrees}deg`);
    if (i + 1 !== colors.length) {
      pieces = pieces.concat(", ");
    }
  });
  pieces = pieces.concat(")");

  return (
    <div className='item'>
      <div className="icon" style={{ background: pieces }} onClick={() => handleItemClick(articleId)}>
        <ItemIcons icons={emojis} />
      </div>
      <div className="description">
        <div className="text" onClick={() => handleItemClick(articleId)}>{text}</div>
        <div className="infoBox">
          <div className='date' onClick={() => handleItemClick(articleId)}>{formattedDate}</div>
          <div className="spacer" onClick={() => handleItemClick(articleId)}/>
          <div className="source">
            <a
              href={articleUrl} target="_blank"
              title={"View full article in " + languageNameNative + ", " + languageNameEnglish}
            >Full article</a>
          </div>
          <div className="langIcon" title={languageNameNative + ", " + languageNameEnglish}>{langEmoji}</div>
        </div>
      </div>
    </div>
  );
}

function ItemIcons({ icons }) {
  return (
    <div className='iconBox'>
      {icons.map(icon => <div className="singleIconBox">{icon}</div>)}
    </div>
  );
}

export default Itemlist;