import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { DashboardContext } from "./Dashboard";

function EventDetailDialog({ event, onClose, onEdit }) {
  const formatDateTime = (datetime) => {
    return datetime ? new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'short',
      timeStyle: 'short',
      hour12: false
    }).format(new Date(datetime)) : 'N/A';
  };

  const { refreshEvent } = useContext(DashboardContext);

  const handleDelete = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/user/event/${event._id}`);
      setMessage('Event deleted successfully!');
      refreshEvent();
      setTimeout(onClose, 2000); // Close modal after 2 seconds
    } catch (error) {
      setMessage('Error updating event: ' + (error.response?.data || error.message));
    }
  };

  const [message, setMessage] = useState('');


  // Prevent scrolling of the main page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Event Details</h2>
          <div className="flex space-x-4">
            <button onClick={onEdit} title="Edit Event">
              <FaEdit className="text-blue-500 hover:text-blue-700" size={20} />
            </button>
            <button onClick={handleDelete} title="Delete Event">
              <FaTrash className="text-red-500 hover:text-red-700" size={20} />
            </button>
          </div>
        </div>
        {message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{message}</div>}
        <div className="mb-4">
          <label className="block text-sm font-medium">Title:</label>
          <p className="border rounded px-3 py-2">{event.title || "N/A"}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Content:</label>
          <p className="border rounded px-3 py-2">{event.content || "N/A"}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Start Time:</label>
          <p className="border rounded px-3 py-2">{formatDateTime(event.startTime)}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">End Time:</label>
          <p className="border rounded px-3 py-2">{formatDateTime(event.endTime)}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Reminder:</label>
          <p className="border rounded px-3 py-2">
            Days Before: {event.reminder?.daysBefore || "N/A"}
            <br />
            Method: {event.reminder?.method || "N/A"}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Repeat Event:</label>
          <p className="border rounded px-3 py-2">
            {event.repeat ? "Yes" : "No"}
            {event.repeat && (
              <>
                <br />
                Start Date: {formatDateTime(event.repeatRule?.startDate)}
                <br />
                Repeat Frequency: {event.repeatRule?.repeat || "N/A"}
                <br />
                Interval: {event.repeatRule?.interval || "N/A"}
                <br />
                End Date: {formatDateTime(event.repeatRule?.endDate)}
              </>
            )}
          </p>
        </div>
        <div className="flex justify-end">
          <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetailDialog;
