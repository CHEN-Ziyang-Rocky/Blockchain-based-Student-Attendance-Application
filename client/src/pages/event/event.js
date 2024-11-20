import React, { useState } from "react";
import axios from "axios";
import "./event.css";

const Event = () => {
    const [userID, setUserID] = useState("");
    const [eventID, setEventID] = useState("");
    const [ddl, setDdl] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.post("http://localhost:3001/operator/event", {
                User_ID: userID,
                eventID: eventID,
                ddl: ddl,
                privateKey: privateKey,
            });

            setMessage(`Event created successfully! Transaction ID: ${response.data.transactionId}`);
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while creating the event.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="event-container">
            <h1 style={{ color: '#000' }}>Create Event</h1>
            <form onSubmit={handleSubmit} className="event-form">
                <div className="form-group">
                    <label htmlFor="userID">User ID (Teacher):</label>
                    <input
                        type="text"
                        id="userID"
                        value={userID}
                        onChange={(e) => setUserID(e.target.value)}
                        required
                        placeholder="Enter your User ID"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="eventID">Enter the Event ID you want to create:</label>
                    <input
                        type="text"
                        id="eventID"
                        value={eventID}
                        onChange={(e) => setEventID(e.target.value)}
                        required
                        placeholder="Enter the Event ID"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ddl">Deadline (e.g. 2024/12/02 15:30):</label>
                    <input
                        type="text"
                        id="ddl"
                        value={ddl}
                        onChange={(e) => setDdl(e.target.value)}
                        required
                        placeholder="Enter deadline (YYYY/MM/DD HH:mm)"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="privateKey">Private Key:</label>
                    <input
                        type="password"
                        id="privateKey"
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        required
                        placeholder="Enter your private key"
                    />
                </div>
                <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? "Creating Event..." : "Create Event"}
                </button>
            </form>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Event;
