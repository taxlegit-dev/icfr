# TODO: Fix Signup/Login User Existence Check

## Issue

- User existence validation happens after OTP verification instead of before OTP sending
- For signup: Should check if user exists before sending OTP (if exists, error)
- For login: Should check if user exists before sending OTP (if not exists, error)

## Tasks

- [ ] Update SignupForm.tsx to send `isSignup` flag in sendOtp request
- [ ] Update /api/send-otp/route.ts to validate user existence before sending OTP
- [ ] Test the updated flow for both signup and login scenarios
