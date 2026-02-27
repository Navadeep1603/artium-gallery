import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Palette, Users, Eye as EyeIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Signup() {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('visitor');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, user } = useAuth();
    const navigate = useNavigate();

    // Redirect already-logged-in users to their dashboard
    if (user) {
        const dest = { admin: '/dashboard/admin', artist: '/dashboard/artist', curator: '/dashboard/curator' }[user.role] || '/dashboard/visitor/profile';
        return <Navigate to={dest} replace />;
    }

    const roles = [
        { id: 'visitor', name: 'Art Enthusiast', icon: EyeIcon, description: 'Browse, save favorites, and purchase artworks' },
        { id: 'artist', name: 'Artist', icon: Palette, description: 'Upload and sell your artworks, connect with collectors' },
        { id: 'curator', name: 'Curator', icon: Users, description: 'Organize exhibitions and curate collections' },
    ];

    const validatePassword = (pass) => {
        const errors = [];
        if (pass.length < 8) errors.push('At least 8 characters');
        if (!/[A-Z]/.test(pass)) errors.push('One uppercase letter');
        if (!/[a-z]/.test(pass)) errors.push('One lowercase letter');
        if (!/[0-9]/.test(pass)) errors.push('One number');
        if (!/[!@#$%^&*]/.test(pass)) errors.push('One special character (!@#$%^&*)');
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (step === 1) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('Please enter a valid email address');
                return;
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            const passwordErrors = validatePassword(password);
            if (passwordErrors.length > 0) {
                setError('Please meet all password requirements');
                return;
            }
            setStep(2);
            return;
        }

        setError('');
        setLoading(true);

        const result = await signup(name, email, password, role);

        if (result.success) {
            const dashboardPath = {
                artist: '/dashboard/artist',
                curator: '/dashboard/curator',
                visitor: '/gallery'
            }[role] || '/';

            navigate(dashboardPath);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-bg__image auth-bg__image--signup" />
                <div className="auth-bg__overlay" />
            </div>

            <motion.div
                className="auth-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="auth-header">
                    <Link to="/" className="auth-logo">ARTIUM</Link>
                    <h1 className="auth-title">Join the Gallery</h1>
                    <p className="auth-subtitle">
                        {step === 1 ? 'Create your account to start your art journey' : 'Choose how you want to experience art'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="auth-steps">
                    <div className={`auth-step ${step >= 1 ? 'active' : ''}`}>
                        <span>1</span>
                        Account
                    </div>
                    <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>
                        <span>2</span>
                        Role
                    </div>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}

                    {step === 1 ? (
                        <>
                            <div className="auth-field">
                                <label htmlFor="name">Full Name</label>
                                <div className="auth-input-wrapper">
                                    <User size={18} />
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="email">Email</label>
                                <div className="auth-input-wrapper">
                                    <Mail size={18} />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="password">Password</label>
                                <div className="auth-input-wrapper">
                                    <Lock size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a password"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        className="auth-password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {password && (() => {
                                    const reqs = [
                                        { label: '8+ chars', met: password.length >= 8 },
                                        { label: 'Uppercase', met: /[A-Z]/.test(password) },
                                        { label: 'Lowercase', met: /[a-z]/.test(password) },
                                        { label: 'Number', met: /[0-9]/.test(password) },
                                        { label: 'Special char', met: /[!@#$%^&*]/.test(password) }
                                    ];
                                    const score = reqs.filter(r => r.met).length;
                                    let strengthText = 'Weak';
                                    if (score >= 3) strengthText = 'Fair';
                                    if (score >= 4) strengthText = 'Good';
                                    if (score === 5) strengthText = 'Strong';

                                    return (
                                        <div className="auth-password-requirements">
                                            <div className="auth-password-strength-text">
                                                <span>Password Strength</span>
                                                <span style={{
                                                    color: score === 5 ? '#10b981' : score >= 3 ? 'var(--gold)' : '#ef4444'
                                                }}>{strengthText}</span>
                                            </div>
                                            <div className="password-bars">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`password-bar ${i < score ? 'met' : ''} ${score === 5 ? 'strong' : ''}`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="password-req-list">
                                                {reqs.map((req, i) => (
                                                    <span key={i} className={`password-req-item ${req.met ? 'met' : ''}`}>
                                                        {req.met ? '✓' : '○'} {req.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="auth-field">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="auth-input-wrapper">
                                    <Lock size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="auth-roles">
                            {roles.map((r) => (
                                <motion.div
                                    key={r.id}
                                    className={`auth-role ${role === r.id ? 'selected' : ''}`}
                                    onClick={() => setRole(r.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="auth-role__icon">
                                        <r.icon size={24} />
                                    </div>
                                    <div className="auth-role__info">
                                        <h4>{r.name}</h4>
                                        <p>{r.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <div className="auth-buttons">
                        {step === 2 && (
                            <button type="button" className="auth-back" onClick={() => setStep(1)}>
                                Back
                            </button>
                        )}
                        <button type="submit" className="auth-submit" disabled={loading}>
                            {loading ? 'Creating...' : step === 1 ? 'Continue' : 'Create Account'}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </form>

                <div className="auth-footer">
                    <span>Already have an account?</span>
                    <Link to="/login">Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
}
