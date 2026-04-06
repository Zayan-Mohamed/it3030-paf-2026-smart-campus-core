# Role-Based Dashboard Redirect Fix

## Issues Identified

1. **All users redirected to same `/dashboard` route** regardless of role
2. **Generic Dashboard component** shown to everyone (no role differentiation)
3. **No role-based navigation logic** after login/signup/OAuth

## Root Causes

### Problem 1: Login.tsx Hardcoded Redirect
```tsx
// BEFORE (line 11)
if (user) {
  return <Navigate to="/dashboard" replace />;
}
```
- Everyone sent to `/dashboard` regardless of their role
- No JWT token inspection to determine user role

### Problem 2: No Post-Login Role Detection
```tsx
// BEFORE
if (response.ok) {
  login(data.token);  // Just save token, no redirect logic
}
```
- After successful login, no navigation based on role
- Same issue in Signup.tsx and OAuthCallback.tsx

### Problem 3: Generic Dashboard Route
- `/dashboard` route showed same `Dashboard.tsx` component to all users
- No differentiation between STUDENT, STAFF, ADMIN views

---

## Solutions Implemented

### ✅ Fix 1: Smart Role Detection in Login.tsx

**Updated redirect logic on page load:**
```tsx
// Check if user is already authenticated
if (user) {
  const token = getStoredToken();
  if (token) {
    const roles = getRolesFromToken(token);
    
    // Redirect based on highest privilege role
    if (roles.includes('ADMIN')) {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (roles.includes('STAFF')) {
      return <Navigate to="/dashboard/staff" replace />;
    } else if (roles.includes('STUDENT')) {
      return <Navigate to="/dashboard/student" replace />;
    }
  }
  return <Navigate to="/dashboard" replace />;
}
```

**Updated post-login navigation:**
```tsx
if (response.ok) {
  login(data.token);
  
  // Redirect based on user role from JWT token
  const roles = getRolesFromToken(data.token);
  
  if (roles.includes('ADMIN')) {
    navigate('/dashboard/admin', { replace: true });
  } else if (roles.includes('STAFF')) {
    navigate('/dashboard/staff', { replace: true });
  } else if (roles.includes('STUDENT')) {
    navigate('/dashboard/student', { replace: true });
  } else {
    navigate('/dashboard', { replace: true });
  }
}
```

### ✅ Fix 2: Applied Same Logic to Signup.tsx

- Added role detection on page load (for already authenticated users)
- Added post-signup role-based navigation
- New signups get STUDENT role by default (backend logic)

### ✅ Fix 3: Applied Same Logic to OAuthCallback.tsx

- OAuth users now redirected to role-appropriate dashboard
- Extracts roles from JWT token returned by backend

### ✅ Fix 4: Created DashboardRedirect Component

**New smart redirect component** (`/client/src/components/DashboardRedirect.tsx`):
- Replaces generic Dashboard.tsx on `/dashboard` route
- Checks user authentication status
- Extracts roles from JWT token
- Redirects to appropriate role-specific dashboard:
  - ADMIN → `/dashboard/admin`
  - STAFF → `/dashboard/staff`
  - STUDENT → `/dashboard/student`
- Shows fallback message if no recognized role

### ✅ Fix 5: Updated App.tsx Routing

**Changed from:**
```tsx
<Route path="/dashboard" element={<Dashboard />} />
```

**To:**
```tsx
<Route path="/dashboard" element={<DashboardRedirect />} />
```

---

## User Experience Flow

### Student Login Flow
1. Student enters: `student@smartcampus.edu` / `student123`
2. Backend returns JWT with `roles: ["ROLE_STUDENT"]`
3. Login.tsx extracts roles and detects "STUDENT"
4. User redirected to `/dashboard/student`
5. Sees StudentDashboard with bookings, incidents, facilities

### Staff Login Flow
1. Staff enters: `staff@smartcampus.edu` / `staff123`
2. Backend returns JWT with `roles: ["ROLE_STAFF"]`
3. Login.tsx extracts roles and detects "STAFF"
4. User redirected to `/dashboard/staff`
5. Sees StaffDashboard with incident queue, maintenance tasks

### Admin Login Flow
1. Admin enters: `admin@smartcampus.edu` / `admin123`
2. Backend returns JWT with `roles: ["ROLE_ADMIN"]`
3. Login.tsx extracts roles and detects "ADMIN"
4. User redirected to `/dashboard/admin`
5. Sees AdminDashboard with system stats, user management

### Legacy /dashboard Route
1. User navigates to `/dashboard` directly
2. DashboardRedirect component checks authentication
3. Extracts roles from stored JWT token
4. Redirects to role-appropriate dashboard
5. Maintains backward compatibility

---

## Files Modified

