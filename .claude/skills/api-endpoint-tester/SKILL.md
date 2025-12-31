# API Endpoint Tester

## Auto-Generated
- **Trigger**: Testing FastAPI endpoints for Phase 2 backend
- **Created**: 2025-12-29
- **Phase**: Phase 2 - Fullstack Web App
- **Reuse Count**: 0

## Purpose
Provide quick and reliable methods for testing FastAPI endpoints with curl commands, validating API contracts, and verifying authentication flows.

## When to Use
- After creating a new API endpoint
- When debugging API issues
- To validate API contract compliance
- Before marking a backend task as complete

## API Base Configuration

```bash
# Local Development
BASE_URL="http://localhost:8000"

# With authentication (get token first)
TOKEN="your-jwt-token-here"
AUTH_HEADER="Authorization: Bearer $TOKEN"
```

## Quick Test Commands

### Health Check
```bash
curl -X GET "$BASE_URL/health"
# Expected: {"status": "healthy"}
```

### List Tasks (GET)
```bash
curl -X GET "$BASE_URL/api/{user_id}/tasks" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json"
```

### Create Task (POST)
```bash
curl -X POST "$BASE_URL/api/{user_id}/tasks" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task"
  }'
```

### Get Single Task (GET)
```bash
curl -X GET "$BASE_URL/api/{user_id}/tasks/{task_id}" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json"
```

### Update Task (PUT)
```bash
curl -X PUT "$BASE_URL/api/{user_id}/tasks/{task_id}" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description"
  }'
```

### Toggle Complete (PATCH)
```bash
curl -X PATCH "$BASE_URL/api/{user_id}/tasks/{task_id}/complete" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json"
```

### Delete Task (DELETE)
```bash
curl -X DELETE "$BASE_URL/api/{user_id}/tasks/{task_id}" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json"
```

## Authentication Testing

### Get JWT Token (via Better Auth flow)
```bash
# Note: Better Auth handles authentication on frontend
# Backend only verifies tokens

# Test invalid token
curl -X GET "$BASE_URL/api/test-user/tasks" \
  -H "Authorization: Bearer invalid-token" \
  -H "Content-Type: application/json"
# Expected: 401 Unauthorized

# Test missing token
curl -X GET "$BASE_URL/api/test-user/tasks" \
  -H "Content-Type: application/json"
# Expected: 401 Unauthorized
```

## Validation Testing

### Empty Title (Should Fail)
```bash
curl -X POST "$BASE_URL/api/{user_id}/tasks" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d '{"title": "", "description": "test"}'
# Expected: 422 Validation Error
```

### Title Too Long (Should Fail)
```bash
# Generate 201 character title
LONG_TITLE=$(python3 -c "print('a' * 201)")
curl -X POST "$BASE_URL/api/{user_id}/tasks" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"$LONG_TITLE\"}"
# Expected: 422 Validation Error
```

### Description Too Long (Should Fail)
```bash
# Generate 1001 character description
LONG_DESC=$(python3 -c "print('a' * 1001)")
curl -X POST "$BASE_URL/api/{user_id}/tasks" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Valid Title\", \"description\": \"$LONG_DESC\"}"
# Expected: 422 Validation Error
```

## Response Format Validation

### Expected Success Response
```json
{
  "id": 1,
  "user_id": "user-123",
  "title": "Task Title",
  "description": "Task description",
  "completed": false,
  "created_at": "2025-12-29T12:00:00Z",
  "updated_at": "2025-12-29T12:00:00Z"
}
```

### Expected Error Responses

#### 401 Unauthorized
```json
{
  "detail": "Invalid or missing authentication token"
}
```

#### 403 Forbidden
```json
{
  "detail": "Not authorized to access this resource"
}
```

#### 404 Not Found
```json
{
  "detail": "Task not found"
}
```

#### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## Full Test Script

```bash
#!/bin/bash
# Phase 2 API Test Script

BASE_URL="http://localhost:8000"
USER_ID="test-user-123"

echo "=== Phase 2 API Testing ==="
echo ""

# 1. Health Check
echo "1. Health Check..."
HEALTH=$(curl -s -X GET "$BASE_URL/health")
echo "   Response: $HEALTH"
echo ""

# 2. Create Task
echo "2. Creating Task..."
TASK=$(curl -s -X POST "$BASE_URL/api/$USER_ID/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task", "description": "Created by test script"}')
echo "   Response: $TASK"
TASK_ID=$(echo $TASK | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo "   Task ID: $TASK_ID"
echo ""

# 3. List Tasks
echo "3. Listing Tasks..."
TASKS=$(curl -s -X GET "$BASE_URL/api/$USER_ID/tasks")
echo "   Response: $TASKS"
echo ""

# 4. Get Single Task
if [ -n "$TASK_ID" ]; then
  echo "4. Getting Single Task..."
  SINGLE=$(curl -s -X GET "$BASE_URL/api/$USER_ID/tasks/$TASK_ID")
  echo "   Response: $SINGLE"
  echo ""

  # 5. Update Task
  echo "5. Updating Task..."
  UPDATED=$(curl -s -X PUT "$BASE_URL/api/$USER_ID/tasks/$TASK_ID" \
    -H "Content-Type: application/json" \
    -d '{"title": "Updated Task", "description": "Modified by test script"}')
  echo "   Response: $UPDATED"
  echo ""

  # 6. Toggle Complete
  echo "6. Toggling Complete..."
  TOGGLED=$(curl -s -X PATCH "$BASE_URL/api/$USER_ID/tasks/$TASK_ID/complete")
  echo "   Response: $TOGGLED"
  echo ""

  # 7. Delete Task
  echo "7. Deleting Task..."
  DELETED=$(curl -s -X DELETE "$BASE_URL/api/$USER_ID/tasks/$TASK_ID")
  echo "   Response: $DELETED"
  echo ""
fi

echo "=== Testing Complete ==="
```

## Using with Python (for complex tests)

```python
import httpx
import asyncio

BASE_URL = "http://localhost:8000"

async def test_api():
    async with httpx.AsyncClient() as client:
        # Health check
        r = await client.get(f"{BASE_URL}/health")
        assert r.status_code == 200
        print(f"Health: {r.json()}")

        # Create task
        r = await client.post(
            f"{BASE_URL}/api/test-user/tasks",
            json={"title": "Test Task"}
        )
        assert r.status_code == 200
        task = r.json()
        print(f"Created: {task}")

        # List tasks
        r = await client.get(f"{BASE_URL}/api/test-user/tasks")
        assert r.status_code == 200
        print(f"Tasks: {r.json()}")

if __name__ == "__main__":
    asyncio.run(test_api())
```

## Interactive API Docs

FastAPI provides automatic documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Checklist for Endpoint Testing

- [ ] Endpoint returns correct status codes
- [ ] Response body matches expected schema
- [ ] Validation errors are properly formatted
- [ ] Authentication is enforced (if required)
- [ ] User can only access their own resources
- [ ] Edge cases are handled (empty data, long strings)
- [ ] Error messages are user-friendly

---

## Version
- **Version**: 1.0.0
- **Created**: 2025-12-29
- **Category**: Backend Testing
- **Reuse Potential**: High (all API endpoints)
