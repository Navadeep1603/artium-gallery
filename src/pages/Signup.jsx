import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import './Auth.css';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, user } = useAuth();
    const navigate = useNavigate();

    // OTP state
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const cooldownRef = useRef(null);

    // Redirect already-logged-in users to their dashboard
    if (user) {
        const dest = { admin: '/dashboard/admin', artist: '/dashboard/artist', curator: '/dashboard/curator' }[user.role] || '/gallery';
        return <Navigate to={dest} replace />;
    }

    const validatePassword = (pass) => {
        const errors = [];
        if (pass.length < 8) errors.push('At least 8 characters');
        if (!/[A-Z]/.test(pass)) errors.push('One uppercase letter');
        if (!/[a-z]/.test(pass)) errors.push('One lowercase letter');
        if (!/[0-9]/.test(pass)) errors.push('One number');
        if (!/[!@#$%^&*]/.test(pass)) errors.push('One special character (!@#$%^&*)');
        return errors;
    };

    const isValidEmail = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

    // Start 30-second cooldown
    const startCooldown = () => {
        setResendCooldown(30);
        if (cooldownRef.current) clearInterval(cooldownRef.current);
        cooldownRef.current = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(cooldownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
        };
    }, []);

    // Reset OTP state if email changes after OTP was sent
    useEffect(() => {
        if (otpSent || otpVerified) {
            setOtpSent(false);
            setOtpVerified(false);
            setOtp('');
            setOtpError('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email]);

    const handleSendOtp = async () => {
        if (!isValidEmail(email)) {
            setOtpError('Please enter a valid email address');
            return;
        }

        setOtpLoading(true);
        setOtpError('');

        try {
            const result = await userService.sendOtp(email);
            if (result.success) {
                setOtpSent(true);
                startCooldown();
                setOtpError('');
            } else {
                setOtpError(result.error || 'Failed to send OTP');
            }
        } catch {
            setOtpError('Server error. Please try again.');
        }

        setOtpLoading(false);
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setOtpError('Please enter a 6-digit OTP');
            return;
        }

        setOtpLoading(true);
        setOtpError('');

        try {
            const result = await userService.verifyOtp(email, otp);
            if (result.success) {
                setOtpVerified(true);
                setOtpError('');
            } else {
                setOtpError(result.error || 'Invalid OTP');
            }
        } catch {
            setOtpError('Server error. Please try again.');
        }

        setOtpLoading(false);
    };

    const handleResendOtp = () => {
        if (resendCooldown > 0) return;
        handleSendOtp();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!otpVerified) {
            setError('Please verify your email with OTP first');
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

        setError('');
        setLoading(true);

        // Always register as visitor
        const result = await signup(name, email, password, 'visitor');

        if (result.success) {
            navigate('/gallery');
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
                    <h1 className="auth-title">Create Your Visitor Account</h1>
                    <p className="auth-subtitle">
                        Join our community to browse, save favorites, and purchase artworks
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}

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
                        <label htmlFor="email">
                            Email
                            {otpVerified && (
                                <span className="otp-verified-badge">
                                    <ShieldCheck size={14} /> Verified
                                </span>
                            )}
                        </label>
                        <div className={`auth-input-wrapper ${otpVerified ? 'verified' : ''}`}>
                            <Mail size={18} />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                disabled={otpVerified}
                            />
                            {!otpVerified && !otpSent && (
                                <button
                                    type="button"
                                    className="otp-send-btn"
                                    onClick={handleSendOtp}
                                    disabled={otpLoading || !isValidEmail(email)}
                                >
                                    {otpLoading ? 'Sending...' : 'Send OTP'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* OTP Section */}
                    <AnimatePresence>
                        {otpSent && !otpVerified && (
                            <motion.div
                                className="otp-section"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="auth-field">
                                    <label htmlFor="otp">Enter OTP</label>
                                    <div className="auth-input-wrapper otp-input-wrapper">
                                        <ShieldCheck size={18} />
                                        <input
                                            type="text"
                                            id="otp"
                                            value={otp}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                setOtp(val);
                                            }}
                                            placeholder="Enter 6-digit OTP"
                                            maxLength={6}
                                            autoComplete="one-time-code"
                                        />
                                    </div>

                                    {otpError && <div className="otp-error">{otpError}</div>}

                                    <div className="otp-actions">
                                        <button
                                            type="button"
                                            className="otp-verify-btn"
                                            onClick={handleVerifyOtp}
                                            disabled={otpLoading || otp.length !== 6}
                                        >
                                            {otpLoading ? 'Verifying...' : 'Verify OTP'}
                                        </button>
                                        <button
                                            type="button"
                                            className={`otp-resend ${resendCooldown > 0 ? 'disabled' : ''}`}
                                            onClick={handleResendOtp}
                                            disabled={resendCooldown > 0 || otpLoading}
                                        >
                                            <RefreshCw size={14} />
                                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <div className={`auth-input-wrapper ${!otpVerified ? 'field-disabled' : ''}`}>
                            <Lock size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                required
                                minLength={8}
                                disabled={!otpVerified}
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={!otpVerified}
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
                        <div className={`auth-input-wrapper ${!otpVerified ? 'field-disabled' : ''}`}>
                            <Lock size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                                minLength={8}
                                disabled={!otpVerified}
                            />
                        </div>
                    </div>

                    <div className="auth-buttons">
                        <button type="submit" className="auth-submit" disabled={loading || !otpVerified}>
                            {loading ? 'Creating...' : 'Create Account'}
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
