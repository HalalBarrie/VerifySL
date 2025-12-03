# VerifySL API Documentation

## Base URL
```
Local: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints are public. Admin endpoints require Supabase authentication.

---

## Public Endpoints

### Search Businesses

Search for businesses by name or registration number.

**Endpoint**: `GET /businesses/search`

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | - | Search query |
| `type` | string | No | `name` | Search type: `name` or `registrationNumber` |
| `limit` | number | No | 20 | Maximum results to return |

**Example Requests**:
```bash
# Search by name
GET /businesses/search?query=Sierra%20Tech&type=name

# Search by registration number
GET /businesses/search?query=RC123456&type=registrationNumber

# Search with limit
GET /businesses/search?query=market&type=name&limit=10
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "businesses": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Sierra Tech Solutions",
        "registrationNumber": "RC123456",
        "owner": "John Doe",
        "address": "15 Wilkinson Road, Freetown",
        "phoneNumber": "+232 76 123456",
        "email": "info@sierratech.sl",
        "businessType": "Technology",
        "dateRegistered": "2020-01-15T00:00:00.000Z",
        "verified": true,
        "verifiedAt": "2024-12-01T10:30:00.000Z",
        "verifiedBy": "admin-id",
        "createdAt": "2024-11-01T08:00:00.000Z",
        "updatedAt": "2024-12-01T10:30:00.000Z"
      }
    ],
    "total": 1,
    "suggestions": []
  },
  "message": "Found 1 business(es)"
}
```

**Error Responses**:

400 Bad Request - Missing or invalid query parameter:
```json
{
  "success": false,
  "error": "Query parameter is required"
}
```

500 Internal Server Error:
```json
{
  "success": false,
  "error": "Failed to search businesses"
}
```

---

### Get Business Profile

Retrieve detailed information about a specific business.

**Endpoint**: `GET /businesses/:id`

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Business ID |

**Example Request**:
```bash
GET /businesses/550e8400-e29b-41d4-a716-446655440000
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Sierra Tech Solutions",
    "registrationNumber": "RC123456",
    "owner": "John Doe",
    "address": "15 Wilkinson Road, Freetown",
    "phoneNumber": "+232 76 123456",
    "email": "info@sierratech.sl",
    "businessType": "Technology",
    "dateRegistered": "2020-01-15T00:00:00.000Z",
    "verified": true,
    "verifiedAt": "2024-12-01T10:30:00.000Z",
    "verifiedBy": "admin-id",
    "ipfsHash": null,
    "solanaHash": null,
    "createdAt": "2024-11-01T08:00:00.000Z",
    "updatedAt": "2024-12-01T10:30:00.000Z"
  },
  "message": "Business retrieved successfully"
}
```

**Error Responses**:

400 Bad Request - Invalid business ID:
```json
{
  "success": false,
  "error": "Business ID is required"
}
```

404 Not Found - Business doesn't exist:
```json
{
  "success": false,
  "error": "Business not found"
}
```

---

### Generate QR Code

Generate a QR code for a business profile.

**Endpoint**: `GET /businesses/:id/qr`

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Business ID |

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `width` | number | No | 300 | QR code width in pixels |

**Example Requests**:
```bash
# Default size (300x300)
GET /businesses/550e8400-e29b-41d4-a716-446655440000/qr

# Custom size
GET /businesses/550e8400-e29b-41d4-a716-446655440000/qr?width=500
```

**Response** (200 OK):
- **Content-Type**: `image/png`
- **Cache-Control**: `public, max-age=86400` (24 hours)
- **Body**: PNG image binary

**Headers**:
```
Content-Type: image/png
Cache-Control: public, max-age=86400
Content-Disposition: inline; filename="Business-Name-qr.png"
```

**Error Responses**:

400 Bad Request - Invalid business ID:
```json
{
  "success": false,
  "error": "Invalid business ID"
}
```

404 Not Found - Business doesn't exist:
```json
{
  "success": false,
  "error": "Business not found"
}
```

---

## Admin Endpoints

### Verify/Unverify Business

Update the verification status of a business. Requires admin authentication.

**Endpoint**: `POST /admin/businesses/verify`

**Authentication**: Required (Supabase Bearer Token)

**Request Headers**:
```
Authorization: Bearer {supabase-access-token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "businessId": "550e8400-e29b-41d4-a716-446655440000",
  "verified": true
}
```

**Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `businessId` | string (UUID) | Yes | Business ID to verify/unverify |
| `verified` | boolean | Yes | `true` to verify, `false` to unverify |

**Example Request**:
```bash
# Verify a business
POST /admin/businesses/verify
Content-Type: application/json
Authorization: Bearer {token}

