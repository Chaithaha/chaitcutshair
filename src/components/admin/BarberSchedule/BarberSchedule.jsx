import { useState, useEffect } from 'react';
import { getBarberSchedules, updateSchedule } from '../../../lib/supabaseClient';
import './BarberSchedule.css';

const BarberSchedule = ({ barber, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [editData, setEditData] = useState({ isAvailable: true, startTime: '09:00', endTime: '18:00' });

  useEffect(() => {
    loadSchedules();
  }, [barber.id, currentDate]);

  const loadSchedules = async () => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const firstDay = `${year}-${month}-01`;
    const lastDay = `${year}-${month}-31`;

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
            const isSunday = day && new Date(year, currentDate.getMonth(), day).getDay() === 0;

            return (
              <button
                key={i}
                className={`barber-schedule__day ${
                  !day ? 'barber-schedule__day--empty' : ''
                } ${
                  isSunday ? 'barber-schedule__day--sunday' : ''
                } ${
                  schedule && !schedule.is_available ? 'barber-schedule__day--unavailable' : ''
                }`}
                onClick={() => handleDayClick(day)}
                disabled={!day || isSunday}
              >
                {day || ''}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <div className="barber-schedule__edit">
            <h3>{new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>

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
