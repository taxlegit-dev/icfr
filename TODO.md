# TODO List for Admin Login Implementation

- [x] Create `src/app/admin/login/page.tsx` with a simple email/password form using NextAuth signIn for admin credentials.
- [x] Modify `src/lib/auth.ts` to add a new CredentialsProvider named "admin" that checks for hardcoded email admin@taxlegit.com and password admin123, returning a dummy admin user object on success.
- [x] Test the admin login functionality to ensure it works correctly.
- [x] Update Prisma schema to include role and password fields.
- [x] Create admin API endpoint at `/api/admin-login` for secure verification.
- [x] Update seed file to create admin user with hashed password.
- [x] Create admin dashboard at `/admin/dashboard` with role-based access control.
- [x] Fix TypeScript types for role and password fields.
- [x] Add password visibility toggle to login form.
- [x] Fix redirect issue by using localStorage for session management.
- [x] Generate Prisma client and push schema changes.
- [x] Seed the database with admin user.
