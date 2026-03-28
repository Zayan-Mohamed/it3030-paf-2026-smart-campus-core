# GitHub Copilot Instructions: Smart Campus Operations Hub

## Project Context
This is a monolithic repository containing a Java Spring Boot REST API (`/api`) and a React TypeScript client (`/client`). [cite_start]The application manages campus facility bookings and maintenance incident ticketing[cite: 19]. 

## Core Security Mandates
When generating code for this repository, you MUST prioritize security, defensive programming, and the OWASP Top 10 guidelines. Never sacrifice security for brevity.

### [cite_start]1. Authentication & Authorization 
- [cite_start]**OAuth 2.0 & JWT:** The system uses Google OAuth 2.0 for identity and issues JWTs for session management[cite: 48].
- **Never roll custom cryptography:** Always use established libraries (e.g., `jjwt` for tokens, `BCrypt` if password hashing is ever needed).
- **Role-Based Access Control (RBAC):** All API endpoints must be explicitly protected using Spring Security annotations (e.g., `@PreAuthorize("hasRole('ADMIN')")`). [cite_start]Assume a default-deny posture[cite: 50].
- **Token Handling (Frontend):** When writing React code, ensure JWTs are passed securely in the `Authorization: Bearer <token>` header. 

### 2. Secret Management & Data Protection
- **Zero Hardcoded Secrets:** NEVER generate code that hardcodes API keys, database passwords, JWT secrets, or client IDs. [cite_start]Always read from environment variables (`application.yml` placeholders or `process.env`).
- **No Sensitive Data Logging:** Ensure logging statements (`log.info`, `console.log`) never output passwords, tokens, PII (Personally Identifiable Information), or full request objects containing sensitive data.

### [cite_start]3. Input Validation & Data Sanitization 
- [cite_start]**Backend Validation:** Always apply `jakarta.validation.constraints` (e.g., `@NotBlank`, `@Email`, `@Size`, `@Min`) to all incoming Request DTOs (Data Transfer Objects)[cite: 16]. 
- **Prevent SQL Injection:** Strictly use Spring Data JPA Repositories and parameterized queries. Never generate raw, concatenated SQL strings.
- **Prevent XSS (Cross-Site Scripting):** In the React frontend, rely on React's default escaping for rendering text. If `dangerouslySetInnerHTML` must be used, mandate the use of a sanitizer library like `DOMPurify`.

### [cite_start]4. Safe File Handling (Attachments) 
[cite_start]The system accepts image attachments for incident tickets[cite: 40]. When generating file upload code:
- **Validate MIME Types:** Do not rely on file extensions. Verify the actual content type matches allowed image formats (e.g., `image/jpeg`, `image/png`).
- **Prevent Path Traversal:** Never use the user-provided filename directly when saving files. Generate a secure, randomized filename (e.g., using `UUID`) to prevent directory traversal attacks (`../`).
- **Limit File Size:** Always enforce maximum file size limits before processing the upload stream.

### 5. Error Handling & API Responses
- [cite_start]**No Stack Traces in Production:** Implement global exception handlers (`@ControllerAdvice` in Spring Boot) to catch and format errors[cite: 16].
- [cite_start]**Meaningful but Safe Messages:** Return meaningful HTTP status codes and standard error structures, but never leak internal system details, database schemas, or stack traces to the client[cite: 70].

## Coding Conventions
- **Language/Frameworks:** Java 17, Spring Boot 3.2.x, React, TypeScript, Vite.
- **Lombok:** Use Lombok annotations (`@Data`, `@Builder`, `@RequiredArgsConstructor`) to reduce Java boilerplate.
- **API Design:** Adhere strictly to RESTful best practices. [cite_start]Use proper HTTP verbs (GET, POST, PUT/PATCH, DELETE) and resource-based routing (e.g., `/api/v1/resources/{id}`)[cite: 16, 69].