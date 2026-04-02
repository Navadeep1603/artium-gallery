import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { userService } from '../services/api';
import './Auth.css';

const STEP_EMAIL = 1;
const STEP_OTP   = 2;
const STEP_RESET = 3;
const STEP_DONE  = 4;

const RESEND_COOLDOWN = 30; // seconds

export default function ForgotPassword() {
    const navigate = useNavigate();

    // ── State ───────────────────────────────────────────────────────
    const [step, setStep] = useState(STEP_EMAIL);

    // Step 1
    const [email, setEmail]       = useState('');
    const [emailError, setEmailError] = useState('');
    const [sendingOtp, setSendingOtp] = useState(false);

    // Step 2
    const [otp, setOtp]             = useState('');
    const [otpError, setOtpError]   = useState('');
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [cooldown, setCooldown]   = useState(0);
    const cooldownRef = useRef(null);

    // Step 3
    const [newPassword, setNewPassword]         = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [resetError, setResetError]           = useState('');
    const [resetting, setResetting]             = useState(false);

    // ── Helpers ──────────────────────────────────────────────────────
    const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    const passwordReqs = [
        { label: '8+ chars',     met: newPassword.length >= 8 },
        { label: 'Uppercase',    met: /[A-Z]/.test(newPassword) },
        { label: 'Lowercase',    met: /[a-z]/.test(newPassword) },
        { label: 'Number',       met: /[0-9]/.test(newPassword) },
        { label: 'Special char', met: /[!@#$%^&*]/.test(newPassword) },
    ];
    const passwordScore    = passwordReqs.filter(r => r.met).length;
    const passwordStrength = passwordScore === 5 ? 'Strong' : passwordScore >= 4 ? 'Good' : passwordScore >= 3 ? 'Fair' : 'Weak';
    const passwordStrengthColor = passwordScore === 5 ? '#10b981' : passwordScore >= 3 ? 'var(--gold)' : '#ef4444';

    const startCooldown = () => {
        setCooldown(RESEND_COOLDOWN);
        if (cooldownRef.current) clearInterval(cooldownRef.current);
        cooldownRef.current = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => () => {
        if (cooldownRef.current) clearInterval(cooldownRef.current);
    }, []);

    // ── Handlers ─────────────────────────────────────────────────────
    const handleSendOtp = async (e) => {
        e?.preventDefault();
        setEmailError('');

        if (!email.trim()) { setEmailError('Please enter your email address.'); return; }
        if (!isValidEmail(email)) { setEmailError('Please enter a valid email address.'); return; }

        setSendingOtp(true);
        try {
            const result = await userService.sendOtp(email.trim().toLowerCase());
            if (result.success) {
                setStep(STEP_OTP);
                startCooldown();
            } else {
                setEmailError(result.error || 'Failed to send OTP. Please try again.');
            }
        } catch {
            setEmailError('Server error. Please try again.');
        }
        setSendingOtp(false);
    };

    const handleResendOtp = async () => {
        if (cooldown > 0) return;
        setOtpError('');
        setSendingOtp(true);
        try {
            const result = await userService.sendOtp(email.trim().toLowerCase());
            if (result.success) {
                startCooldown();
                setOtp('');
            } else {
                setOtpError(result.error || 'Failed to resend OTP.');
            }
        } catch {
            setOtpError('Server error. Please try again.');
        }
        setSendingOtp(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setOtpError('');

        if (!otp.trim() || otp.length !== 6) { setOtpError('Please enter the 6-digit code.'); return; }

        setVerifyingOtp(true);
        try {
            const result = await userService.verifyOtp(email.trim().toLowerCase(), otp.trim());
            if (result.success) {
                setStep(STEP_RESET);
            } else {
                setOtpError(result.error || 'Invalid or expired OTP.');
            }
        } catch {
            setOtpError('Server error. Please try again.');
        }
        setVerifyingOtp(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetError('');

        if (passwordScore < 5) { setResetError('Password does not meet all requirements.'); return; }
        if (newPassword !== confirmPassword) { setResetError('Passwords do not match.'); return; }

        setResetting(true);
        try {
            const result = await userService.resetPassword(email.trim().toLowerCase(), newPassword);
            if (result.success) {
                setStep(STEP_DONE);
            } else {
                setResetError(result.error || 'Failed to reset password. Please try again.');
            }
        } catch {
            setResetError('Server error. Please try again.');
        }
        setResetting(false);
    };

    // ── Step indicator helper ─────────────────────────────────────────
    const stepLabels = ['Email', 'Verify', 'Reset'];
    const currentIndicatorStep = Math.min(step, STEP_RESET);

    // ── Render ────────────────────────────────────────────────────────
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
                transition={{ duration: 0.4 }}
            >
                {/* Step indicator (hidden on success) */}
                {step !== STEP_DONE && (
                    <div className="auth-steps">
                        {stepLabels.map((label, i) => (
                            <div key={label} className={`auth-step ${currentIndicatorStep > i ? 'active' : ''}`}>
                                <span>{currentIndicatorStep > i ? '✓' : i + 1}</span>
                                {label}
                            </div>
                        ))}
                    </div>
                )}

                <AnimatePresence mode="wait">

                    {/* ── STEP 1: Email ─────────────────────────────── */}
                    {step === STEP_EMAIL && (
                        <motion.div
                            key="step-email"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="auth-header">
                                <Link to="/" className="auth-logo">ARTIUM</Link>
                                <h1 className="auth-title">Forgot Password?</h1>
                                <p className="auth-subtitle">
                                    Enter your registered email and we'll send you a verification code.
                                </p>
                            </div>

                            <form className="auth-form" onSubmit={handleSendOtp}>
                                {emailError && <div className="auth-error">{emailError}</div>}

                                <div className="auth-field">
                                    <label htmlFor="forgot-email">Email Address</label>
                                    <div className="auth-input-wrapper">
                                        <Mail size={18} />
                                        <input
                                            type="email"
                                            id="forgot-email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Enter your registered email"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="auth-submit" disabled={sendingOtp}>
                                    {sendingOtp ? 'Sending Code...' : 'Send Verification Code'}
                                    <ArrowRight size={18} />
                                </button>
                            </form>

                            <div className="auth-footer">
                                <span>Remember your password?</span>
                                <Link to="/login">Sign In</Link>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 2: OTP Verify ────────────────────────── */}
                    {step === STEP_OTP && (
                        <motion.div
                            key="step-otp"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="auth-header">
                                <Link to="/" className="auth-logo">ARTIUM</Link>
                                <h1 className="auth-title">Check Your Email</h1>
                                <p className="auth-subtitle">
                                    We sent a 6-digit code to <strong style={{ color: 'var(--gold)' }}>{email}</strong>.
                                    <br />Enter it below to continue.
                                </p>
                            </div>

                            <form className="auth-form" onSubmit={handleVerifyOtp}>
                                {otpError && <div className="auth-error">{otpError}</div>}

                                <div className="auth-field">
                                    <label htmlFor="otp-input">Verification Code</label>
                                    <div className="auth-input-wrapper otp-input-wrapper">
                                        <KeyRound size={18} />
                                        <input
                                            type="text"
                                            id="otp-input"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="000000"
                                            maxLength={6}
                                            inputMode="numeric"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="otp-actions">
                                    <button type="submit" className="otp-verify-btn" disabled={verifyingOtp}>
                                        {verifyingOtp ? 'Verifying...' : 'Verify Code'}
                                    </button>

                                    <button
                                        type="button"
                                        className={`otp-resend ${cooldown > 0 ? 'disabled' : ''}`}
                                        disabled={cooldown > 0 || sendingOtp}
                                        onClick={handleResendOtp}
                                    >
                                        <RefreshCw size={14} />
                                        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                                    </button>
                                </div>
                            </form>

                            <div className="auth-footer">
                                <span>Wrong email?</span>
                                <button
                                    style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500, marginLeft: 'var(--space-1)' }}
                                    onClick={() => { setStep(STEP_EMAIL); setOtp(''); setOtpError(''); }}
                                >
                                    Go back
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 3: New Password ──────────────────────── */}
                    {step === STEP_RESET && (
                        <motion.div
                            key="step-reset"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="auth-header">
                                <Link to="/" className="auth-logo">ARTIUM</Link>
                                <h1 className="auth-title">Set New Password</h1>
                                <p className="auth-subtitle">
                                    <ShieldCheck size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                                    Choose a strong new password for your account.
                                </p>
                            </div>

                            <form className="auth-form" onSubmit={handleResetPassword}>
                                {resetError && <div className="auth-error">{resetError}</div>}

                                {/* New Password */}
                                <div className="auth-field">
                                    <label htmlFor="new-password">New Password</label>
                                    <div className="auth-input-wrapper">
                                        <Lock size={18} />
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            id="new-password"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="Create a new password"
                                            required
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            className="auth-password-toggle"
                                            onClick={() => setShowNewPassword(v => !v)}
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {/* Strength meter */}
                                    {newPassword && (
                                        <div className="auth-password-requirements">
                                            <div className="auth-password-strength-text">
                                                <span>Password Strength</span>
                                                <span style={{ color: passwordStrengthColor }}>{passwordStrength}</span>
                                            </div>
                                            <div className="password-bars">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`password-bar ${i < passwordScore ? 'met' : ''} ${passwordScore === 5 ? 'strong' : ''}`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="password-req-list">
                                                {passwordReqs.map((req, i) => (
                                                    <span key={i} className={`password-req-item ${req.met ? 'met' : ''}`}>
                                                        {req.met ? '✓' : '○'} {req.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="auth-field">
                                    <label htmlFor="confirm-password">Confirm Password</label>
                                    <div className={`auth-input-wrapper ${confirmPassword && confirmPassword === newPassword ? 'verified' : ''}`}>
                                        <Lock size={18} />
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            id="confirm-password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="Repeat your new password"
                                            required
                                        />
                                    </div>
                                    {confirmPassword && confirmPassword !== newPassword && (
                                        <div className="otp-error" style={{ marginTop: 8 }}>Passwords do not match</div>
                                    )}
                                </div>

                                <button type="submit" className="auth-submit" disabled={resetting}>
                                    {resetting ? 'Resetting...' : 'Reset Password'}
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* ── STEP 4: Success ───────────────────────────── */}
                    {step === STEP_DONE && (
                        <motion.div
                            key="step-done"
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            style={{ textAlign: 'center' }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    background: 'rgba(16, 185, 129, 0.12)',
                                    border: '2px solid rgba(16, 185, 129, 0.35)',
                                    marginBottom: 'var(--space-6)',
                                    color: '#10b981',
                                }}
                            >
                                <CheckCircle2 size={40} />
                            </motion.div>

                            <div className="auth-header" style={{ marginBottom: 'var(--space-6)' }}>
                                <Link to="/" className="auth-logo">ARTIUM</Link>
                                <h1 className="auth-title">Password Reset!</h1>
                                <p className="auth-subtitle">
                                    Your password has been successfully updated.<br />
                                    You can now sign in with your new password.
                                </p>
                            </div>

                            <button
                                className="auth-submit"
                                style={{ width: '100%' }}
                                onClick={() => navigate('/login')}
                            >
                                Continue to Sign In
                                <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </motion.div>
        </div>
    );
}
