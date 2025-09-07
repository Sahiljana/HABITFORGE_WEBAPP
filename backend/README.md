# Habit Forge Backend

## Setup

1. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Add your MongoDB URI and Firebase Project ID to `.env`:
   ```env
   MONGODB_URI=your_mongodb_uri_here
   FIREBASE_PROJECT_ID=your_firebase_project_id_here
   ```
   - For Firebase Admin, use a service account or application default credentials.

3. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints

- `GET /api/habits` — Get all habits for the authenticated user
- `POST /api/habits` — Add a new habit (body: `{ name }`)
- `DELETE /api/habits/:id` — Delete a habit by ID
- `PATCH /api/habits/:id` — Update habit completion (body: `{ completed }`)

## Auth

- Send the Firebase ID token in the `Authorization: Bearer <token>` header for all requests.
