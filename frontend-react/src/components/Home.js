import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title animate-fade-in">
              Virtual Coding Interview Platform
            </h1>
            <p className="hero-subtitle animate-fade-in-delay">
              Revolutionize your technical interviews with AI-powered evaluation, real-time collaboration, and intelligent code analysis.
            </p>
            <div className="hero-buttons animate-fade-in-delay-2">
              <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
              <Link to="/login" className="btn btn-outline-light btn-lg">Login</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Coding Problems</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Interviews Conducted</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Companies Trust Us</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Options Section */}
      <section className="login-options-section">
        <div className="container">
          <h2 className="section-title">Choose Your Role</h2>
          <p className="section-subtitle">Select the role that best describes you to get started</p>
          <div className="row">
            <div className="col-md-4">
              <div className="role-card candidate-card">
                <div className="role-icon">👨‍💻</div>
                <h3>Candidate</h3>
                <p>Take coding interviews, solve problems, and showcase your skills to potential employers.</p>
                <Link to="/login?role=candidate" className="btn btn-role">Login as Candidate</Link>
                <small className="register-link">New? <Link to="/register?role=candidate">Create Account</Link></small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="role-card interviewer-card">
                <div className="role-icon">👨‍🏫</div>
                <h3>Interviewer</h3>
                <p>Create coding questions, conduct live interviews, and evaluate candidates in real-time.</p>
                <Link to="/login?role=interviewer" className="btn btn-role">Login as Interviewer</Link>
                <small className="register-link">New? <Link to="/register?role=interviewer">Create Account</Link></small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="role-card admin-card">
                <div className="role-icon">👨‍💼</div>
                <h3>Admin</h3>
                <p>Manage questions, approve submissions, and oversee platform operations.</p>
                <Link to="/login?role=admin" className="btn btn-role">Login as Admin</Link>
                <small className="register-link">New? <Link to="/register?role=admin">Create Account</Link></small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need for a seamless coding interview experience</p>
          <div className="row">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h3>AI-Powered Evaluation</h3>
                <p>Get instant feedback on code quality, time complexity, and space complexity with our advanced AI.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">💻</div>
                <h3>Live Code Editor</h3>
                <p>Write and run code in multiple languages with syntax highlighting and auto-completion.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">🎥</div>
                <h3>Live Interview Monitoring</h3>
                <p>Interviewers can watch candidates code in real-time and provide instant feedback.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Auto Grading</h3>
                <p>Automatically grade submissions with random test cases and detailed results.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Proctoring</h3>
                <p>Tab switch detection, copy-paste prevention, and fullscreen mode for secure interviews.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h3>Live Chat</h3>
                <p>Real-time chat between candidates and interviewers during the interview session.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Simple steps to conduct or take a coding interview</p>
          <div className="row">
            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Create Account</h3>
                <p>Sign up as a candidate, interviewer, or admin</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Choose Question</h3>
                <p>Select from a library of coding problems</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Write Code</h3>
                <p>Solve problems in your preferred language</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number">4</div>
                <h3>Get Results</h3>
                <p>Receive instant AI feedback and scores</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="developers-section">
        <div className="container">
          <h2 className="section-title">Meet Our Developers</h2>
          <p className="section-subtitle">The team behind VCIP</p>
          <div className="row">
            <div className="col-md-3">
              <div className="developer-card">
                <div className="developer-image">👨‍💻</div>
                <h3>Md Rasid Alam</h3>
                <p>Full Stack Developer</p>
                <div className="developer-social">
                  <button className="social-icon" aria-label="GitHub"><i className="fab fa-github"></i></button>
                  <button className="social-icon" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></button>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="developer-card">
                <div className="developer-image">👨‍💻</div>
                <h3>Md Faiz Alam</h3>
                <p>Backend Developer</p>
                <div className="developer-social">
                  <button className="social-icon" aria-label="GitHub"><i className="fab fa-github"></i></button>
                  <button className="social-icon" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></button>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="developer-card">
                <div className="developer-image">👨‍💻</div>
                <h3>Md Asif</h3>
                <p>Frontend Developer</p>
                <div className="developer-social">
                  <button className="social-icon" aria-label="GitHub"><i className="fab fa-github"></i></button>
                  <button className="social-icon" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></button>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="developer-card">
                <div className="developer-image">👩‍💻</div>
                <h3>Mehwish Fatima</h3>
                <p>UI/UX Designer</p>
                <div className="developer-social">
                  <button className="social-icon" aria-label="GitHub"><i className="fab fa-github"></i></button>
                  <button className="social-icon" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Coding Interviews?</h2>
            <p>Join thousands of developers and companies using VCIP for technical interviews.</p>
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h4>VCIP</h4>
              <p>Virtual Coding Interview Platform - Making technical interviews smarter, faster, and fairer.</p>
            </div>
            <div className="col-md-4">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/register">Create Account</Link></li>
                <li><Link to="/login">Login</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h4>Contact</h4>
              <p>Email: support@vcip.com</p>
              <p>Phone: +91 1234567890</p>
              <div className="social-links">
                <button className="social-icon" aria-label="Facebook"><i className="fab fa-facebook"></i></button>
                <button className="social-icon" aria-label="Twitter"><i className="fab fa-twitter"></i></button>
                <button className="social-icon" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></button>
                <button className="social-icon" aria-label="GitHub"><i className="fab fa-github"></i></button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 VCIP. All rights reserved. | Developed by Diploma in Computer Science, Jamia Millia Islamia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;