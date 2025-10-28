# TODO: Signup Form with OTP and NextAuth

- [x] Update `prisma/schema.prisma`: Add User model (id, firstName, lastName, phone, createdAt) and OTP model (id, phone, otp, expiresAt)
- [x] Create `src/app/api/send-otp/route.ts`: API to generate and save OTP
- [x] Create `src/app/api/verify-otp/route.ts`: API to verify OTP and create user
- [x] Create `src/components/SignupForm.tsx`: React component for the signup form
- [x] Update `src/app/page.tsx`: Replace placeholder with SignupForm component
- [x] Run `npx prisma generate` to update Prisma client
- [x] Test the form locally
- [x] Install next-auth and @next-auth/prisma-adapter
- [x] Create NextAuth configuration with custom OTP provider
- [x] Set up API route for NextAuth ([...nextauth].ts)
- [x] Update SignupForm to use NextAuth signIn/signUp methods
- [x] Add session management and protected routes
- [x] Update navbar to show login/logout based on session
- [x] Create SessionProvider component
- [x] Add NextAuth type declarations
- [x] Update Prisma schema for NextAuth compatibility
- [x] Run `npx prisma db push --accept-data-loss` to update database
