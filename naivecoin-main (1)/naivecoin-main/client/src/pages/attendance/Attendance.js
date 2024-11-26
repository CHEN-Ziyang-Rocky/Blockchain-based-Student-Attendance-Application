import React, { useState } from "react";
import axios from "axios";
import "./Attendance.css";

const Attendance = () => {
    const [userID, setUserID] = useState("");
    const [eventID, setEventID] = useState("");
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
            const response = await axios.post("http://localhost:3001/operator/attendance", {
                User_ID: userID,
                eventID: eventID,
                privateKey: privateKey,
            });

            const { attendanceData, transactionId } = response.data;
            setMessage(
                `Attendance recorded successfully! Transaction ID: ${transactionId}\n\nDetails:\n- User ID: ${attendanceData.User_ID}\n- Event ID: ${attendanceData.eventID}\n- Timestamp: ${new Date(attendanceData.timestamp).toLocaleString()}`
            );
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while recording attendance.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="attendance-container">
            <h1 style={{ color: '#000' }}>Record Attendance</h1>
            <form onSubmit={handleSubmit} className="attendance-form">
                <div className="form-group">
                    <label htmlFor="userID">User ID:</label>
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
                    <label htmlFor="eventID">Event ID:</label>
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
                    <label htmlFor="privateKey">Private Key:</label>
                    <input
                        type="password"
                        id="privateKey"
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        required
                        placeholder="Enter your Private Key"
                    />
                </div>
                <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit Attendance"}
                </button>
            </form>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Attendance;
