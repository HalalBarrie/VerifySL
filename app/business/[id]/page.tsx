import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Phone, Mail, Calendar, Shield, FileText, User } from 'lucide-react'
import { getBusinessById } from '@/lib/services/search'
import { generateQRCode } from '@/lib/services/qr'
import { VerifiedBadge } from '@/components/ui/verified-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateDistance } from '@/lib/utils'

interface BusinessPageProps {
    params: {
        id: string
    }
}

export default async function BusinessPage({ params }: BusinessPageProps) {
    const business = await getBusinessById(params.id)

    if (!business) {
        notFound()
    }

    const qrCodeDataUrl = await generateQRCode(business.id)

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center" href="/">
                    <Shield className="h-6 w-6 mr-2 text-primary" />
                    <span className="font-bold text-xl">VerifySL</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link
                        className="text-sm font-medium hover:underline underline-offset-4"
                        href="/search"
                    >
                        Search
                    </Link>
                </nav>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <div className="mb-8">
                        <Button variant="ghost" asChild>
                            <Link href="/search">← Back to Search</Link>
                        </Button>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Main Info */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight mb-2">
                                    {business.name}
                                </h1>
                                <div className="flex items-center gap-3">
                                    {business.verified && business.verifiedAt ? (
                                        <VerifiedBadge
                                            businessId={business.id}
                                            verifiedAt={business.verifiedAt}
                                            size="lg"
                                            showDate
                                        />
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
                                            Pending Verification
                                        </span>
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                        Registered {formatDateDistance(business.createdAt)}
                                    </span>
                                </div>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Business Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <FileText className="h-4 w-4" />
                                                Registration Number
                                            </div>
                                            <p className="font-medium">{business.registrationNumber}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="h-4 w-4" />
                                                Owner
                                            </div>
                                            <p className="font-medium">{business.owner}</p>
                                        </div>
                                        {business.businessType && (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Shield className="h-4 w-4" />
                                                    Business Type
                                                </div>
                                                <p className="font-medium">{business.businessType}</p>
                                            </div>
                                        )}
                                        {business.dateRegistered && (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    Date Registered
                                                </div>
                                                <p className="font-medium">
                                                    {new Date(business.dateRegistered).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {business.address && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="font-medium">Address</p>
                                                <p className="text-muted-foreground">{business.address}</p>
                                            </div>
                                        </div>
                                    )}
                                    {business.phoneNumber && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">Phone</p>
                                                <p className="text-muted-foreground">{business.phoneNumber}</p>
                                            </div>
                                        </div>
                                    )}
                                    {business.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">Email</p>
                                                <p className="text-muted-foreground">{business.email}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar / QR Code */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-center">Verification QR</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center space-y-4">
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={qrCodeDataUrl}
                                            alt={`QR Code for ${business.name}`}
                                            width={200}
                                            height={200}
                                            className="h-auto w-full"
                                        />
                                    </div>
                                    <p className="text-sm text-center text-muted-foreground">
                                        Scan to verify this business&apos;s official registration status.
                                    </p>
                                    <Button className="w-full" variant="outline" asChild>
                                        <a href={qrCodeDataUrl} download={`verifysl-${business.registrationNumber}.png`}>
                                            Download QR Code
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>

                            {business.verified && (
                                <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-900/20">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        <p className="font-medium text-green-900 dark:text-green-100">
                                            Officially Verified
                                        </p>
                                    </div>
                                    <p className="mt-2 text-sm text-green-700 dark:text-green-200">
                                        This business has been verified by the Sierra Leone government.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
