# TODO: Implement Dynamic Questions Feature for Admin

## Steps to Complete

- [x] Add Question model to prisma/schema.prisma with fields: id, questionText, inputType, options (Json array), isRequired, createdAt
- [x] Update src/lib/sidebarLinks.ts to add "Dynamic Questions" link in adminLinks
- [x] Modify src/components/sidebar/Sidebar.tsx to use adminLinks from sidebarLinks.ts instead of hardcoded items
- [x] Create new page: src/app/admin/dashboard/questions/create/page.tsx for the form with conditional Options field
- [x] Create API route: src/app/api/admin/questions/route.ts for POST to create question, with validation
- [x] Create list page: src/app/admin/dashboard/questions/page.tsx to display all questions
- [x] Run Prisma migration after schema update
- [x] Test the form, API, and sidebar integration
