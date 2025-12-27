import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// MojoAuth configuration
const MOJOAUTH_API_KEY = 'c22b7204-7c33-47aa-b392-987ef4d16940';

declare global {
    interface Window {
        MojoAuth: any;
    }
}

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || '/';

    useEffect(() => {
        // Load MojoAuth SDK
        const script = document.createElement('script');
        script.src = 'https://cdn.mojoauth.com/js/mojoauth.min.js';
        script.async = true;
        script.onload = () => {
            initializeMojoAuth();
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const initializeMojoAuth = () => {
        if (!window.MojoAuth) return;

        const mojoauth = new window.MojoAuth(MOJOAUTH_API_KEY, {
            language: 'en',
            redirect_url: window.location.origin + '/login',
            source: [{ type: 'email', feature: 'magiclink' }]
        });

        // Render MojoAuth widget
        mojoauth.signInWithMagicLink().then((payload: any) => {
            console.log('MojoAuth payload:', payload);

            if (payload && payload.oauth && payload.oauth.access_token) {
                // Store token and user data
                const user = {
                    uid: payload.user?.identifier || payload.user?.email || 'default-user',
                    email: payload.user?.email || payload.user?.identifier,
                    ...payload.user
                };

                localStorage.setItem('mojoauth_token', payload.oauth.access_token);
                localStorage.setItem('mojoauth_user', JSON.stringify(user));

                // Redirect to app
                navigate(from, { replace: true });
            }
        }).catch((error: any) => {
            console.error('MojoAuth error:', error);
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-8">
            {/* MojoAuth Widget Container - No wrapper, just the widget */}
            <div
                id="mojoauth-passwordless-form"
            ></div>

            {/* Custom Styling for MojoAuth Widget */}
            <style>{`
                /* MojoAuth widget should render its own card */
                #mojoauth-passwordless-form {
                    max-width: 450px;
                    width: 100%;
                }
                
                /* Style the button to match your orange theme */
                #mojoauth-passwordless-form button {
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
                    border: none !important;
                    transition: all 0.2s !important;
                }
                
                #mojoauth-passwordless-form button:hover {
                    background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%) !important;
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3) !important;
                }
                
                /* Input focus color */
                #mojoauth-passwordless-form input:focus {
                    border-color: #f97316 !important;
                    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1) !important;
                }
            `}</style>
        </div>
    );
}

