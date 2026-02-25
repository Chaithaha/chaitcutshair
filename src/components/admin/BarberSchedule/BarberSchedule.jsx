import { useState, useEffect } from 'react';
import { getBarberSchedules, updateSchedule, getWeeklyAvailability } from '../../../lib/supabaseClient';
import './BarberSchedule.css';

const BarberSchedule = ({ barber, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState({});
  const [weeklyAvailability, setWeeklyAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [editData, setEditData] = useState({ isAvailable: true, startTime: '09:00', endTime: '18:00' });

  useEffect(() => {
    loadSchedules();
    loadWeeklyAvailability();
  }, [barber.id, currentDate]);

  const loadWeeklyAvailability = async () => {
    try {
      const data = await getWeeklyAvailability(barber.id);
      const availabilityMap = {};
      data.forEach(a => {
        availabilityMap[a.day_of_week] = a;
      });
      setWeeklyAvailability(availabilityMap);
    } catch (err) {
      console.error('Failed to load weekly availability:', err);
    }
  };

  const loadSchedules = async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    // Get the actual last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDay = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`;

    try {
      const data = await getBarberSchedules(barber.id, firstDay, lastDay);
      const scheduleMap = {};
      data.forEach(s => {
        scheduleMap[s.date] = s;
      });
      setSchedules(scheduleMap);
    } catch (err) {
      console.error('Failed to load schedules:', err);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }

    return days;
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`;
    const schedule = schedules[dateStr];

    setSelectedDate(dateStr);
    setEditData({
      isAvailable: schedule?.is_available ?? true,
      startTime: schedule?.start_time?.substring(0, 5) || '09:00',
      endTime: schedule?.end_time?.substring(0, 5) || '18:00',
    });
  };

  const handleSaveSchedule = async () => {
    try {
      await updateSchedule(barber.id, selectedDate, {
        is_available: editData.isAvailable,
        start_time: editData.isAvailable ? editData.startTime : null,
        end_time: editData.isAvailable ? editData.endTime : null,
      });
      await loadSchedules();
      setSelectedDate(null);
    } catch (err) {
      alert('Failed to update schedule');
    }
  };

  const handleMonthChange = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="barber-schedule__overlay" onClick={onClose}>
      <div className="barber-schedule" onClick={(e) => e.stopPropagation()}>
        <div className="barber-schedule__header">
          <h2 className="barber-schedule__title">
            {barber.first_name} {barber.last_name} — Schedule
          </h2>
          <button className="barber-schedule__close" onClick={onClose}>✕</button>
        </div>

        <div className="barber-schedule__calendar-header">
          <button onClick={() => handleMonthChange(-1)}>{'<'}</button>
          <span className="barber-schedule__month">{monthName.toUpperCase()}</span>
          <button onClick={() => handleMonthChange(1)}>{'>'}</button>
        </div>

        <div className="barber-schedule__weekdays">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="barber-schedule__weekday">{day}</div>
          ))}
        </div>

        <div className="barber-schedule__days">
          {days.map((day, i) => {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const dateStr = day ? `${year}-${month}-${String(day).padStart(2, '0')}` : null;
            const schedule = dateStr ? schedules[dateStr] : null;
            const dayOfWeek = day ? new Date(year, currentDate.getMonth(), day).getDay() : null;
            const weeklyAvail = dayOfWeek !== null ? weeklyAvailability[dayOfWeek] : null;
            const isSunday = dayOfWeek === 0;

            // Determine day status for styling:
            // - red: schedule set and unavailable
            // - orange: schedule set and available
            // - green: in weekly availability (default working day)
            // - red: not in weekly availability and no schedule
            const getDayStatus = () => {
              if (!day) return '';
              if (schedule) {
                if (!schedule.is_available) return 'barber-schedule__day--unavailable'; // red - explicitly unavailable
                return 'barber-schedule__day--scheduled'; // orange - schedule set and available
              }
              if (weeklyAvail?.is_available) return 'barber-schedule__day--available'; // green - default available
              return 'barber-schedule__day--unavailable'; // red - not available
            };

            return (
              <button
                key={i}
                className={`barber-schedule__day ${
                  !day ? 'barber-schedule__day--empty' : ''
                } ${
                  isSunday ? 'barber-schedule__day--sunday' : ''
                } ${getDayStatus()}`}
                onClick={() => handleDayClick(day)}
                disabled={!day || isSunday}
              >
                {day || ''}
              </button>
            );
          })}
        </div>

        <div className="barber-schedule__legend">
          <div className="barber-schedule__legend-item">
            <span className="barber-schedule__legend-color barber-schedule__legend-color--available"></span>
            <span>Available</span>
          </div>
          <div className="barber-schedule__legend-item">
            <span className="barber-schedule__legend-color barber-schedule__legend-color--scheduled"></span>
            <span>Schedule Set</span>
          </div>
          <div className="barber-schedule__legend-item">
            <span className="barber-schedule__legend-color barber-schedule__legend-color--unavailable"></span>
            <span>Unavailable</span>
          </div>
        </div>

        {selectedDate && (
          <div className="barber-schedule__edit">
            <h3>{(() => {
              const [year, month, day] = selectedDate.split('-');
              const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
              return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            })()}</h3>

            <div className="barber-schedule__field">
              <label>Available</label>
              <select
                value={editData.isAvailable ? 'yes' : 'no'}
                onChange={(e) => setEditData({ ...editData, isAvailable: e.target.value === 'yes' })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {editData.isAvailable && (
              <>
                <div className="barber-schedule__field">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={editData.startTime}
                    onChange={(e) => setEditData({ ...editData, startTime: e.target.value })}
                  />
                </div>
                <div className="barber-schedule__field">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={editData.endTime}
                    onChange={(e) => setEditData({ ...editData, endTime: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="barber-schedule__actions">
              <button className="barber-schedule__cancel" onClick={() => setSelectedDate(null)}>
                Cancel
              </button>
              <button className="barber-schedule__save" onClick={handleSaveSchedule}>
                Save
              </button>
            </div>
          </div>
        )}

        <div className="barber-schedule__footer">
          <button className="barber-schedule__back" onClick={onClose}>
            ← Back to Barbers
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarberSchedule;
