import Link from "next/link"
import { Shield } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold text-foreground">VerifySL</span>
                    </Link>
                </div>
                <nav className="flex items-center gap-4">
                    <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Search
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        About
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/register">Register Business</Link>
                        </Button>
                    </div>
                </nav>
            </div>
        </header>
    )
}
