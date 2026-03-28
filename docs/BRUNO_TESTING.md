# Testing the API with Bruno

This guide provides instructions on how to configure and use [Bruno](https://www.usebruno.com/), an open-source API client, to test the Smart Campus Operations Hub backend.

## Prerequisites

1. Download and install [Bruno](https://www.usebruno.com/downloads).
2. Ensure your Spring Boot backend is running:
   ```bash
   cd api
   ./mvnw spring-boot:run
   ```

## 1. Setup the Bruno Collection

1. Open Bruno and click **"Create Collection"**.
2. Name the collection: `Smart Campus API`.
3. Choose a folder in your workspace to save the collection (e.g., creating a `bruno_collection` folder within the project).

## 2. Configure Environment Variables

Since our API uses JWTs for authentication and runs on a local port, we should set up variables to make testing easier.

1. In the top right corner of Bruno (near the Environment dropdown), click on **Environments** (the gear icon) > **Create Environment**.
2. Name it `Local`.
3. Add the following variables:
   - `BASE_URL`: `http://localhost:8080`
   - `JWT_TOKEN`: Leave this blank initially (or paste a token if you already have one).
4. Save the environment and **select `Local`** from the environment dropdown in the top right.

## 3. Obtaining a JWT Token (OAuth2 Flow)

Because our API relies on Google OAuth2, you cannot authenticate exclusively via standard Bruno POST requests (like username/password). You must initiate the OAuth flow via your browser.

1. Open your browser and navigate to:
   ```text
   http://localhost:8080/oauth2/authorize/google
   ```
2. You will be prompted to log in to your Google Account.
3. Upon success, the backend will redirect you to your configured frontend callback URL (defined in `application.yml` under `app.oauth2.redirect-uri`) which defaults to `http://localhost:5173/auth/callback`.
4. The redirected URL will look like this:
   ```text
   http://localhost:5173/auth/callback?token=eyJhbGciOiJIUzI1NiJ9.eyJzdW...
   ```
5. **Copy the `token` value** from the URL.
6. Go back to Bruno, open the **Local** environment settings, and paste this value into the `JWT_TOKEN` variable field. Save it.

## 4. Configuring Global Authentication in Bruno

To avoid copying the token into every single request:

1. Click on your `Smart Campus API` collection name in the left sidebar to open the Collection Settings.
2. Go to the **Auth** tab.
3. Select **Bearer Auth** from the Auth Type dropdown.
4. Set the Token field to: `{{JWT_TOKEN}}`
5. Click Save.

---

## 5. API Endpoints for Bruno

You can now right-click your collection, select **New Request**, and implement these tests.

### 1. Root Health Check (Public)

_This endpoint checks if the server is up and does not require authentication._

- **Name**: Server Health
- **Method**: `GET`
- **URL**: `{{BASE_URL}}/health`
- **Auth**: None (Inherit)

### 2. Auth Controller Health Check (Protected)

- **Name**: Auth Health
- **Method**: `GET`
- **URL**: `{{BASE_URL}}/api/v1/auth/health`
- **Auth**: Inherit (Uses your Bearer Token)

### 3. Get Current User (Protected)

_Retrieves the profile data of the currently authenticated user based on the provided JWT._

- **Name**: Current User Profile
- **Method**: `GET`
- **URL**: `{{BASE_URL}}/api/v1/auth/me`
- **Auth**: Inherit (Uses your Bearer Token)
- **Expected Response** (200 OK):
  ```json
  {
    "id": 1,
    "email": "your.email@gmail.com",
    "name": "Your Name",
    "pictureUrl": "https://lh3.googleusercontent.com/...",
    "roles": ["STUDENT"]
  }
  ```

---

## Extending Your Tests

As you add new controllers (e.g., `FacilitiesController`, `BookingsController`, `IncidentsController`), you can easily expand this collection.

**Example Boilerplate for a Future Endpoint (Facilities):**
When you add standard REST routes, create requests in Bruno like this:

- **Create Facility** (`POST {{BASE_URL}}/api/v1/facilities`): Choose `Body -> JSON` and provide the data schema for your entity.
- **List Facilities** (`GET {{BASE_URL}}/api/v1/facilities`): Pass pagination query params like `?page=0&size=10`.

With the `JWT_TOKEN` globally configured in your collection settings, all new requests will automatically be authenticated, applying your `@PreAuthorize("hasRole('ADMIN')")` permissions seamlessly!
