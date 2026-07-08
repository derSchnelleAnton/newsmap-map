import './css/DateFilter.css';

function DateFilter({ dateFilterProps }) {
  return (
    <div className="dateFilterOuterWrapper">
      <div className="dateFilterWrapper">
        <div className="dateFilterIcon">⏳</div>
        <div className="dateFilterDescription">Start</div>
        <input
          type="date"
          value={new Date(dateFilterProps?.startDate ?? new Date()).toISOString().split('T')[0]}
          onChange={(e) => dateFilterProps?.handleStartDateChange(new Date(e.target.value))}
          className="dateInputField"
        />
      </div>

      <div className="dateFilterWrapper">
        <div className="dateFilterIcon">⌛️</div>
        <div className="dateFilterDescription">End</div>
        <input
          type="date"
          value={new Date(dateFilterProps?.endDate ?? new Date()).toISOString().split('T')[0]}
          onChange={(e) => dateFilterProps?.handleEndDateChange(new Date(e.target.value))}
          className="dateInputField"
        />
      </div>
    </div>
  );
}

export default DateFilter;