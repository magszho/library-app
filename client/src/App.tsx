import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './index.css';
import { Room, Reservation } from './types';
import { DateSelector } from './components/DateSelector';
import { ReservationTable } from './components/ReservationTable';
import { BookingForm } from './components/BookingForm';

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ room: Room; period: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const dateValue = moment(selectedDate).local().format('YYYY-MM-DD');
      const promises = rooms.map(room =>
        fetch(`/reservations?roomStr=${room.name}&dateStr=${dateValue}`)
          .then(res => res.json())
      );
      const results = await Promise.all(promises);
      setReservations(results.flat());
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const makeReservation = async (roomStr: string, dateStr: string, periodNum: number, userEmail: string) => {
    try {
      console.log("Making reservation for room:", roomStr, "date:", dateStr, "period:", periodNum, "user:", userEmail);
      const response = await fetch('/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomStr,
          dateStr, 
          periodNum,
          userEmail
        })
      });

      if (!response.ok) {
        throw new Error('Failed to make reservation: ' + response.statusText);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error making reservation:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (rooms.length > 0) {
      fetchReservations();
    }
  }, [selectedDate, rooms]);

  /** helper function to get reservations for a specific room and period */
  const getReservation = (room: Room, period: Number): Reservation | undefined => {
    if (!room || !period) {
      console.debug("No room, date, or period provided");
      return undefined;
    }
    console.debug("Getting reservation for room:", room._id, "period:", period);
    for (const reservation of reservations) {
      if (reservation.room._id === room._id && 
          reservation.period === period) {
        console.info("Found reservation:", reservation);
        return reservation;
      }
    }
    return undefined;
  };

  /** helper function to handle a booking */
  const handleBooking = async (room: Room, period: number) => {
    setSelectedSlot({ room, period });  // Remember which slot was clicked
    setFormOpen(true);  // Show the booking form
  };

  /** helper function when the form is submitted to handle the room reservation */
  const handleFormSubmit = async ({ email }: { email: string }) => {
    if (!selectedSlot) return;

    try {
      const dateStr = moment(selectedDate).local().format('YYYY-MM-DD');
      const responseData = await makeReservation(
        selectedSlot.room.name,
        dateStr,
        selectedSlot.period,
        email
      );
      console.log("Response data:", responseData);

      setFormOpen(false);
      fetchReservations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book reservation');
      console.error('Booking error:', err);
    }
  };

  // console.log("Reservations:", reservations);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Library Room Reservations</h1>
        
        <DateSelector 
          selectedDate={selectedDate}
          onChange={(date) => setSelectedDate(date ?? new Date())}
        />

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <ReservationTable 
            rooms={rooms}
            getReservation={getReservation}
            onSlotClick={handleBooking}
          />
        )}
      </div>

      {/* Show the booking form if a slot was selected */}
      {selectedSlot && (
        <BookingForm
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          room={selectedSlot.room}
          period={selectedSlot.period}
        />
      )}
    </div>
  );
}

export default App;
