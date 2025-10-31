# TODO: Integrate OpenAI API for SOP Generation

## Steps to Complete

- [x] Create new API route: `src/app/api/generate-sop/route.ts`

  - Implement POST endpoint to receive form answers
  - Construct prompt with questions and answers
  - Call OpenAI API using OPENAI_API_KEY and MODEL_ID
  - Return JSON response with "processes" array

- [x] Edit `src/app/generate-sop/page.tsx`

  - Modify `handleSubmit` to send POST request to `/api/generate-sop` with answers
  - Add state for `processes` (array) and `selectedProcesses` (array)
  - After successful response, display processes as selectable checkboxes
  - Handle loading and error states for the API call

- [ ] Test OpenAI integration

  - Verify API call works with sample data
  - Check error handling for invalid responses or API failures

- [ ] Ensure proper error handling
  - Add try-catch in API route and frontend
  - Display user-friendly error messages
