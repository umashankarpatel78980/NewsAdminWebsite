import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import './ForgotPassword.css';
import './LoginPage.css'; // Reuse some login styles

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call for password reset
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="login-wrapper">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>

                <div className="login-card-container">
                    <div className="login-card glass-morphism text-center">
                        <div className="success-icon-box">
                            <CheckCircle2 size={60} className="text-success" />
                        </div>
                        <h2 className="mt-4">Check your email</h2>
                        <p className="text-secondary-light">
                            We've sent a password reset link to <br />
                            <strong>{email}</strong>
                        </p>

                        <div className="mt-8">
                            <Link to="/login" className="login-submit-btn" style={{ textDecoration: 'none' }}>
                                Back to Sign In
                            </Link>
                        </div>

                        <p className="resend-text mt-6">
                            Didn't receive the email? <button className="btn-link" onClick={() => setIsSubmitted(false)}>Try again</button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-wrapper">
            {/* Animated Background Blobs */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>

            <div className="login-card-container">
                <div className="login-card glass-morphism">
                    <div className="login-header text-center">
                        <div className="app-logo-box">
                            <ShieldCheck className="logo-icon-main" size={40} />
                        </div>
                        <h2>Reset Password</h2>
                        <p className="text-secondary-light">Enter your email and we'll send you a link to reset your password</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group-login">
                            <label>Email Address</label>
                            <div className="input-with-icon">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`login-submit-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loader"></span>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>

                    <div className="login-footer text-center">
                        <Link to="/login" className="back-to-login">
                            <ArrowLeft size={16} />
                            <span>Back to Sign In</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
