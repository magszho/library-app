import React from 'react';
import { Reservation } from '../types';
import moment from 'moment';

interface MyReservationsProps {
  reservations: Reservation[];
  userEmail: string;
}

export const MyReservations: React.FC<MyReservationsProps> = ({ 
  reservations,
  userEmail
}) => {
  const myReservations = reservations.filter(r => r.user.email === userEmail);

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-xl mb-4">My Reservations</h2>
      {myReservations.length === 0 ? (
        <p className="text-gray-500">You have no reservations.</p>
      ) : (
        <div className="bg-white rounded-lg shadow">
          {myReservations.map(reservation => (
            <div 
              key={reservation._id} 
              className="p-4 border-b last:border-b-0"
            >
              <div className="font-medium">Room {reservation.room.name}</div>
              <div className="text-sm text-gray-600">
                Date: {moment(reservation.date).format('MMMM D, YYYY')}
              </div>
              <div className="text-sm text-gray-600">
                Period: {reservation.period.toString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 