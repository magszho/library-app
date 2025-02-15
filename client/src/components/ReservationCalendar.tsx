import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Reservation {
  _id: string;
  room: {
    name: string;
  };
  date: string;
  period: number;
  user: string;
}

const ReservationCalendar: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReservations = async () => {
    if (!selectedRoom || !selectedDate) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/reservations`, {
        params: {
          roomStr: selectedRoom,
          dateStr: selectedDate,
        }
      });
      setReservations(response.data.reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReservation = async (periodNum: number) => {
    try {
      const response = await axios.post('/api/reservations', {
        roomStr: selectedRoom,
        dateStr: selectedDate,
        periodNum,
        userEmail: 'user@example.com' // You'll need to get this from your auth system
      });
      // Refresh reservations after creating a new one
      fetchReservations();
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <div>
      <h1>Room Reservations</h1>
      
      <div className="controls">
        <select 
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
        >
          <option value="">Select Room</option>
          <option value="Room1">Room 1</option>
          <option value="Room2">Room 2</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <button onClick={fetchReservations}>
          View Reservations
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="reservations-grid">
          {/* You can map through periods 1-8 or however many you need */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map(period => (
            <div key={period} className="period-slot">
              <h3>Period {period}</h3>
              {reservations.find(r => r.period === period) ? (
                <div>Reserved</div>
              ) : (
                <button onClick={() => handleCreateReservation(period)}>
                  Reserve
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationCalendar;
