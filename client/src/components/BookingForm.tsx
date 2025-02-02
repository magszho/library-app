import React, { useState } from 'react';
import { Room } from '../types';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void; 
  onSubmit: () => void;
  room: Room;
  period: number;
}

export const BookingForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  room, 
  period 
}: BookingFormProps) => {
  if (!isOpen) return null; // dont show stuff if form isnt open

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // prevent the page from refreshing
    onSubmit();  // give the email to the parent component
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Book {room.name}</h2>
        <p className="mb-4">Period {period}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 