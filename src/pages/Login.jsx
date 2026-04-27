import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import './Auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Force password change state
    const [mustChangePassword, setMustChangePassword] = useState(false);
    const [changeUser, setChangeUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [changeLoading, setChangeLoading] = useState(false);
    const [changeError, setChangeError] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            if (result.mustChangePassword) {
                // Show password change form
                setMustChangePassword(true);
                setChangeUser(result.user);
                setError('');
            } else {
                const dashboardPath = {
                    admin: '/dashboard/admin',
                    artist: '/dashboard/artist',
                    curator: '/dashboard/curator',
                    visitor: '/gallery'
                }[result.user.role] || '/';

                navigate(dashboardPath);
            }
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setChangeError('');

        if (newPassword !== confirmNewPassword) {
            setChangeError('Passwords do not match');
            return;
        }

        const passwordErrors = validatePassword(newPassword);
        if (passwordErrors.length > 0) {
            setChangeError('Please meet all password requirements');
            return;
        }

        if (newPassword === password) {
            setChangeError('New password must be different from the temporary password');
            return;
        }

        setChangeLoading(true);

        try {
            const result = await userService.changePassword(changeUser.id, password, newPassword);
            if (result.success) {
                // Now login again with the new password
                const loginResult = await login(email, newPassword);
                if (loginResult.success) {
                    const dashboardPath = {
                        admin: '/dashboard/admin',
                        artist: '/dashboard/artist',
                        curator: '/dashboard/curator',
                        visitor: '/gallery'
                    }[loginResult.user.role] || '/';
                    navigate(dashboardPath);
                } else {
                    setChangeError('Password changed but login failed. Please try logging in again.');
                }
            } else {
                setChangeError(result.error || 'Failed to change password');
            }
        } catch {
            setChangeError('Server error. Please try again.');
        }

        setChangeLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-bg__image" />
                <div className="auth-bg__overlay" />
            </div>

            <motion.div
                className="auth-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <AnimatePresence mode="wait">
                    {!mustChangePassword ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: 0 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                        >
                            <div className="auth-header">
                                <Link to="/" className="auth-logo">ARTIUM</Link>
                                <h1 className="auth-title">Welcome Back</h1>
                                <p className="auth-subtitle">Sign in to continue your art journey</p>
                            </div>

                            <form className="auth-form" onSubmit={handleSubmit}>
                                {error && <div className="auth-error">{error}</div>}

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
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="auth-password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="auth-options">
                                    <label className="auth-remember">
                                        <input type="checkbox" />
                                        <span>Remember me</span>
                                    </label>
                                    <Link to="/forgot-password" className="auth-forgot">
                                        Forgot password?
                                    </Link>
                                </div>

                                <button type="submit" className="auth-submit" disabled={loading}>
                                    {loading ? 'Signing in...' : 'Sign In'}
                                    <ArrowRight size={18} />
                                </button>
                            </form>

                            <div className="auth-footer">
                                <span>Don't have an account?</span>
                                <Link to="/signup">Create Account</Link>
                            </div>


                        </motion.div>
                    ) : (
                        <motion.div
                            key="change-password"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                        >
                            <div className="auth-header">
                                <Link to="/" className="auth-logo">ARTIUM</Link>
                                <h1 className="auth-title">Change Your Password</h1>
                                <p className="auth-subtitle">
                                    <ShieldCheck size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                                    For security, please set a new password before continuing
                                </p>
                            </div>

                            <form className="auth-form" onSubmit={handleChangePassword}>
                                {changeError && <div className="auth-error">{changeError}</div>}

                                <div className="change-pw-info">
                                    <p>Logged in as <strong>{changeUser?.email}</strong></p>
                                </div>

                                <div className="auth-field">
                                    <label htmlFor="newPassword">New Password</label>
                                    <div className="auth-input-wrapper">
                                        <Lock size={18} />
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter your new password"
                                            required
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            className="auth-password-toggle"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {newPassword && (() => {
                                        const reqs = [
                                            { label: '8+ chars', met: newPassword.length >= 8 },
                                            { label: 'Uppercase', met: /[A-Z]/.test(newPassword) },
                                            { label: 'Lowercase', met: /[a-z]/.test(newPassword) },
                                            { label: 'Number', met: /[0-9]/.test(newPassword) },
                                            { label: 'Special char', met: /[!@#$%^&*]/.test(newPassword) }
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
                                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
                                    <div className="auth-input-wrapper">
                                        <Lock size={18} />
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            id="confirmNewPassword"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            placeholder="Confirm your new password"
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="auth-submit" disabled={changeLoading}>
                                    {changeLoading ? 'Updating...' : 'Update Password & Continue'}
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
