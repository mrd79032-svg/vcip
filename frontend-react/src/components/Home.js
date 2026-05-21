import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="container">
                    <h1 className="hero-title">Virtual Coding Interview Platform</h1>
                    <p className="hero-subtitle">AI-powered coding interviews with real-time evaluation and live monitoring</p>
                    <div className="hero-buttons">
                        <Link to="/register" className="btn btn-primary">Get Started</Link>
                        <Link to="/login" className="btn btn-outline-light">Login</Link>
                    </div>
                </div>
            </section>
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Features</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">🤖</div>
                                <h3>AI Code Review</h3>
                                <p>Get instant AI feedback on your code</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">🎥</div>
                                <h3>Live Monitoring</h3>
                                <p>Interviewers watch in real-time</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">🔒</div>
                                <h3>Anti-Cheat</h3>
                                <p>No copy-paste, tab switch detection</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;