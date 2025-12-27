import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'linking' | 'sending' | 'sent'>('idle');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = (location.state as any)?.from?.pathname || '/';

    // Handle incoming Magic Link
    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            setStatus('linking');
            let storedEmail = window.localStorage.getItem('emailForSignIn');

            if (!storedEmail) {
                // If user clicks link on a different device
                storedEmail = window.prompt('Please provide your email for confirmation');
            }

            if (storedEmail) {
                setLoading(true);
                signInWithEmailLink(auth, storedEmail, window.location.href)
                    .then(() => {
                        window.localStorage.removeItem('emailForSignIn');
                        navigate(from, { replace: true });
                    })
                    .catch((err) => {
                        console.error(err);
                        setError('Failed to sign in. The link may have expired.');
                        setStatus('idle');
                    })
                    .finally(() => setLoading(false));
            } else {
                setStatus('idle');
            }
        }
    }, [navigate, from]);

    const handleSendLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setStatus('sending');

        const actionCodeSettings = {
            url: window.location.origin + '/login',
            handleCodeInApp: true,
        };

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            setStatus('sent');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to send login link');
            setStatus('idle');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Google login failed');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'linking') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-neutral-500 font-medium">Signing you in...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-primary-500">
                <CardHeader className="text-center pt-8">
                    <CardTitle className="text-3xl font-extrabold text-secondary-900">Dil Se Cafe</CardTitle>
                    <p className="text-neutral-500 mt-2">Passwordless Login</p>
                </CardHeader>
                <CardContent className="p-8">
                    {status === 'sent' ? (
                        <div className="text-center space-y-6">
                            <div className="bg-green-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-green-100">
                                <span className="text-2xl">📧</span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-secondary-900">Check your email!</h3>
                                <p className="text-neutral-500">
                                    A magic login link has been sent to <strong>{email}</strong>.
                                    Click the link in your email to log in.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full h-11"
                                onClick={() => setStatus('idle')}
                            >
                                Back to Log In
                            </Button>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleSendLink} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-secondary-800">Email Address</label>
                                    <Input
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-white border-neutral-200 focus:ring-primary-500 h-11"
                                    />
                                    <p className="text-[11px] text-neutral-400">We'll email you a magic link to log in instantly.</p>
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100 italic">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-11 text-lg font-bold shadow-lg"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Send Magic Link'
                                    )}
                                </Button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-neutral-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-3 text-neutral-400 font-medium">Or</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-11 border-neutral-200 hover:bg-neutral-50 text-secondary-900 font-semibold shadow-sm"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                            >
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    className="w-5 h-5 mr-3"
                                />
                                Continue with Google
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
