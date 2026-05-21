import React from 'react';
import { useParams, Link } from 'react-router-dom';

function DeveloperDetails() {
    const { id } = useParams();
    
    const developers = {
        1: { name: "Md Rasid Alam", role: "Full Stack Developer", rollNo: "23DCS030", email: "rasid@vcip.com", mobile: "+91 98765 43210", education: "Diploma in Computer Engineering", institution: "Jamia Millia Islamia", image: "👨‍💻", bio: "Passionate full-stack developer." },
        2: { name: "Md Faiz Alam", role: "Backend Developer", rollNo: "23DCS039", email: "faiz@vcip.com", mobile: "+91 87654 32109", education: "Diploma in Computer Engineering", institution: "Jamia Millia Islamia", image: "👨‍💻", bio: "Backend specialist." },
        3: { name: "Md Asif", role: "Frontend Developer", rollNo: "23DCS036", email: "asif@vcip.com", mobile: "+91 76543 21098", education: "Diploma in Computer Engineering", institution: "Jamia Millia Islamia", image: "👨‍💻", bio: "Creative frontend developer." },
        4: { name: "Mehwish Fatima", role: "UI/UX Designer", rollNo: "23DCS043", email: "mehwish@vcip.com", mobile: "+91 65432 10987", education: "Diploma in Computer Engineering", institution: "Jamia Millia Islamia", image: "👩‍💻", bio: "Creative designer." }
    };

    const dev = developers[id];

    if (!dev) {
        return <div className="container mt-5"><h2>Developer not found</h2><Link to="/developers">Back</Link></div>;
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h2>{dev.name}</h2>
                    <p>{dev.role}</p>
                </div>
                <div className="card-body">
                    <div className="text-center" style={{ fontSize: '80px' }}>{dev.image}</div>
                    <table className="table table-bordered mt-3">
                        <tbody>
                            <tr><th>Roll Number</th><td>{dev.rollNo}</td></tr>
                            <tr><th>Email</th><td>{dev.email}</td></tr>
                            <tr><th>Mobile</th><td>{dev.mobile}</td></tr>
                            <tr><th>Education</th><td>{dev.education}</td></tr>
                            <tr><th>Institution</th><td>{dev.institution}</td></tr>
                        </tbody>
                    </table>
                    <h4>About</h4>
                    <p>{dev.bio}</p>
                </div>
                <div className="card-footer text-center">
                    <Link to="/developers" className="btn btn-secondary">← Back to Developers</Link>
                </div>
            </div>
        </div>
    );
}

export default DeveloperDetails;