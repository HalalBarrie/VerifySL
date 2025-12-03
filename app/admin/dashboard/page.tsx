import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllBusinesses, getUnverifiedBusinesses, getVerifiedBusinesses } from '@/lib/services/search'
import { BusinessTable } from '@/components/admin/business-table'
import { Building2, CheckCircle, Clock } from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/admin/login')
    }

    // Fetch business statistics
    const [{ total }, unverifiedBusinesses, verifiedBusinesses] = await Promise.all([
        getAllBusinesses(1, 1),
        getUnverifiedBusinesses(50),
        getVerifiedBusinesses(10)
    ])

    const pendingCount = unverifiedBusinesses.length
    const verifiedCount = verifiedBusinesses.length

    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
                <div className="flex-1">
                    <h1 className="font-semibold text-lg">VerifySL Admin</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                        View Site
                    </Link>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                    <form action="/auth/signout" method="post">
                        <Button variant="outline" size="sm">Sign out</Button>
                    </form>
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Businesses
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{total}</div>
                            <p className="text-xs text-muted-foreground">
                                Registered businesses
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Verified Businesses
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{verifiedCount}</div>
                            <p className="text-xs text-muted-foreground">
                                {total > 0 ? `${Math.round((verifiedCount / total) * 100)}% of total` : 'No businesses yet'}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Verification
                            </CardTitle>
                            <Clock className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingCount}</div>
                            <p className="text-xs text-muted-foreground">
                                {pendingCount > 0 ? 'Requires attention' : 'All verified'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Verifications */}
                {pendingCount > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-lg md:text-2xl">Pending Verifications</h2>
                            <p className="text-sm text-muted-foreground">{pendingCount} businesses</p>
                        </div>
                        <BusinessTable businesses={unverifiedBusinesses} adminId={user.id} />
                    </div>
                )}

                {/* Recently Verified */}
                {verifiedCount > 0 && (
                    <div className="space-y-4">
                        <h2 className="font-semibold text-lg md:text-2xl">Recently Verified</h2>
                        <BusinessTable businesses={verifiedBusinesses} adminId={user.id} showVerified />
                    </div>
                )}

                {/* Empty State */}
                {total === 0 && (
                    <div className="border shadow-sm rounded-lg p-4">
                        <p className="text-muted-foreground text-center py-10">No businesses registered yet.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
