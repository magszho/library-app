import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import './index.css';

interface Room {
  _id: string;
  name: string;
  capacity: number;
}

interface Reservation {
  _id: string;
  room: Room;
  date: Date;
  period: Number;
  user: {
    email: string;
  };
}

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all rooms when component mounts
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/rooms');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  // Fetch reservations when date changes
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        // const dateValue = selectedDate.toISOString().split('T')[0];
        const dateValue = moment(selectedDate).local().format('YYYY-MM-DD');
        console.log("Date value:", dateValue);
        // Fetch reservations for each room
        console.log("Fetching reservations for date:", dateValue);
        const promises = rooms.map(room =>
          fetch(`/reservations?roomStr=${room.name}&dateStr=${dateValue}`)
            .then(res => res.json())
        );
        const results = await Promise.all(promises);
        setReservations(results.flat());
        console.log("Reservations fetched:", results.flat());
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (rooms.length > 0) {
      fetchReservations();
    }
  }, [selectedDate, rooms]);

  // Helper function to get reservations for a specific room and period
  const getReservation = (room: Room, period: Number): Reservation | undefined => {
    if (!room || !period) {
      console.debug("No room, date, or period provided");
      return undefined;
    }
    console.debug("Getting reservation for room:", room._id, "period:", period);
    for (const reservation of reservations) {
      if (room._id === "67979a812eb28f33e6f03ae6" && period === 2) { 
        console.info("room:", reservation.room._id, "date:", reservation.date, "period:", reservation.period, "room:", room._id, "period:", period);
      }
      if (reservation.room._id === room._id && 
          reservation.period === period) {
        console.info("Found reservation:", reservation);
        return reservation;
      }
    }
    return undefined;
  };

  console.log("Reservations:", reservations);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Library Room Reservations</h1>
        
        <div className="mb-6">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date ?? new Date())}
            dateFormat="MMMM d, yyyy"
            className="p-2 border rounded"
          />
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left">Period</th>
                  {rooms.map(room => (  
                    <th key={room._id} className="p-3 text-left">{room.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }, (_, i) => i + 1).map(period => (
                  <tr key={period} className="border-t">
                    <td className="p-3 font-medium">Period {period}</td>
                    {rooms.map(room => (
                      <td key={room._id} className="p-3 text-center">
                        {getReservation(room, period)?.user.email || 
                          <div className="text-sm text-green-700 bg-green-100 rounded p-2 cursor-pointer hover:bg-green-200 transition-colors">
                            Available
                          </div>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
