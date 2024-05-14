import React, { useState } from "react";
import "./Calendar.css";

interface Day {
  date: Date | null;
}

interface Month {
  monthIdx: number;
  year: number;
}

// Hard code for 6 months
const monthNames = ["May", "June", "July", "August", "September", "October"];

// Function to generate days in months
const generateDays = (month: number, year: number): Day[] => {
  const days: Day[] = [];
  const firstDayOfMonth: Date = new Date(year, month, 1);
  const lastDayOfMonth: Date = new Date(year, month + 1, 0);
  const daysInMonth: number = lastDayOfMonth.getDate();
  const firstDay: number = firstDayOfMonth.getDay();

  // Fill in blank before actual first day of month
  for (let i = 0; i < firstDay; i++) {
    days.push({ date: null });
  }

  // Fill in days in month
  for (let day = 1; day <= daysInMonth; day++) {
    const date: Date = new Date(year, month, day);
    days.push({ date });
  }

  return days;
};

const Calendar: React.FC = () => {
  // Use monthIdx to enable change on months, flexibility
  const months: Month[] = [
    { monthIdx: 0, year: 2024 },
    { monthIdx: 1, year: 2024 },
    { monthIdx: 2, year: 2024 },
    { monthIdx: 3, year: 2024 },
    { monthIdx: 4, year: 2024 },
    { monthIdx: 5, year: 2024 },
  ];
  // Used for date selection
  const [firstSelected, setFirstSelected] = useState<Date | null>(null);
  const [secondSelected, setSecondSelected] = useState<Date | null>(null);

  const handleDateClick = (date: Date): void => {
    if (!firstSelected) {
      // If no date is selected, set the first date
      setFirstSelected(date);
      setSecondSelected(null);
    } else if (!secondSelected) {
      // If the first date is already selected and the second is not,
      // check if the selected date is within 7 days of the first
      const difference = Math.abs(
        (date.getTime() - firstSelected.getTime()) / (1000 * 3600 * 24)
      );
      if (difference <= 7) {
        // If the date is within 7 days, set as the second selected date
        setSecondSelected(date);
      } else {
        // If the date is not within 7 days, reset the selection to start with this new date
        setFirstSelected(date);
        setSecondSelected(null);
      }
    } else {
      // If both dates are already selected, restart the selection process with the new date
      setFirstSelected(date);
      setSecondSelected(null);
    }
  };

  // Function to see if start and end date are in 7 days
  const isInRange = (date: Date): boolean => {
    if (!firstSelected) return false;
    if (!secondSelected) return date.getTime() === firstSelected.getTime();

    const start =
      firstSelected < secondSelected ? firstSelected : secondSelected;
    const end = firstSelected < secondSelected ? secondSelected : firstSelected;

    const difference =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    return difference <= 7 && date >= start && date <= end;
  };

  const isHead = (date: Date): boolean => {
    if (!firstSelected) return false;
    if (!secondSelected) return date.getTime() === firstSelected.getTime();

    const start =
      firstSelected < secondSelected ? firstSelected : secondSelected;
    return date.getTime() === start.getTime();
  };

  const isEnd = (date: Date): boolean => {
    if (!firstSelected) return false;
    if (!secondSelected) return date.getTime() === firstSelected.getTime();

    const end = firstSelected < secondSelected ? secondSelected : firstSelected;
    return date.getTime() === end.getTime();
  };
  return (
    <div className="calendar">
      <div className="calendar-weekdays sticky">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={day}
            className={`calendar-day-header ${index === 0 ? "sunday" : ""}`}
          >
            {day.slice(0, 1)}
          </div>
        ))}
      </div>
      <div className="calendar-scroll">
        {months.map(({ monthIdx: month, year }, index) => (
          <div key={index} className="calendar-month">
            <div className="calendar-header sticky">{`${monthNames[month]} ${year}`}</div>
            <div className="calendar-grid">
              {generateDays(month, year).map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day  ${
                    day.date && day.date.getDay() === 0 ? "sunday" : ""
                  } ${day.date && isInRange(day.date) ? "highlight" : ""}
                  ${day.date && isHead(day.date) ? "selection-head" : ""}
                  ${day.date && isEnd(day.date) ? "selection-end" : ""}
                  `}
                  onClick={() => {
                    if (day.date) handleDateClick(day.date);
                  }}
                >
                  {day.date && day.date.getDate()}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
