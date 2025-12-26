import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl">Privacy Policy</CardTitle>
                    <p className="text-sm text-gray-500">Last updated: December 27, 2024</p>
                </CardHeader>
                <CardContent className="prose max-w-none">
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to Dil Se Cafe POS System. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you about how we handle your personal data when you use our cafe management system.
                    </p>

                    <h2>2. Information We Collect</h2>
                    <p>We collect and process the following data:</p>
                    <ul>
                        <li><strong>Email Address:</strong> Used for authentication and account identification</li>
                        <li><strong>Menu Items:</strong> Items you add to your cafe menu</li>
                        <li><strong>Orders:</strong> Order information created through the POS system</li>
                        <li><strong>Categories:</strong> Menu categories you create</li>
                    </ul>

                    <h2>3. How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul>
                        <li>Authenticate you and provide access to your cafe data</li>
                        <li>Store and manage your menu items, orders, and categories</li>
                        <li>Provide real-time synchronization across devices</li>
                        <li>Ensure data isolation between different cafe owners</li>
                    </ul>

                    <h2>4. Data Security</h2>
                    <p>
                        We implement industry-standard security measures including:
                    </p>
                    <ul>
                        <li>Firebase Authentication for secure login</li>
                        <li>Firestore security rules to prevent unauthorized access</li>
                        <li>User-scoped data isolation - you can only access your own data</li>
                        <li>Encrypted data transmission (HTTPS)</li>
                    </ul>

                    <h2>5. Data Retention</h2>
                    <p>
                        Your data is retained as long as your account is active. You can request deletion of your account
                        and all associated data at any time by contacting us.
                    </p>

                    <h2>6. Third-Party Services</h2>
                    <p>We use the following third-party services:</p>
                    <ul>
                        <li><strong>Firebase (Google):</strong> For authentication and database services</li>
                        <li><strong>MojoAuth:</strong> For passwordless authentication</li>
                    </ul>

                    <h2>7. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Export your data</li>
                    </ul>

                    <h2>8. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at the email
                        address associated with your account.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
