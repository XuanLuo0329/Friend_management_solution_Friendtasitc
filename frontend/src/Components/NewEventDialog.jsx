import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { DashboardContext } from "./Dashboard";

function NewEventDialog({ onClose }) {
    const { refreshEvent } = useContext(DashboardContext);
    const [form, setForm] = useState({
        title: '',
        content: '',
        startTime: '',
        endTime: '',
        daysBefore: '',
        method: 'email',
        repeat: false,
        repeatRule: {
            startDate: '',
            repeat: 'daily',
            interval: 1,
            endDate: '',
        },
        tags: [],
    });

    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState(null); // For displaying response messages
    const modalRef = useRef();

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'repeat') {
            setForm((prevForm) => ({ ...prevForm, repeat: checked }));
        } else if (name.startsWith('repeatRule.')) {
            const field = name.split('.')[1];
            setForm((prevForm) => ({
                ...prevForm,
                repeatRule: { ...prevForm.repeatRule, [field]: value },
            }));
        } else {
            setForm((prevForm) => ({ ...prevForm, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        modalRef.current.scrollTo?.({ top: 0, behavior: 'smooth' });
        // Validation
        const newErrors = {};
        if (!form.title) newErrors.title = 'Title is required';
        if (!form.content) newErrors.content = 'Content is required';
        if (!form.startTime) newErrors.startTime = 'Start Time is required';

        if (form.repeat) {
            if (!form.repeatRule.startDate) newErrors.startDate = 'Start Date is required';
            if (!form.repeatRule.repeat) newErrors.repeat = 'Repeat Frequency is required';
            if (!form.repeatRule.interval) newErrors.interval = 'Interval is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Construct data to match Mongoose model
        const postData = {
            title: form.title,
            content: form.content,
            startTime: new Date(form.startTime),
            endTime: form.endTime ? new Date(form.endTime) : null,
            reminder: {
                daysBefore: parseInt(form.daysBefore, 10),
                method: form.method,
            },
            repeat: form.repeat,
            repeatRule: form.repeat ? {
                startDate: new Date(form.repeatRule.startDate),
                repeat: form.repeatRule.repeat,
                interval: parseInt(form.repeatRule.interval, 10),
                endDate: form.repeatRule.endDate ? new Date(form.repeatRule.endDate) : null,
            } : undefined,
            tags: form.tags,
        };

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
        try {
            const response = await axios.post(`${API_BASE_URL}/api/user/event`, postData);
            setResponseMessage("Event created successfully!");
            refreshEvent();
            setTimeout(onClose, 2000); // Close modal after 2 seconds
        } catch (error) {
            setResponseMessage(`Error creating event: ${error.response?.data.message || error.message}`);
        }
    };

    // Prevent scrolling of the main page
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div ref={modalRef} className="bg-white p-8 rounded shadow-lg w-full max-w-md h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
                {responseMessage && <div className="mb-4 text-center p-3 bg-blue-100 text-blue-800 rounded">{responseMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
                        <input
                            data-testid="title-input"
                            type="text"
                            name="title"
                            className="w-full border rounded px-3 py-2"
                            value={form.title}
                            onChange={handleChange}
                        />
                        {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Content <span className="text-red-500">*</span></label>
                        <textarea
                            data-testid="content-input"
                            name="content"
                            className="w-full border rounded px-3 py-2"
                            value={form.content}
                            onChange={handleChange}
                        />
                        {errors.content && <span className="text-red-500 text-sm">{errors.content}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Start Time <span className="text-red-500">*</span></label>
                        <input
                            data-testid="startTime-input"
                            type="datetime-local"
                            name="startTime"
                            className="w-full border rounded px-3 py-2"
                            value={form.startTime}
                            onChange={handleChange}
                        />
                        {errors.startTime && <span className="text-red-500 text-sm">{errors.startTime}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <input
                            data-testid="endTime-input"
                            type="datetime-local"
                            name="endTime"
                            className="w-full border rounded px-3 py-2"
                            value={form.endTime}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Days Before Reminder</label>
                        <input
                            data-testid="daysBefore-input"
                            type="number"
                            name="daysBefore"
                            className="w-full border rounded px-3 py-2"
                            value={form.daysBefore}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Reminder Method</label>
                        <select
                            data-testid="method-select"
                            name="method"
                            className="w-full border rounded px-3 py-2"
                            value={form.method}
                            onChange={handleChange}
                        >
                            <option value="email">Email</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Repeat Event</label>
                        <input
                            data-testid="repeat-checkbox"
                            type="checkbox"
                            name="repeat"
                            checked={form.repeat}
                            onChange={handleChange}
                        />
                    </div>
                    {form.repeat && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Start Date <span className="text-red-500">*</span></label>
                                <input
                                    data-testid="repeat-startDate-input"
                                    type="date"
                                    name="repeatRule.startDate"
                                    className="w-full border rounded px-3 py-2"
                                    value={form.repeatRule.startDate}
                                    onChange={handleChange}
                                />
                                {errors.startDate && <span className="text-red-500 text-sm">{errors.startDate}</span>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Repeat Frequency <span className="text-red-500">*</span></label>
                                <select
                                    data-testid="repeat-frequency-select"
                                    name="repeatRule.repeat"
                                    className="w-full border rounded px-3 py-2"
                                    value={form.repeatRule.repeat}
                                    onChange={handleChange}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                                {errors.repeat && <span className="text-red-500 text-sm">{errors.repeat}</span>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Interval <span className="text-red-500">*</span></label>
                                <input
                                    data-testid="repeat-interval-input"
                                    type="number"
                                    name="repeatRule.interval"
                                    className="w-full border rounded px-3 py-2"
                                    value={form.repeatRule.interval}
                                    onChange={handleChange}
                                />
                                {errors.interval && <span className="text-red-500 text-sm">{errors.interval}</span>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">End Date</label>
                                <input
                                    data-testid="repeat-endDate-input"
                                    type="date"
                                    name="repeatRule.endDate"
                                    className="w-full border rounded px-3 py-2"
                                    value={form.repeatRule.endDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}
                    <div className="flex justify-end">
                        <button
                            data-testid="cancel-button"
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            data-testid="submit-button"
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewEventDialog;
