import React, { useState } from "react";
import NewEventDialog from "./NewEventDialog";
import EventDetailDialog from "./EventDetailDialog";
import EditEventDialog from "./EditEventDialog";
import Notification from "./Notification";
import useGet from "../useGet";

export const DashboardContext = React.createContext({});

// FriendCard Component
function FriendCard({ name, relationship }) {
  return (
    <div className="border rounded-lg shadow-lg p-4 bg-white cursor-pointer">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{name}</h2>
        <span className="text-xs bg-blue-200 text-blue-800 rounded px-2 py-1">Birthday</span>
      </div>
      <p className="text-sm text-gray-600">{relationship}</p>
    </div>
  );
}

// EventCard Component
function EventCard({ title, content, onClick }) {
  return (
    <div className="border rounded-lg shadow-lg p-4 bg-white cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-xs bg-green-200 text-green-800 rounded px-2 py-1">Event</span>
      </div>
      <p className="text-sm text-gray-600">{content}</p>
    </div>
  );
}

// DateSection Component
function DateSection({ date, items, onEventClick }) {
  return (
    <div className="mb-8">
      <div className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-300">{date}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, index) =>
          item.type === "friend" ? (
            <FriendCard key={index} name={item.name} relationship={item.relationship} />
          ) : (
            <EventCard key={index} title={item.title} content={item.content} onClick={() => onEventClick(item)} />
          )
        )}
      </div>
    </div>
  );
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
  }).format(date);
}

// Helper function to create a Date object based on the current year for a given month and day
function toCurrentYearDate(month, day) {
  const today = new Date();
  const year = today.getFullYear();
  return new Date(year, month - 1, day);
}

// Helper function to get today's date with time set to 00:00:00
function getTodayWithZeroTime() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// Function to add months to a date
function addMonths(date, months) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

// Generate occurrences for repeat events within a date range
function generateOccurrences(event, startDate, endDate) {
  const occurrences = [];
  const { repeatRule } = event;
  const start = new Date(repeatRule.startDate);
  const interval = repeatRule.interval || 1;
  const repeatFrequency = repeatRule.repeat;
  let nextOccurrence = new Date(Math.max(start, startDate));

  while (nextOccurrence <= endDate) {
    occurrences.push({
      ...event,
      startTime: new Date(nextOccurrence),
      endTime: event.endTime ? new Date(new Date(nextOccurrence).getTime() + (new Date(event.endTime).getTime() - new Date(event.startTime).getTime())) : null,
      date: new Date(nextOccurrence),
    });

    switch (repeatFrequency) {
      case 'daily':
        nextOccurrence.setDate(nextOccurrence.getDate() + interval);
        break;
      case 'weekly':
        nextOccurrence.setDate(nextOccurrence.getDate() + interval * 7);
        break;
      case 'monthly':
        nextOccurrence.setMonth(nextOccurrence.getMonth() + interval);
        break;
      case 'yearly':
        nextOccurrence.setFullYear(nextOccurrence.getFullYear() + interval);
        break;
      default:
        break;
    }
  }

  return occurrences.filter(occurrence => occurrence.startTime <= endDate);
}

function Dashboard() {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleCloseDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  const handleEditClick = () => {
    setShowEventDetails(false);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedEvent(null);
  };


  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
  const { data: events, mutate: refreshEvent } = useGet(`${API_BASE_URL}/api/user/event`, []);
  const { data: friends } = useGet(`${API_BASE_URL}/api/user/friend`, []);

  // Normalize dates and merge lists
  const today = getTodayWithZeroTime();
  const sixMonthsLater = addMonths(today, 6);
  // Filter regular events and generate occurrences for repeat events
  const regularEvents = (events || []).filter(e => {
    const eventDate = new Date(e.startTime);
    return eventDate >= today && eventDate <= sixMonthsLater;
  });

  const repeatEvents = (events || []).filter(e => e.repeat).flatMap(e => generateOccurrences(e, today, sixMonthsLater));

  const allItems = [
    ...friends
      .map(f => {
        const [year, month, day] = f.birthday.split('T')[0].split('-');
        return {
          ...f,
          type: 'friend',
          date: toCurrentYearDate(month, day),
        };
      })
      .filter(f => f.date >= today && f.date <= sixMonthsLater),
    ...regularEvents.map(e => ({ ...e, type: 'event', date: new Date(e.startTime) })),
    ...repeatEvents.map(e => ({ ...e, type: 'event', date: new Date(e.startTime) })),
  ];

  // Sort by date
  allItems.sort((a, b) => a.date - b.date);

  // Create sections based on date
  const sections = {};
  allItems.forEach(item => {
    const dateStr = formatDate(item.date);
    if (!sections[dateStr]) sections[dateStr] = [];
    sections[dateStr].push(item);
  });

  const context = {
    refreshEvent,
  }

  return (
    <DashboardContext.Provider value={context}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div>
          <button className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => setShowEventModal(true)}>New Event</button>
        </div>
      </div>
      <div className="md:mx-auto mx-8">
        {Object.entries(sections).map(([date, items]) => (
          <DateSection key={date} date={date} items={items} onEventClick={handleEventClick} />
        ))}
      </div>
      <Notification />
      {showEventModal && <NewEventDialog onClose={() => setShowEventModal(false)} />}
      {showEventDetails && <EventDetailDialog event={selectedEvent} onClose={handleCloseDetails} onEdit={handleEditClick} />}
      {showEditModal && <EditEventDialog event={selectedEvent} onClose={handleCloseEditModal} />}
    </DashboardContext.Provider>
  );
}

export default Dashboard;
