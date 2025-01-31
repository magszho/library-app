import React from 'react';
import { Room, Reservation } from '../types';

interface ReservationTableProps {
  rooms: Room[];
  getReservation: (room: Room, period: Number) => Reservation | undefined;
  onSlotClick: (room: Room, period: number) => void;
}

export const ReservationTable: React.FC<ReservationTableProps> = ({ 
  rooms, 
  getReservation,
  onSlotClick 
}) => (
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
                  <div 
                    onClick={() => onSlotClick(room, period)}
                    className="text-sm text-green-700 bg-green-100 rounded p-2 cursor-pointer hover:bg-green-200 transition-colors"
                  >
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
); 