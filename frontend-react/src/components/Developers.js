import React from 'react';
import { Link } from 'react-router-dom';

function Developers() {
    const developers = [
        { id: 1, name: "Md Rasid Alam", role: "Full Stack Developer", rollNo: "23DCS030", email: "rasid@vcip.com", image: "👨‍💻" },
        { id: 2, name: "Md Faiz Alam", role: "Backend Developer", rollNo: "23DCS039", email: "faiz@vcip.com", image: "👨‍💻" },
        { id: 3, name: "Md Asif", role: "Frontend Developer", rollNo: "23DCS036", email: "asif@vcip.com", image: "👨‍💻" },
        { id: 4, name: "Mehwish Fatima", role: "UI/UX Designer", rollNo: "23DCS043", email: "mehwish@vcip.com", image: "👩‍💻" }
    ];

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Meet Our Developers</h2>
            <div className="row">
                {developers.map(dev => (
                    <div className="col-md-3 mb-4" key={dev.id}>
                        <Link to={`/developer/${dev.id}`} style={{ textDecoration: 'none' }}>
                            <div className="card h-100 text-center shadow-sm" style={{ cursor: 'pointer' }}>
                                <div className="card-body">
                                    <div style={{ fontSize: '48px' }}>{dev.image}</div>
                                    <h4 className="mt-2">{dev.name}</h4>
                                    <p className="text-muted">{dev.role}</p>
                                    <p><strong>Roll No:</strong> {dev.rollNo}</p>
                                    <button className="btn btn-primary btn-sm">View Details</button>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="text-center mt-4">
                <Link to="/" className="btn btn-secondary">Back to Home</Link>
            </div>
        </div>
    );
}

export default Developers;