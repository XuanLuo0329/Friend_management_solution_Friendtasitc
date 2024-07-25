import React, { useEffect, useRef, useState } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useGet from '../useGet.js';
import axios from 'axios';

const NotificationIcon = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
  const { data: notificationList } = useGet(`${API_BASE_URL}/api/user/notification`, []);

  useEffect(() => setNotifications(notificationList), [notificationList]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleClickOutside = event => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  const dismissNotification = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/user/notification/${id}`);
      setNotifications(notifications.filter(notification => notification._id !== id));
    } catch (error) {
      console.error(`Failed to dismiss notification ${id}:`, error);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={notificationRef} className="fixed bottom-4 right-4 flex flex-col items-end">
      {showNotifications && (
        <div className="mb-3 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
          <ul className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <li className="p-3 text-gray-500">No notifications</li>
            ) : (
              notifications.map(notification => (
                <li
                  key={notification._id}
                  className="p-3 flex justify-between hover:bg-gray-100 transition duration-200"
                >
                  <div>
                    <div className="text-sm font-semibold">{notification.title}</div>
                    <div className="text-xs text-gray-500">{notification.reminderTime}</div>
                    <div className="text-xs text-gray-500">{`Start Time: ${notification.startTime}`}</div>
                    <div className="text-xs">{notification.content}</div>
                  </div>
                  <button
                    onClick={() => dismissNotification(notification._id)}
                    className="ml-2 p-1 text-gray-500 hover:text-red-600 transition duration-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      <button
        onClick={toggleNotifications}
        className="bg-blue-600 p-3 rounded-full text-white shadow-lg hover:bg-blue-700 transition duration-300"
      >
        <BellIcon className="h-6 w-6" />
      </button>
      {notifications.length > 0 && !showNotifications && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
        </span>
      )}
    </div>
  );
};

export default NotificationIcon;
