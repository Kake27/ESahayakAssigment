# Buyer Lead Intake App
A mini CRM-style app to capture, list, and manage buyer leads.
Built with **Next.js** (App Router) + **TypeScript** + **Prisma** + **Supabase**.

## Setup 
### 1. Clone and Install Dependencies
Run the following commands:
```bash
git clone https://github.com/Kake27/ESahayakAssigment
cd esahayak        // change to project directory
npm install        // install dependencies
```
### 2. Set Environmental Variables
Create a .env file in the project directory.
Set the following variables obtained from **Supabase**
```env
DATABASE_URL=<your-supabase-postgres-url>
DIRECT_URL=<your-direct-connection-url>
```
### 3. Setup Prisma
```bash
npx prisma init
```

Run Prisma migrations:
```bash
npx prisma migrate dev
```

### 4. Run Locally
```bash
npm run dev
```
Visit http://localhost:3000 for viewing the app.

---

## Design Notes
### Validation
- A suitablly developed **Zod** schema enforces validation on both client & server side:
    - fullName ≥ 2 chars
    - phone → 10–15 digits
    - budgetMax ≥ budgetMin
    - bhk required only for Apartment/Villa
  
File upload validation can be done by using the uploaded `test.csv` and `test2.csv` files

### SSR vs Client
- Buyers list (`/buyers`) is rendered on server side with **pagination**, **filtering** & **sorting**.
- Forms (`/buyers/new`, `/buyers/[id]`) use client-side validation + server validation.

### Ownership Enforcement
- Users can log in with just their name (demo auth).
- The users are saved in an `Users` database, which generates their ID, which is used as `ownerId`.
- Each buyer lead has an `ownerId`.
- Only buyer leads which have the ownerId of the currently logged in user have the **Edit** option.
- Authentication Rules:
    - All logged-in users can **view** all leads.
    - Only owners can **edit/delete** their own leads.

### User FLow
- Users are first directed to the **login** page on opening the app. If the user data is stored in the local context, they are automatically redirected to the `/buyers` page.
- User enters their name; If the name does't exist in the database, a new entry with the name is created.
- After successful login, the user can view all the leads in the database, can import / export .csv files, filter and search the entries and can create new leads as well.
---

## Features Implemented
- `Create`, `view`, `edit`, `delete` leads
- Validation using **Zod** on both server and client sides
- Buyer history with differences in `json format`. History is stored for each buyer lead in a **Buyer History** database.
- SSR listing with **filters, debounced search, sorting and pagination**.
- **CSV import/export** with validation + transactional insert
- Simple **name-based auth**, user data stored in **context + localStorage**.
- Rate limiting on `create`/`update` of 10 updates per minute.
- Implemented detailed labels and error handling; Utilized `react-toast` for generating pop up messages.
- **Unit tests** for validating the Buyer Schema developed in Zod.
- Implemented **status quick-action dropdowns** in table, to edit status directly.
- **Full-text search** using notes, name, email and phone implemented.
---

## Skipped / Simplified
- No full auth provider (magic links / JWT) → replaced by simple name-based login. This was mainly because for the current purpose, using a simple auth seemed sufficient.
- File uploads using `attachmentUrl skipped` for simplicity, lack of clarity of implementation and time.
- Optimistic UI edits partially applied (status quick action updates directly, but no rollback). Implementing this would have made the process more complicated, with multiple data states, and would not have been implemented in time.
- No production-grade distributed rate limiter used in-memory instead, for simplicity and ease of implementation.
- Did not implement a separate **admin** role, but can be implemented easily using middleware.
- As of now, the data entries are sorted in the order of **most recently modified** only.
---

## Running Unit Tests
Tests can be modified in the buyerSchema.test.ts file for testing validation rules.
The test can be run by using
```bash
npm run test
```
This uses Vitest for testing.


