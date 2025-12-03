import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, User, Mail, Phone, FileText, Calendar, Building2, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { getBusinessById } from '@/lib/services/search'
import { BusinessHeader } from '@/components/business/business-header'
import { QRCodeDisplay } from '@/components/business/qr-code-display'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function BusinessPage({ params }: { params: { id: string } }) {
    const business = await getBusinessById(params.id)

    if (!business) {
        notFound()
    }

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center" href="/">
                    <span className="font-bold text-xl">VerifySL</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link
                        className="text-sm font-medium hover:underline underline-offset-4"
                        href="/search"
                    >
                        Search
                    </Link>
                    <Link
                        className="text-sm font-medium hover:underline underline-offset-4"
                        href="/admin/login"
                    >
                        Admin
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Business Header */}
                    <BusinessHeader business={business} />

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Registration Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Registration Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Registration Number
                                                </p>
                                                <p className="text-base font-semibold">
                                                    {business.registrationNumber}
                                                </p>
                                            </div>
                                        </div>

                                        {business.businessType && (
                                            <div className="flex items-start gap-3">
                                                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Business Type
                                                    </p>
                                                    <p className="text-base">
                                                        {business.businessType}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {business.dateRegistered && (
                                            <div className="flex items-start gap-3">
                                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Date Registered
                                                    </p>
                                                    <p className="text-base">
                                                        {format(new Date(business.dateRegistered), 'PPP')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Last Updated
                                                </p>
                                                <p className="text-base">
                                                    {format(new Date(business.updatedAt), 'PPP')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Owner Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Owner Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Owner Name
                                            </p>
                                            <p className="text-base">
                                                {business.owner}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            {(business.address || business.phoneNumber || business.email) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contact Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {business.address && (
                                            <div className="flex items-start gap-3">
                                                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Address
                                                    </p>
                                                    <p className="text-base">
                                                        {business.address}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {business.phoneNumber && (
                                            <div className="flex items-start gap-3">
                                                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Phone Number
                                                    </p>
                                                    <a
                                                        href={`tel:${business.phoneNumber}`}
                                                        className="text-base hover:underline text-blue-600 dark:text-blue-400"
                                                    >
                                                        {business.phoneNumber}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {business.email && (
                                            <div className="flex items-start gap-3">
                                                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Email
                                                    </p>
                                                    <a
                                                        href={`mailto:${business.email}`}
                                                        className="text-base hover:underline text-blue-600 dark:text-blue-400"
                                                    >
                                                        {business.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* QR Code */}
                            <QRCodeDisplay
                                businessId={business.id}
                                businessName={business.name}
                            />

                            {/* Verification Status */}
                            {business.verified && business.verifiedAt && (
                                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                    <CardHeader>
                                        <CardTitle className="text-green-900 dark:text-green-100">
                                            Verified Business
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-green-700 dark:text-green-200">
                                            This business has been verified by VerifySL on{' '}
                                            {format(new Date(business.verifiedAt), 'PPP')}.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    © 2024 VerifySL. All rights reserved.
                </p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    )
}
