import { useEffect } from 'react';
// @ts-ignore
import MojoAuth from 'mojoauth-web-sdk';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useStore();

    // Get return url or default to /
    const from = (location.state as any)?.from?.pathname || '/';

    useEffect(() => {
        const mojoauth = new MojoAuth('c22b7204-7c33-47aa-b392-987ef4d16940', {
            source: [{ type: 'email', feature: 'magiclink' }],
            redirect_url: window.location.href, // Redirect back to this page to handle token
        });

        mojoauth.signIn().then((payload: any) => {
            console.log('MojoAuth Payload:', payload);
            setUser(payload);
            navigate(from, { replace: true });
        });
    }, [navigate, setUser, from]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <CardTitle className="text-center">Cafe POS Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <div id="mojoauth-passwordless-form" />
                </CardContent>
            </Card>
        </div>
    );
}