{
  "businessId": "550e8400-e29b-41d4-a716-446655440000",
  "verified": true
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "success": true,
    "business": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Sierra Tech Solutions",
      "verified": true,
      "verifiedAt": "2024-12-03T00:15:00.000Z",
      "verifiedBy": "admin-user-id",
      // ... other business fields
    }
  },
  "message": "Business verified successfully"
}
```

**Error Responses**:

401 Unauthorized - Missing or invalid authentication:
```json
{
  "success": false,
  "error": "Unauthorized. Admin authentication required."
}
```

400 Bad Request - Invalid request body:
```json
{
  "success": false,
  "error": "Business ID and verified status are required"
}
```

500 Internal Server Error:
```json
{
  "success": false,
  "error": "Failed to update verification status"
}
```

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently, no rate limiting is implemented. This should be added in production.

**Recommended limits**:
- Public endpoints: 100 requests per minute per IP
- Admin endpoints: 60 requests per minute per user

---

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for all origins in development. In production, restrict to specific domains.

---

## Data Types

### Business Object

```typescript
{
  id: string                    // UUID
  name: string                  // Business name
  registrationNumber: string    // Unique registration number
  owner: string                 // Owner name
  address?: string | null       // Physical address
  phoneNumber?: string | null   // Contact phone
  email?: string | null         // Contact email
  businessType?: string | null  // Type of business
  dateRegistered?: Date | null  // Registration date
  verified: boolean             // Verification status
  verifiedAt?: Date | null      // Verification timestamp
  verifiedBy?: string | null    // Admin ID who verified
  ipfsHash?: string | null      // IPFS document hash (future)
  solanaHash?: string | null    // Solana blockchain hash (future)
  createdAt: Date              // Record creation timestamp
  updatedAt: Date              // Last update timestamp
}
```

---

## Examples

### JavaScript/TypeScript

```typescript
// Search businesses
const searchBusinesses = async (query: string, type: 'name' | 'registrationNumber') => {
  const response = await fetch(
    `/api/businesses/search?query=${encodeURIComponent(query)}&type=${type}`
  )
  const data = await response.json()
  return data.data
}

// Get business profile
const getBusinessProfile = async (id: string) => {
  const response = await fetch(`/api/businesses/${id}`)
  const data = await response.json()
  return data.data
}

// Verify business (admin only)
const verifyBusiness = async (businessId: string, verified: boolean, token: string) => {
  const response = await fetch('/api/admin/businesses/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ businessId, verified })
  })
  const data = await response.json()
  return data.data
}
```

### Python

```python
import requests

# Search businesses
def search_businesses(query, search_type='name'):
    response = requests.get(
        'http://localhost:3000/api/businesses/search',
        params={'query': query, 'type': search_type}
    )
    return response.json()['data']

# Get business profile
def get_business(business_id):
    response = requests.get(f'http://localhost:3000/api/businesses/{business_id}')
    return response.json()['data']

# Download QR code
def download_qr_code(business_id, filename='qr.png'):
    response = requests.get(f'http://localhost:3000/api/businesses/{business_id}/qr')
    with open(filename, 'wb') as f:
        f.write(response.content)
```

### cURL

```bash
# Search by name
curl "http://localhost:3000/api/businesses/search?query=tech&type=name"

# Search by registration number
curl "http://localhost:3000/api/businesses/search?query=RC123&type=registrationNumber"

# Get business profile
curl "http://localhost:3000/api/businesses/{id}"

# Download QR code
curl "http://localhost:3000/api/businesses/{id}/qr" --output qr.png

# Verify business (requires auth token)
curl -X POST "http://localhost:3000/api/admin/businesses/verify" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {your-token}" \
  -d '{"businessId":"{id}","verified":true}'
```

---

## Support

For API support or questions:
- Email: dev@verifysl.gov.sl
- GitHub Issues: https://github.com/verifysl/issues

---

**Last Updated**: December 3, 2024
