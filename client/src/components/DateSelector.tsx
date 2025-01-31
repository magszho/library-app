import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DateSelectorProps {
  selectedDate: Date;
  onChange: (date: Date | null) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onChange }) => (
  <div className="mb-6">
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      dateFormat="MMMM d, yyyy"
      className="p-2 border rounded"
    />
  </div>
); 