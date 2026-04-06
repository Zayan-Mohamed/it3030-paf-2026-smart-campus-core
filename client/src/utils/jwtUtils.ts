/**
 * JWT utility functions for decoding and extracting role information.
 * SECURITY NOTE: These utilities are for client-side authorization UI only.
 * Never rely solely on client-side checks for security - always enforce on backend.
 */

interface JWTPayload {
  sub: string;
  roles?: string[];
  role?: string;
  exp: number;
  iat: number;
}

/**
 * Decodes a JWT token without verifying the signature.
 * WARNING: This is for reading claims only, NOT for security validation.
 * Token validation MUST happen on the backend.
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Base64URL decode
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * Extracts roles from a JWT token.
 * Handles both single role and multiple roles formats.
 * Returns roles with 'ROLE_' prefix stripped for easier comparison.
 */
export const getRolesFromToken = (token: string): string[] => {
  const payload = decodeJWT(token);
  
  if (!payload) {
    return [];
  }

  // Handle multiple roles array
  if (payload.roles && Array.isArray(payload.roles)) {
    return payload.roles.map(role => 
      role.replace('ROLE_', '').toUpperCase()
    );
  }

  // Handle single role string
  if (payload.role && typeof payload.role === 'string') {
    return [payload.role.replace('ROLE_', '').toUpperCase()];
  }

  return [];
};

/**
 * Checks if the JWT token has expired.
 * Returns true if expired or invalid, false if still valid.
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  
  if (!payload || !payload.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000;
  return Date.now() >= expirationTime;
};

/**
 * Checks if a user has any of the required roles.
 * Supports Spring Security's ROLE_ prefix convention.
 * 
 * @param token - JWT token
 * @param allowedRoles - Array of allowed roles (without ROLE_ prefix)
 * @returns true if user has at least one of the allowed roles
 */
export const hasRequiredRole = (token: string, allowedRoles: string[]): boolean => {
  if (!token || allowedRoles.length === 0) {
    return false;
  }

  // Check if token is expired first
  if (isTokenExpired(token)) {
    return false;
  }

  const userRoles = getRolesFromToken(token);
  
  // Normalize allowed roles (strip ROLE_ prefix and uppercase)
  const normalizedAllowedRoles = allowedRoles.map(role =>
    role.replace('ROLE_', '').toUpperCase()
  );

  // Check if user has any of the allowed roles
  return userRoles.some(userRole => 
    normalizedAllowedRoles.includes(userRole)
  );
};

/**
 * Gets the token from localStorage.
 * Returns null if not found or invalid.
 */
export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('jwt_token');
  } catch (error) {
    console.error('Failed to retrieve token from localStorage:', error);
    return null;
  }
};
