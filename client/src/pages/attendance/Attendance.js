import React, { useState } from "react";
import axios from "axios";
import "./Attendance.css";

const Attendance = () => {
    const [studentId, setStudentId] = useState("");
    const [eventId, setEventId] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [attendanceDetails, setAttendanceDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResponseMessage("");
        setTransactionId("");
        setAttendanceDetails(null);
        setError("");

        try {
            const response = await axios.post("http://localhost:3001/operator/attendance", {
                studentId,
                eventId,
                privateKey,
            });

            const { message, transactionId, attendanceData } = response.data;

            setResponseMessage(message);
            setTransactionId(transactionId);

            if (attendanceData) {
                const safeAttendanceData = {
                    studentId: attendanceData.studentId || "",
                    eventId: attendanceData.eventId || "",
                    timestamp: attendanceData.timestamp || "",
                    messageHash: attendanceData.messageHash ? String(attendanceData.messageHash) : "",
                    signature: attendanceData.signature ? String(attendanceData.signature) : "",
                };
                setAttendanceDetails(safeAttendanceData);
            } else {
                setAttendanceDetails(null);
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "An error occurred while recording attendance."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="attendance-container">
            <h1>Record Attendance</h1>
            <form onSubmit={handleSubmit} className="attendance-form">
                <div className="form-group">
                    <label htmlFor="studentId">Student ID:</label>
                    <input
                        type="text"
                        id="studentId"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                        placeholder="Enter your student ID"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="eventId">Event ID:</label>
                    <input
                        type="text"
                        id="eventId"
                        value={eventId}
                        onChange={(e) => setEventId(e.target.value)}
                        required
                        placeholder="Enter the event ID"
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
                    {isLoading ? "Submitting..." : "Submit Attendance"}
                </button>
            </form>

            {responseMessage && (
                <div className="success-message">
                    <p>{responseMessage}</p>
                    {transactionId && (
                        <p>
                            <strong>Transaction ID:</strong> {transactionId}
                        </p>
                    )}
                    {attendanceDetails && (
                        <div className="attendance-details">
                            <p>
                                <strong>Student ID:</strong> {attendanceDetails.studentId}
                            </p>
                            <p>
                                <strong>Event ID:</strong> {attendanceDetails.eventId}
                            </p>
                            <p>
                                <strong>Timestamp:</strong>{" "}
                                {new Date(parseInt(attendanceDetails.timestamp)).toLocaleString()}
                            </p>
                            <p>
                                <strong>Message Hash:</strong> {attendanceDetails.messageHash}
                            </p>
                            <p>
                                <strong>Signature:</strong> {attendanceDetails.signature}
                            </p>
                        </div>
                    )}
                </div>
            )}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Attendance;
