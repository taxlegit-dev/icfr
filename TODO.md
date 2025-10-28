# TODO: Signup Form with OTP

- [x] Update `prisma/schema.prisma`: Add User model (id, firstName, lastName, phone, createdAt) and OTP model (id, phone, otp, expiresAt)
- [x] Create `src/app/api/send-otp/route.ts`: API to generate and save OTP
- [x] Create `src/app/api/verify-otp/route.ts`: API to verify OTP and create user
- [x] Create `src/components/SignupForm.tsx`: React component for the signup form
- [x] Update `src/app/page.tsx`: Replace placeholder with SignupForm component
- [x] Run `npx prisma generate` to update Prisma client
- [x] Test the form locally
