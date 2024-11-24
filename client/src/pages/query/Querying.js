import React, { useState } from "react";
import axios from "axios";
import "./Querying.css";

const QueryAttendance = () => {
    const [studentId, setStudentId] = useState("");
    const [classId, setClassId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        setAttendanceRecords([]);
        setError("");

        try {
            const params = {};
            if (studentId) params.User_ID = studentId;
            if (classId) params.eventID = classId;
            if (startDate) params.startTime = startDate;
            if (endDate) params.endTime = endDate;

            const response = await axios.get("http://localhost:3001/blockchain/transactions/attendance", { params });
            setAttendanceRecords(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch attendance records.");
        }
    };

    return (
        <div className="query-container">
            <h1 style={{ color: '#000' }}>Attendance Query</h1>
            <form onSubmit={handleSearch} className="query-form">
                <div className="form-group">
                    <label htmlFor="studentId">Student ID:</label>
                    <input
                        type="text"
                        id="studentId"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter Student ID"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="classId">Class/Event ID:</label>
                    <input
                        type="text"
                        id="classId"
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        placeholder="Enter Class or Event ID"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="datetime-local"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="datetime-local"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button type="submit" className="submit-button">Search</button>
            </form>
            {error && <div className="error-message">{error}</div>}
            {attendanceRecords.length > 0 && (
                <div className="results">
                    <h2>Attendance Records</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Event ID</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.data.outputs[0].User_ID}</td>
                                    <td>{record.data.outputs[0].eventID}</td>
                                    <td>{new Date(record.data.outputs[0].timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default QueryAttendance;
