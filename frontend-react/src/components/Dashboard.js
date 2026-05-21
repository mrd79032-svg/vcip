import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Developers() {
    const [selectedDev, setSelectedDev] = useState(null);

    const developers = [
        {
            id: 1,
            name: "Md Rasid Alam",
            role: "Full Stack Developer",
            rollNo: "23DCS030",
            email: "rasid.alam@vcip.com",
            mobile: "+91 98765 43210",
            education: "Diploma in Computer Engineering",
            institution: "University Polytechnic, Jamia Millia Islamia, New Delhi",
            year: "2023 - Present",
            skills: ["React", "Node.js", "MongoDB", "Express", "Python", "Java"],
            achievements: [
                "Led the development of VCIP platform",
                "Winner of Hackathon 2024",
                "Certified Full Stack Developer"
            ],
            bio: "Passionate full-stack developer with expertise in building scalable web applications. Currently pursuing diploma in Computer Engineering.",
            github: "https://github.com/rasidalam",
            linkedin: "https://linkedin.com/in/rasidalam",
            image: "👨‍💻"
        },
        {
            id: 2,
            name: "Md Faiz Alam",
            role: "Backend Developer",
            rollNo: "23DCS039",
            email: "faiz.alam@vcip.com",
            mobile: "+91 87654 32109",
            education: "Diploma in Computer Engineering",
            institution: "University Polytechnic, Jamia Millia Islamia, New Delhi",
            year: "2023 - Present",
            skills: ["Node.js", "Express", "MongoDB", "API Design", "Socket.io"],
            achievements: [
                "Designed VCIP backend architecture",
                "Implemented real-time features",
                "Contributed to open source projects"
            ],
            bio: "Backend specialist focused on creating robust APIs and database systems. Enthusiastic about cloud computing and system design.",
            github: "https://github.com/faizalam",
            linkedin: "https://linkedin.com/in/faizalam",
            image: "👨‍💻"
        },
        {
            id: 3,
            name: "Md Asif",
            role: "Frontend Developer",
            rollNo: "23DCS036",
            email: "asif@vcip.com",
            mobile: "+91 76543 21098",
            education: "Diploma in Computer Engineering",
            institution: "University Polytechnic, Jamia Millia Islamia, New Delhi",
            year: "2023 - Present",
            skills: ["React", "JavaScript", "HTML5", "CSS3", "Bootstrap"],
            achievements: [
                "Created responsive UI for VCIP",
                "Implemented interactive components",
                "UI/UX design certification"
            ],
            bio: "Creative frontend developer passionate about building beautiful and responsive user interfaces. Focused on delivering exceptional user experiences.",
            github: "https://github.com/asif",
            linkedin: "https://linkedin.com/in/asif",
            image: "👨‍💻"
        },
        {
            id: 4,
            name: "Mehwish Fatima",
            role: "UI/UX Designer & Frontend Developer",
            rollNo: "23DCS043",
            email: "mehwish@vcip.com",
            mobile: "+91 65432 10987",
            education: "Diploma in Computer Engineering",
            institution: "University Polytechnic, Jamia Millia Islamia, New Delhi",
            year: "2023 - Present",
            skills: ["UI/UX Design", "Figma", "React", "CSS3", "Adobe XD"],
            achievements: [
                "Designed VCIP user interface",
                "Best Designer Award 2024",
                "Completed Google UX Design Course"
            ],
            bio: "Creative designer and frontend developer with a keen eye for aesthetics. Dedicated to creating intuitive and accessible user interfaces.",
            github: "https://github.com/mehwish",
            linkedin: "https://linkedin.com/in/mehwish",
            image: "👩‍💻"
        }
    ];

    const openModal = (dev) => {
        setSelectedDev(dev);
    };

    const closeModal = () => {
        setSelectedDev(null);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Meet Our Developers</h2>
            <div className="row">
                {developers.map(dev => (
                    <div className="col-md-3 mb-4" key={dev.id}>
                        <div className="card h-100 text-center shadow-sm zoom-card" style={{ cursor: 'pointer' }} onClick={() => openModal(dev)}>
                            <div className="card-body">
                                <div style={{ fontSize: '48px' }}>{dev.image}</div>
                                <h4 className="mt-2">{dev.name}</h4>
                                <p className="text-muted">{dev.role}</p>
                                <p><strong>Roll No:</strong> {dev.rollNo}</p>
                                <button className="btn btn-primary btn-sm">View Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-4">
                <Link to="/" className="btn btn-secondary">Back to Home</Link>
            </div>

            {/* Modal for Developer Details */}
            {selectedDev && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                <h5 className="modal-title">{selectedDev.name} - {selectedDev.role}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-4 text-center">
                                        <div style={{ fontSize: '80px' }}>{selectedDev.image}</div>
                                    </div>
                                    <div className="col-md-8">
                                        <p><strong>Roll Number:</strong> {selectedDev.rollNo}</p>
                                        <p><strong>Email:</strong> {selectedDev.email}</p>
                                        <p><strong>Mobile:</strong> {selectedDev.mobile}</p>
                                        <p><strong>Education:</strong> {selectedDev.education}</p>
                                        <p><strong>Institution:</strong> {selectedDev.institution}</p>
                                        <p><strong>Batch:</strong> {selectedDev.year}</p>
                                    </div>
                                </div>
                                <hr />
                                <h6>Skills:</h6>
                                <div className="mb-3">
                                    {selectedDev.skills.map((skill, idx) => (
                                        <span key={idx} className="badge bg-primary me-1 mb-1" style={{ padding: '5px 10px' }}>{skill}</span>
                                    ))}
                                </div>
                                <h6>Achievements:</h6>
                                <ul>
                                    {selectedDev.achievements.map((ach, idx) => (
                                        <li key={idx}>{ach}</li>
                                    ))}
                                </ul>
                                <h6>About:</h6>
                                <p>{selectedDev.bio}</p>
                                <hr />
                                <div className="text-center">
                                    <a href={selectedDev.github} target="_blank" rel="noopener noreferrer" className="btn btn-dark me-2">
                                        <i className="fab fa-github"></i> GitHub
                                    </a>
                                    <a href={selectedDev.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                        <i className="fab fa-linkedin"></i> LinkedIn
                                    </a>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Developers;