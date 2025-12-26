import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl">Terms & Conditions</CardTitle>
                    <p className="text-sm text-gray-500">Last updated: December 27, 2024</p>
                </CardHeader>
                <CardContent className="prose max-w-none">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using the Dil Se Cafe POS System, you accept and agree to be bound by the terms
                        and provision of this agreement. If you do not agree to these terms, please do not use this service.
                    </p>

                    <h2>2. Description of Service</h2>
                    <p>
                        Dil Se Cafe POS System is a web-based point-of-sale and cafe management system that allows cafe owners to:
                    </p>
                    <ul>
                        <li>Manage menu items and categories</li>
                        <li>Process customer orders</li>
                        <li>Track order status through kitchen display</li>
                        <li>Generate invoices and receipts</li>
                        <li>Monitor sales and analytics</li>
                    </ul>

                    <h2>3. User Account</h2>
                    <p>
                        You are responsible for:
                    </p>
                    <ul>
                        <li>Maintaining the confidentiality of your account</li>
                        <li>All activities that occur under your account</li>
                        <li>Ensuring your email address is valid and up-to-date</li>
                        <li>Notifying us immediately of any unauthorized use</li>
                    </ul>

                    <h2>4. Acceptable Use</h2>
                    <p>You agree NOT to:</p>
                    <ul>
                        <li>Use the service for any illegal purposes</li>
                        <li>Attempt to access other users' data</li>
                        <li>Interfere with the proper functioning of the service</li>
                        <li>Upload any malicious code or viruses</li>
                        <li>Reverse engineer or attempt to extract source code</li>
                    </ul>

                    <h2>5. Data and Content</h2>
                    <p>
                        You retain all rights to your data (menu items, orders, etc.). By using this service, you grant us
                        permission to store and process your data to provide the service functionality.
                    </p>

                    <h2>6. Service Availability</h2>
                    <p>
                        We strive to provide 99% uptime, but we do not guarantee uninterrupted access to the service.
                        We may perform maintenance or updates that temporarily affect availability.
                    </p>

                    <h2>7. Limitation of Liability</h2>
                    <p>
                        The service is provided "as is" without warranties of any kind. We are not liable for any damages
                        arising from the use or inability to use this service, including but not limited to:
                    </p>
                    <ul>
                        <li>Loss of data</li>
                        <li>Loss of profits or revenue</li>
                        <li>Service interruptions</li>
                        <li>Data breaches (beyond our reasonable security measures)</li>
                    </ul>

                    <h2>8. Modifications to Service</h2>
                    <p>
                        We reserve the right to modify, suspend, or discontinue the service at any time with or without notice.
                        We may also modify these terms at any time, and continued use constitutes acceptance of modified terms.
                    </p>

                    <h2>9. Termination</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice, for:
                    </p>
                    <ul>
                        <li>Violation of these terms</li>
                        <li>Illegal activity</li>
                        <li>Extended period of inactivity</li>
                    </ul>

                    <h2>10. GST Compliance (India)</h2>
                    <p>
                        This system is designed to help you comply with Indian GST requirements. However, you are solely
                        responsible for ensuring your business complies with all applicable tax laws and regulations.
                    </p>

                    <h2>11. Contact Information</h2>
                    <p>
                        For any questions regarding these Terms & Conditions, please contact us at the email address
                        associated with your account.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
