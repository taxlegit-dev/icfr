# TODO: Fix Signup/Login User Existence Check

## Issue

- User existence validation happens after OTP verification instead of before OTP sending
- For signup: Should check if user exists before sending OTP (if exists, error)
- For login: Should check if user exists before sending OTP (if not exists, error)

## Tasks

- [x] Update SignupForm.tsx to send `isSignup` flag in sendOtp request
- [x] Update /api/send-otp/route.ts to validate user existence before sending OTP
- [x] Update auth.ts to remove user existence checks from OTP provider's authorize function
- [x] Update TODO.md to mark tasks as completed
- [ ] Test the updated flow for both signup and login scenarios