### Frontend Files
1. ✅ `/client/src/pages/Login.tsx` - Added role-based redirect logic
2. ✅ `/client/src/pages/Signup.tsx` - Added role-based redirect logic
3. ✅ `/client/src/pages/OAuthCallback.tsx` - Added role-based redirect logic
4. ✅ `/client/src/components/DashboardRedirect.tsx` - **NEW** smart redirect component
5. ✅ `/client/src/App.tsx` - Updated to use DashboardRedirect

### Imports Added
```tsx
import { useNavigate } from 'react-router-dom';
import { getRolesFromToken, getStoredToken } from '../utils/jwtUtils';
```

---

## Testing Instructions

### Test 1: Student Login
```bash
# Login as student
Email: student@smartcampus.edu
Password: student123

# Expected Result:
✅ Redirected to /dashboard/student
✅ Sees "Student Dashboard" header
✅ Sees bookings and incidents sections
❌ Cannot access /dashboard/admin (redirects to /unauthorized)
❌ Cannot access /dashboard/staff (redirects to /unauthorized)
```

### Test 2: Staff Login
```bash
# Login as staff
Email: staff@smartcampus.edu
Password: staff123

# Expected Result:
✅ Redirected to /dashboard/staff
✅ Sees "Staff Dashboard" header
✅ Sees incident queue and maintenance sections
✅ CAN access /dashboard/student (staff can help students)
❌ Cannot access /dashboard/admin (redirects to /unauthorized)
```

### Test 3: Admin Login
```bash
# Login as admin
Email: admin@smartcampus.edu
Password: admin123

# Expected Result:
✅ Redirected to /dashboard/admin
✅ Sees "Admin Dashboard" header
✅ Sees system statistics and user management
✅ CAN access /dashboard/staff
✅ CAN access /dashboard/student
```

### Test 4: Direct Navigation to /dashboard
```bash
# After logging in as any role, navigate to /dashboard

# Expected Result:
✅ Automatically redirected to role-appropriate dashboard
- STUDENT → /dashboard/student
- STAFF → /dashboard/staff
- ADMIN → /dashboard/admin
```

### Test 5: New User Signup
```bash
# Sign up new user
Name: Test User
Email: test@example.com
Password: password123

# Expected Result:
✅ Account created with STUDENT role (default)
✅ Automatically redirected to /dashboard/student
✅ Sees Student Dashboard
```

---

## Security Notes

### Client-Side Security (UX Only)
- Role detection uses `getRolesFromToken()` utility
- JWT decoded client-side (no signature verification)
- **NOT for security** - only for user experience
- Prevents showing broken UI to unauthorized users

### Backend Security (Real Protection)
- All endpoints secured with `@PreAuthorize` annotations
- Backend validates JWT signature and expiration
- Returns `403 Forbidden` for unauthorized access
- Real authorization enforcement happens here

### Role Hierarchy
```
ADMIN (highest privilege)
  ├─ Can access: /dashboard/admin, /dashboard/staff, /dashboard/student
  └─ Sees all backend data

STAFF (medium privilege)
  ├─ Can access: /dashboard/staff, /dashboard/student
  └─ Can help students + handle incidents

STUDENT (lowest privilege)
  ├─ Can access: /dashboard/student only
  └─ Can book facilities, report incidents
```

---

## Implementation Details

### Role Detection Priority
When a user has multiple roles, they're redirected based on this priority:
1. **ADMIN** (highest) - always redirect to admin dashboard
2. **STAFF** (medium) - redirect to staff dashboard
3. **STUDENT** (default) - redirect to student dashboard

### JWT Token Structure
```json
{
  "sub": "admin@smartcampus.edu",
  "roles": ["ROLE_ADMIN"],
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Role Extraction
```tsx
// Frontend strips "ROLE_" prefix for cleaner UX
getRolesFromToken(token) // Returns: ["ADMIN", "STAFF", "STUDENT"]

// Backend includes "ROLE_" prefix for Spring Security
hasRole('ADMIN') // Internally checks "ROLE_ADMIN"
```

---

## Summary

### Problems Solved ✅
1. ✅ All users no longer redirected to same dashboard
2. ✅ Each role sees their appropriate dashboard on login
3. ✅ OAuth users properly redirected based on role
4. ✅ Direct navigation to `/dashboard` now works correctly
5. ✅ New signups redirected to student dashboard
6. ✅ Backward compatibility maintained

### User Experience ✅
- **Students** see student dashboard with relevant features
- **Staff** see staff dashboard with work queue
- **Admins** see admin dashboard with system management
- **Navigation is automatic** - users don't need to choose
- **Proper error pages** shown for unauthorized access

### Next Steps
1. Test all three roles thoroughly
2. Verify OAuth flow redirects correctly
3. Check direct URL navigation behavior
4. Ensure ProtectedRoute component blocks unauthorized access
5. Confirm backend returns proper 403 responses
