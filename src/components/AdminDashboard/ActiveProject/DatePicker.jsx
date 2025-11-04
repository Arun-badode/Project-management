import React from 'react';

const DatePicker = () => {
    return (
        <div>
              <div className="max-w-md mx-auto">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={formatDateTime()}
                                                    readOnly
                                                    onClick={() => setIsOpen(!isOpen)}
                                                    className="bg-card w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                                                    placeholder="Select date and time"
                                                />
                                            </div>

                                            {isOpen && (
                                                <div className="calendar-dropdown">
                                                    <div className="time-display">
                                                        <div className="time">
                                                            {selectedHour.toString().padStart(2, "0")}:
                                                            {selectedMinute.toString().padStart(2, "0")}
                                                        </div>
                                                        <div className="period">{isAM ? "AM" : "PM"}</div>
                                                        <div className="date">
                                                            {months[selectedMonth].substring(0, 3)},{" "}
                                                            {selectedYear}
                                                        </div>
                                                    </div>

                                                    <div className="time-calendar-container">
                                                        <div className="time-selector">
                                                            <div className="time-column">
                                                                <div className="time-column-label">Hour</div>
                                                                <div className="time-scroll">
                                                                    <div className="time-options">
                                                                        {[
                                                                            12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                                                                        ].map((hour) => (
                                                                            <button
                                                                                key={hour}
                                                                                onClick={() => setSelectedHour(hour)}
                                                                                className={`time-option ${selectedHour === hour
                                                                                    ? "selected-hour"
                                                                                    : ""
                                                                                    }`}
                                                                            >
                                                                                {hour.toString().padStart(2, "0")}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="time-column">
                                                                <div className="time-column-label">Min</div>
                                                                <div className="time-scroll">
                                                                    <div className="time-options">
                                                                        {[0, 15, 30, 45].map((minute) => (
                                                                            <button
                                                                                key={minute}
                                                                                onClick={() =>
                                                                                    setSelectedMinute(minute)
                                                                                }
                                                                                className={`time-option ${selectedMinute === minute
                                                                                    ? "selected-minute"
                                                                                    : ""
                                                                                    }`}
                                                                            >
                                                                                {minute.toString().padStart(2, "0")}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="time-column">
                                                                <div className="time-column-label">
                                                                    Period
                                                                </div>
                                                                <div className="period-options">
                                                                    <button
                                                                        onClick={() => setIsAM(true)}
                                                                        className={`period-option ${isAM ? "selected" : ""
                                                                            }`}
                                                                    >
                                                                        AM
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setIsAM(false)}
                                                                        className={`period-option ${!isAM ? "selected" : ""
                                                                            }`}
                                                                    >
                                                                        PM
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="calendar-section">
                                                            <div className="month-nav">
                                                                <button onClick={handlePrevMonth}>
                                                                    <ChevronLeft size={20} />
                                                                </button>
                                                                <h3>
                                                                    {months[selectedMonth]}, {selectedYear}
                                                                </h3>
                                                                <button onClick={handleNextMonth}>
                                                                    <ChevronRight size={20} />
                                                                </button>
                                                            </div>

                                                            <div className="weekdays">
                                                                {weekDays.map((day) => (
                                                                    <div key={day} className="weekday">
                                                                        {day}
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <div className="calendar-grid">
                                                                {calendarDays.map((dayObj, index) => (
                                                                    <button
                                                                        key={index}
                                                                        onClick={() =>
                                                                            dayObj.isCurrentMonth &&
                                                                            setSelectedDate(dayObj.day)
                                                                        }
                                                                        className={`calendar-day ${dayObj.isCurrentMonth
                                                                            ? selectedDate === dayObj.day
                                                                                ? "current-month selected"
                                                                                : "current-month"
                                                                            : "other-month"
                                                                            }`}
                                                                    >
                                                                        {dayObj.day}
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            <div className="action-buttons">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedDate(new Date().getDate());
                                                                        setSelectedMonth(new Date().getMonth());
                                                                        setSelectedYear(new Date().getFullYear());
                                                                    }}
                                                                    className="action-button"
                                                                >
                                                                    Clear
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const today = new Date();
                                                                        setSelectedDate(today.getDate());
                                                                        setSelectedMonth(today.getMonth());
                                                                        setSelectedYear(today.getFullYear());
                                                                    }}
                                                                    className="action-button"
                                                                >
                                                                    Today
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="done-section">
                                                        <button
                                                            onClick={() => setIsOpen(false)}
                                                            className="done-button"
                                                        >
                                                            Done
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
        </div>
    );
}

export default DatePicker;
