# RBAC Testing Guide

This guide will walk you through testing the Role-Based Access Control implementation in the Smart Campus Operations Hub.

## 📋 Test Users

The system has been pre-populated with three test users with different roles:

| Email | Password | Role | Access Level |
|-------|----------|------|--------------|
| `admin@smartcampus.edu` | `admin123` | ADMIN | Full system access (all dashboards) |
| `staff@smartcampus.edu` | `staff123` | STAFF | Staff dashboard + Student dashboard |
| `student@smartcampus.edu` | `student123` | STUDENT | Student dashboard only |

## 🚀 Getting Started

### 1. Start the Backend

```bash
cd api
./mvnw spring-boot:run
```

The `DataInitializer` will automatically create the test users on startup. Look for these log messages:

```
🚀 Starting data initialization...
✅ Created ADMIN user: admin@smartcampus.edu (password: admin123)
✅ Created STAFF user: staff@smartcampus.edu (password: staff123)
✅ Created STUDENT user: student@smartcampus.edu (password: student123)
🎉 Data initialization complete!
```

### 2. Start the Frontend

```bash
cd client
npm run dev
```

Navigate to `http://localhost:5173`

---

## 🧪 Test Scenarios

### Test 1: Student Access (STUDENT Role)

**Goal:** Verify STUDENT role has limited access

1. **Login** as student:
   - Email: `student@smartcampus.edu`
   - Password: `student123`

2. **Expected Results:**
   - ✅ Can access `/dashboard/student`
   - ❌ **Cannot** access `/dashboard/admin` (should redirect to `/unauthorized`)
   - ❌ **Cannot** access `/dashboard/staff` (should redirect to `/unauthorized`)

3. **API Endpoints to Test:**

   ```bash
   # Get JWT token first
   TOKEN=$(curl -X POST http://localhost:8080/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"student@smartcampus.edu","password":"student123"}' \
     | jq -r '.token')

   # ✅ Should work (200 OK)
   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/v1/dashboard/student/welcome

   # ❌ Should fail (403 Forbidden)
   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/v1/dashboard/admin/welcome

   # ❌ Should fail (403 Forbidden)
   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/v1/dashboard/staff/welcome
   ```

---

### Test 2: Staff Access (STAFF Role)

**Goal:** Verify STAFF role has access to staff and student dashboards

1. **Login** as staff:
   - Email: `staff@smartcampus.edu`
   - Password: `staff123`

2. **Expected Results:**
   - ✅ Can access `/dashboard/staff`
   - ✅ Can access `/dashboard/student` (staff can see student view)
   - ❌ **Cannot** access `/dashboard/admin` (should redirect to `/unauthorized`)

3. **API Endpoints to Test:**

   ```bash
   # Get JWT token
   TOKEN=$(curl -X POST http://localhost:8080/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"staff@smartcampus.edu","password":"staff123"}' \
     | jq -r '.token')

   # ✅ Should work (200 OK)
   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/v1/dashboard/staff/welcome

   # ✅ Should work (200 OK) - Staff can access student endpoints
   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/v1/dashboard/student/welcome

   # ❌ Should fail (403 Forbidden)
   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/v1/dashboard/admin/welcome
   ```

---

### Test 3: Admin Access (ADMIN Role)

**Goal:** Verify ADMIN role has full system access

1. **Login** as admin:
   - Email: `admin@smartcampus.edu`
   - Password: `admin123`

2. **Expected Results:**
   - ✅ Can access `/dashboard/admin`
   - ✅ Can access `/dashboard/staff`
   - ✅ Can access `/dashboard/student`
   - ✅ Has access to all backend endpoints

3. **API Endpoints to Test:**

   ```bash
   # Get JWT token
   TOKEN=$(curl -X POST http://localhost:8080/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@smartcampus.edu","password":"admin123"}' \
     | jq -r '.token')

   # ✅ All should work (200 OK)
   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/v1/dashboard/admin/welcome

   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/v1/dashboard/staff/welcome

   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/v1/dashboard/student/welcome
   ```

---

