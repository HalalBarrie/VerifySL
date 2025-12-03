'use client'

import NextImage from 'next/image'
import { useState, useEffect } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface QRCodeDisplayProps {
    businessId: string
    businessName: string
}

export function QRCodeDisplay({ businessId, businessName }: QRCodeDisplayProps) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const qrUrl = `/api/businesses/${businessId}/qr`

    useEffect(() => {
        // Preload the image
        const img = new Image()
        img.onload = () => setLoading(false)
        img.onerror = () => {
            setError('Failed to load QR code')
            setLoading(false)
        }
        img.src = qrUrl
    }, [qrUrl])

    const handleDownload = async () => {
        try {
            const response = await fetch(qrUrl)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${businessName.replace(/\s+/g, '-')}-qr-code.png`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Download failed:', err)
            alert('Failed to download QR code')
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Share Profile</CardTitle>
                <CardDescription>
                    Scan this QR code to quickly share this business profile
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                {loading && (
                    <div className="flex items-center justify-center w-[300px] h-[300px] bg-muted rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center w-[300px] h-[300px] bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <NextImage
                            src={qrUrl}
                            alt={`QR code for ${businessName}`}
                            width={300}
                            height={300}
                            className="rounded-lg border print:border-0"
                            unoptimized
                        />
                        <p className="text-sm text-muted-foreground text-center">
                            Scan to view profile
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            className="print:hidden"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download QR Code
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
