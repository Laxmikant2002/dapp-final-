# API Documentation

This document provides detailed information about the Voting DApp's API endpoints and usage.

## Authentication API

### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

Response:
```json
{
  "user": {
    "uid": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token"
}
```

### Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "user": {
    "uid": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token"
}
```

### Sign Out
```http
POST /api/auth/signout
Authorization: Bearer jwt_token
```

Response:
```json
{
  "message": "Successfully signed out"
}
```

## Election API

### Create Election
```http
POST /api/elections
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "name": "Presidential Election 2024",
  "description": "Annual presidential election",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "candidates": [
    {
      "name": "Candidate A",
      "description": "Candidate A's platform"
    },
    {
      "name": "Candidate B",
      "description": "Candidate B's platform"
    }
  ]
}
```

Response:
```json
{
  "id": "election123",
  "name": "Presidential Election 2024",
  "description": "Annual presidential election",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "status": "pending",
  "createdAt": "2023-12-01T00:00:00Z"
}
```

### Get Elections
```http
GET /api/elections
Authorization: Bearer jwt_token
```

Response:
```json
{
  "elections": [
    {
      "id": "election123",
      "name": "Presidential Election 2024",
      "description": "Annual presidential election",
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-31T23:59:59Z",
      "status": "active",
      "candidates": [
        {
          "id": "candidate1",
          "name": "Candidate A",
          "votes": 100
        },
        {
          "id": "candidate2",
          "name": "Candidate B",
          "votes": 150
        }
      ]
    }
  ]
}
```

### Get Election Details
```http
GET /api/elections/{electionId}
Authorization: Bearer jwt_token
```

Response:
```json
{
  "id": "election123",
  "name": "Presidential Election 2024",
  "description": "Annual presidential election",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "status": "active",
  "candidates": [
    {
      "id": "candidate1",
      "name": "Candidate A",
      "description": "Candidate A's platform",
      "votes": 100
    },
    {
      "id": "candidate2",
      "name": "Candidate B",
      "description": "Candidate B's platform",
      "votes": 150
    }
  ],
  "totalVotes": 250
}
```

### Cast Vote
```http
POST /api/elections/{electionId}/vote
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "candidateId": "candidate1",
  "walletAddress": "0x123..."
}
```

Response:
```json
{
  "transactionHash": "0xabc...",
  "status": "success",
  "message": "Vote recorded successfully"
}
```

## Admin API

### Update Election Status
```http
PATCH /api/admin/elections/{electionId}/status
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "status": "active"
}
```

Response:
```json
{
  "id": "election123",
  "status": "active",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Get Election Results
```http
GET /api/admin/elections/{electionId}/results
Authorization: Bearer jwt_token
```

Response:
```json
{
  "electionId": "election123",
  "totalVotes": 250,
  "results": [
    {
      "candidateId": "candidate1",
      "name": "Candidate A",
      "votes": 100,
      "percentage": 40
    },
    {
      "candidateId": "candidate2",
      "name": "Candidate B",
      "votes": 150,
      "percentage": 60
    }
  ],
  "votingHistory": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "votes": 50
    },
    {
      "timestamp": "2024-01-02T00:00:00Z",
      "votes": 100
    }
  ]
}
```

## Error Responses

### Authentication Error
```json
{
  "error": {
    "code": "auth/unauthorized",
    "message": "Unauthorized access"
  }
}
```

### Validation Error
```json
{
  "error": {
    "code": "validation/error",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
```

### Not Found Error
```json
{
  "error": {
    "code": "not_found",
    "message": "Resource not found"
  }
}
```

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- Election endpoints: 10 requests per minute
- Admin endpoints: 20 requests per minute

## WebSocket Events

### Election Updates
```javascript
socket.on('election:update', (data) => {
  console.log('Election updated:', data);
});
```

### Vote Cast
```javascript
socket.on('vote:cast', (data) => {
  console.log('Vote cast:', data);
});
```

### Results Update
```javascript
socket.on('results:update', (data) => {
  console.log('Results updated:', data);
});
``` 