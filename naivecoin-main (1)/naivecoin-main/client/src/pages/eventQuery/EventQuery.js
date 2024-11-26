import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EventQuery.css";

const EventQuery = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.get("http://localhost:3001/blockchain/transactions/events");
            setEvents(response.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError("No events found.");
            } else {
                setError("Failed to fetch events. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="event-query-container">
            <h1 className="title" style={{ color: '#000' }}>Event Transactions</h1>

            {isLoading && <p className="loading">Loading events...</p>}

            {error && <p className="error-message">{error}</p>}

            {!isLoading && !error && (
                <div className="event-list">
                    {events.length > 0 ? (
                        <table className="event-table">
                            <thead>
                                <tr>
                                    <th style={{ color: '#000' }}>Event ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event, index) => (
                                    <tr key={index}>
                                        <td>{event.eventID}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-events">No events available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventQuery;
