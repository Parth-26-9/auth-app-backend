export class ExceptionConstants {   
    public static readonly UnauthorizedCodes = {
        UNAUTHORIZED_ACCESS: 20001, // Unauthorized access to resource
        INVALID_CREDENTIALS: 20002, // Invalid credentials provided
        JSON_WEB_TOKEN_ERROR: 20003, // JSON web token error
        AUTHENTICATION_FAILED: 20004, // Authentication failed
        ACCESS_TOKEN_EXPIRED: 20005, // Access token has expired
        TOKEN_EXPIRED_ERROR: 20006, // Token has expired error
        UNEXPECTED_ERROR: 20007, // Unexpected error occurred
        RESOURCE_NOT_FOUND: 20008, // Resource not found
        USER_NOT_VERIFIED: 20009, // User not verified
        REQUIRED_RE_AUTHENTICATION: 20010, // Required re-authentication
        INVALID_RESET_PASSWORD_TOKEN: 20011, // Invalid reset password token
    };
    
}