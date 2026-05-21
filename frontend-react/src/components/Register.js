import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: '',
    gender: 'male',
    role: 'candidate',
    institution: '',
    agreeTerms: false
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && (roleParam === 'candidate' || roleParam === 'interviewer' || roleParam === 'admin')) {
      setForm(prev => ({ ...prev, role: roleParam }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const validateForm = () => {
    if (!form.username.trim()) { setError('Username is required'); return false; }
    if (!form.email.trim()) { setError('Email is required'); return false; }
    if (!form.password) { setError('Password is required'); return false; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return false; }
    if (form.password !== form.confirmPassword) { setPasswordError('Passwords do not match'); setError('Passwords do not match'); return false; }
    if (!form.fullName.trim()) { setError('Full name is required'); return false; }
    if (!form.phone.trim()) { setError('Phone number is required'); return false; }
    if (!form.agreeTerms) { setError('You must agree to the Terms & Conditions'); return false; }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) { setError('Please enter a valid email address'); return false; }
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone.replace(/\D/g, ''))) { setError('Please enter a valid 10-digit phone number'); return false; }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { confirmPassword, agreeTerms, ...submitData } = form;
      await register(submitData);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        if (form.role === 'admin') navigate('/admin');
        else if (form.role === 'interviewer') navigate('/interviewer-dashboard');
        else navigate('/candidate-dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = () => {
    switch(form.role) {
      case 'candidate': return 'Candidate';
      case 'interviewer': return 'Interviewer';
      case 'admin': return 'Admin';
      default: return 'Candidate';
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Create Account as {getRoleLabel()}</h4>
              <small>Join VCIP to start your coding journey</small>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <form onSubmit={handleSubmit}>
                {/* Role Selection - Top of the form */}
                <div className="alert alert-info mb-3">
                  <strong>Select Your Role:</strong> This determines what features you can access.
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">I want to register as *</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input 
                          type="radio" 
                          name="role" 
                          value="candidate" 
                          className="form-check-input" 
                          checked={form.role === 'candidate'} 
                          onChange={handleChange} 
                          id="roleCandidate"
                        />
                        <label className="form-check-label" htmlFor="roleCandidate">
                          👨‍💻 Candidate - Take coding interviews
                        </label>
                      </div>
                      <div className="form-check">
                        <input 
                          type="radio" 
                          name="role" 
                          value="interviewer" 
                          className="form-check-input" 
                          checked={form.role === 'interviewer'} 
                          onChange={handleChange} 
                          id="roleInterviewer"
                        />
                        <label className="form-check-label" htmlFor="roleInterviewer">
                          👨‍🏫 Interviewer - Create questions & conduct interviews
                        </label>
                      </div>
                      <div className="form-check">
                        <input 
                          type="radio" 
                          name="role" 
                          value="admin" 
                          className="form-check-input" 
                          checked={form.role === 'admin'} 
                          onChange={handleChange} 
                          id="roleAdmin"
                        />
                        <label className="form-check-label" htmlFor="roleAdmin">
                          👨‍💼 Admin - Manage platform
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Personal Information Section */}
                <h5 className="mb-3 text-primary">Personal Information</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name *</label>
                    <input type="text" name="fullName" className="form-control" value={form.fullName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Username *</label>
                    <input type="text" name="username" className="form-control" value={form.username} onChange={handleChange} required />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input type="tel" name="phone" className="form-control" placeholder="9876543210" value={form.phone} onChange={handleChange} required />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="dateOfBirth" className="form-control" value={form.dateOfBirth} onChange={handleChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Gender *</label>
                    <div className="d-flex gap-4 mt-2">
                      <div className="form-check">
                        <input 
                          type="radio" 
                          name="gender" 
                          value="male" 
                          className="form-check-input" 
                          checked={form.gender === 'male'} 
                          onChange={handleChange} 
                          id="genderMale"
                        />
                        <label className="form-check-label" htmlFor="genderMale">Male</label>
                      </div>
                      <div className="form-check">
                        <input 
                          type="radio" 
                          name="gender" 
                          value="female" 
                          className="form-check-input" 
                          checked={form.gender === 'female'} 
                          onChange={handleChange} 
                          id="genderFemale"
                        />
                        <label className="form-check-label" htmlFor="genderFemale">Female</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <h5 className="mb-3 mt-3 text-primary">Address Information</h5>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea name="address" className="form-control" rows="2" value={form.address} onChange={handleChange} placeholder="Street address"></textarea>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">City</label>
                    <input type="text" name="city" className="form-control" value={form.city} onChange={handleChange} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">State</label>
                    <input type="text" name="state" className="form-control" value={form.state} onChange={handleChange} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Pincode</label>
                    <input type="text" name="pincode" className="form-control" value={form.pincode} onChange={handleChange} />
                  </div>
                </div>

                {/* Account Security Section */}
                <h5 className="mb-3 mt-3 text-primary">Account Security</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Password *</label>
                    <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
                    <small className="text-muted">Minimum 6 characters</small>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirm Password *</label>
                    <input type="password" name="confirmPassword" className={`form-control ${passwordError ? 'is-invalid' : ''}`} value={form.confirmPassword} onChange={handleChange} required />
                    {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                  </div>
                </div>

                {/* Institution */}
                <div className="mb-3">
                  <label className="form-label">Institution / Organization</label>
                  <input type="text" name="institution" className="form-control" value={form.institution} onChange={handleChange} placeholder="University or Company name (optional)" />
                </div>

                {/* Terms and Conditions */}
                <div className="mb-3 form-check">
                  <input type="checkbox" name="agreeTerms" className="form-check-input" checked={form.agreeTerms} onChange={handleChange} required />
                  <label className="form-check-label">
                    I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms & Conditions</a> and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Creating Account...' : `Create ${getRoleLabel()} Account`}
                </button>
                
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Already have an account? <a href="/login">Login here</a>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;