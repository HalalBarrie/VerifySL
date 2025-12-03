export interface Business {
    id: string
    name: string
    registrationNumber: string
    owner: string
    address?: string | null
    phoneNumber?: string | null
    email?: string | null
    businessType?: string | null
    dateRegistered?: Date | null
    verified: boolean
    verifiedAt?: Date | null
    verifiedBy?: string | null
    ipfsHash?: string | null
    solanaHash?: string | null
    createdAt: Date
    updatedAt: Date
}

export interface Admin {
    id: string
    email: string
    name: string
    createdAt: Date
    updatedAt: Date
}

// Search types
export interface SearchParams {
    query: string
    type: 'name' | 'registrationNumber'
    page?: number
    limit?: number
}

export interface SearchResult {
    businesses: Business[]
    total: number
    suggestions: string[]
}

// Verification types
export interface VerificationRequest {
    businessId: string
    verified: boolean
}

export interface VerificationResponse {
    success: boolean
    business: Business
}

// QR Code types
export interface QRCodeOptions {
    width?: number
    height?: number
    format?: 'png' | 'svg'
}

// API Response types
export interface APIResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// SMS Command types (for future implementation)
export interface SMSCommand {
    command: 'SEARCH' | 'VERIFY'
    query: string
    type?: 'name' | 'registrationNumber'
}