### Test 4: Unauthenticated Access

**Goal:** Verify endpoints are protected without valid JWT

1. **Try accessing endpoints without authentication:**

   ```bash
   # ❌ All should fail (401 Unauthorized)
   curl http://localhost:8080/api/v1/dashboard/student/welcome
   curl http://localhost:8080/api/v1/dashboard/staff/welcome
   curl http://localhost:8080/api/v1/dashboard/admin/welcome
   ```

2. **Expected Result:** All requests return `401 Unauthorized`

---

### Test 5: Frontend Role-Based Navigation

**Goal:** Verify frontend properly hides/shows navigation based on roles

1. **Login as STUDENT** and check:
   - Sidebar should only show student-related links
   - Should NOT show "Admin Panel" or "Staff Portal" in navigation

2. **Login as STAFF** and check:
   - Sidebar should show staff-related links
   - Should NOT show "Admin Panel" in navigation

3. **Login as ADMIN** and check:
   - Sidebar should show all navigation options
   - Should have access to "Admin Panel", "Staff Portal", and "Student View"

---

## 🔍 Verification Checklist

- [ ] DataInitializer creates 3 test users on startup
- [ ] JWT tokens contain correct roles in payload
- [ ] Backend returns 403 when accessing unauthorized endpoints
- [ ] Backend returns 401 when no JWT token provided
- [ ] Frontend redirects to `/login` when not authenticated
- [ ] Frontend redirects to `/unauthorized` when insufficient permissions
- [ ] ProtectedRoute component correctly validates roles
- [ ] Admin can access all dashboards
- [ ] Staff can access staff + student dashboards
- [ ] Student can only access student dashboard
- [ ] Navigation menus adapt based on user role

---

## 🐛 Troubleshooting

### Issue: "User already exists" error on startup

**Solution:** Users are only created once. If you see this, the users already exist in the database. You can proceed with testing.

### Issue: JWT token expired

**Solution:** Login again to get a fresh token. Tokens expire after a configured duration.

### Issue: 401 Unauthorized on all endpoints

**Check:**
1. JWT token is included in `Authorization: Bearer <token>` header
2. Token is not expired (decode at jwt.io to check `exp` claim)
3. Backend is running on port 8080

### Issue: 403 Forbidden but should have access

**Check:**
1. Decode JWT token at jwt.io
2. Verify `roles` claim contains expected role (e.g., `["ROLE_ADMIN"]`)
3. Check backend logs for authorization failures
4. Verify `@PreAuthorize` annotations match role names

---

## 📚 Additional Resources

### Decoding JWT Tokens

Use [jwt.io](https://jwt.io) to decode tokens and inspect claims:
- `sub`: User email
- `roles`: Array of roles (e.g., `["ROLE_STUDENT"]`)
- `exp`: Expiration timestamp
- `iat`: Issued at timestamp

### Backend Security Configuration

- `SecurityConfig.java` - Main security configuration
- `JwtAuthenticationFilter.java` - JWT validation filter
- `@PreAuthorize` annotations - Method-level security on controllers

### Frontend Security Components

- `AuthContext.tsx` - Authentication state management
- `ProtectedRoute.tsx` - Route-level authorization
- `jwtUtils.ts` - Client-side JWT decoding utilities

---

## ✅ Success Criteria

Your RBAC implementation is working correctly if:

1. ✅ Each role can only access their authorized dashboards
2. ✅ Backend returns 403 for unauthorized access attempts
3. ✅ Frontend redirects to `/unauthorized` for insufficient permissions
4. ✅ Admin has full system access
5. ✅ JWT tokens contain correct role information
6. ✅ All security checks happen on both frontend (UX) and backend (security)

---

## 🚨 Security Reminders

1. **Never trust client-side checks alone** - All authorization MUST be enforced on the backend
2. **JWT tokens contain sensitive data** - Never log tokens in production
3. **Remove DataInitializer in production** - Test users should not exist in production
4. **Use strong passwords** - The test passwords are only for development
5. **Validate JWT signatures** - Backend must verify token signatures (already implemented in JwtService)
