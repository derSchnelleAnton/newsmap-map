import './css/CategoryFilter.css';
import { categoryStyles } from '../../../utils';

function CategoryFilter({ categoryToggle, categoryState }) {
  const stateKeyMapping = {
    Sports: "sports",
    Politics: "politics",
    Culture: "culture",
    Society: "society",
    Mobility: "mobility",
    Environment: "environment",
    "Science and Technology": "scienceAndTechnology",
    Economy: "economy",
    Education: "education",
    "Media and Communication": "mediaAndCommunication",
    Travel: "travel",
    Career: "career",
    "International Relations": "internationalRelations",
    Health: "health",
    Entertainment: "entertainment",
    Celebs: "celebs",
    Nature: "nature",
  };

  return (
    <div className="categoryFilterWrapper">
      {Object.entries(categoryStyles)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([categoryKey, style]) => {
          const stateKey = stateKeyMapping[categoryKey];

          return (
            <SelectAttribute
              key={categoryKey}
              text={categoryKey}
              isChecked={categoryState[stateKey]}
              toggleAction={() => categoryToggle(stateKey)}
              icon={style.emoji}
              color={style.color}
            />
          );
        })}
    </div>
  );
}

function SelectAttribute({ text, isChecked, toggleAction, icon }) {
  return (
    <div className="categoryAttribute" onClick={toggleAction}>
      <div className="icon">{isChecked ? "✅" : "❌"}</div>
      <div className="text">{text}</div>
      <div className="iconEnd">{icon}</div>
    </div>
  );
}

export default CategoryFilter;