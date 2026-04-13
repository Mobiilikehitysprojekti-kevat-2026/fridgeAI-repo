# FridgeChef AI - 3 Person Scrum Plan (6 Weeks)

This plan is written for a team of **3 people** who want to build the same project **from scratch** over **6 weeks** using Scrum.

It is designed to match the course expectations:

- mobile app suitable for real mobile use
- multiple screens and proper navigation
- local and/or backend data storage
- API/backend usage
- sensor usage
- application logic beyond a simple calculation
- Scrum backlog, sprint planning, weekly follow-up, and hour tracking

The suggested sprint window is:

- **Sprint 1:** March 16, 2026 - March 22, 2026
- **Sprint 2:** March 23, 2026 - March 29, 2026
- **Sprint 3:** March 30, 2026 - April 5, 2026
- **Sprint 4:** April 6, 2026 - April 12, 2026
- **Sprint 5:** April 13, 2026 - April 19, 2026
- **Sprint 6:** April 20, 2026 - April 26, 2026

Buffer before final submission:

- **Final polish and submission buffer:** April 27, 2026 - April 29, 2026

Final submission deadline from the course brief:

- **Wednesday, April 29, 2026 at 16:00**

---

## 1. Team Structure

### Person 1 - Product, UI, and Frontend Flow Owner

Main responsibility:

- screen design
- user flow
- navigation
- visual consistency
- translations and UI polish

Typical ownership:

- Recipes screen
- Pantry screen
- Ask Fridge chat UI
- Settings screen
- shared UI components

### Person 2 - Mobile Core and Device Features Owner

Main responsibility:

- Expo app setup
- camera flow
- image handling
- local persistence
- state management
- mobile integration and testing

Typical ownership:

- camera screen
- analysis loading flow
- ingredient selection flow
- local stores
- repositories
- image processing hooks

### Person 3 - Backend, AI, and Data Owner

Main responsibility:

- Express backend
- API contracts
- upload handling
- OpenAI integration
- recipe generation
- image search logic
- backend tests

Typical ownership:

- `/api/v1/health`
- `/api/v1/analyze`
- `/api/v1/daily-recipes`
- `/api/v1/ask-fridge`
- ingredient/recipe services
- backend validation and error handling

---

## 2. Definition Of Done For Every Sprint

A task is only considered done when:

- code is pushed to the main branch or merged before the weekly meeting
- the feature is demoable on the app
- relevant tests pass
- `npm run typecheck` passes
- `npm test` passes
- the backlog item status is updated
- each assignee logs hours spent

---

## 3. Sprint Plan

## Sprint 1 - Foundation and Project Setup

**Goal:** Create the project foundation, define the product clearly, and make the app runnable.

### Person 1

- Define the product idea, scope, and MVP boundary
- Create screen list and user flow
- Design low-fidelity wireframes for the main screens
- Define theme direction based on Material Design 3
- Set up the Scrum board structure:
  - Backlog
  - Sprint 1
  - Sprint 2
  - Sprint 3
  - Sprint 4
  - Sprint 5
  - Sprint 6

### Person 2

- Create Expo project with TypeScript
- Set up root app structure
- Set up navigation skeleton
- Set up Zustand and TanStack Query
- Add i18n foundation

### Person 3

- Create backend folder with Express + TypeScript
- Add `GET /api/v1/health`
- Add environment variable handling
- Define initial API contract for analyze flow
- Set up backend test structure

### Sprint 1 Deliverables

- runnable Expo app
- runnable backend
- navigation skeleton
- product scope agreed by the team
- Scrum board ready

### Suggested Backlog Items

- Define MVP and project scope
- Create screen map and app flow
- Set up Expo app with TypeScript
- Set up Express backend with TypeScript
- Add health endpoint
- Configure navigation, store, and query client
- Prepare weekly meeting and hour tracking template

---

## Sprint 2 - Camera, Image Input, and Base UI

**Goal:** Let the user capture or choose an image and move through the first real flow.

### Person 1

- Build Recipes, Pantry, and Settings base screens
- Build shared buttons, cards, and icon controls
- Apply visual theme and basic responsive mobile styling
- Add empty states and loading states

### Person 2

- Implement camera permissions
- Implement image capture flow
- Implement gallery fallback
- Implement image processing/compression
- Route captured image into analysis loading screen

### Person 3

- Add upload middleware with `multer`
- Implement `POST /api/v1/analyze` skeleton
- Validate image input
- Return temporary mock analysis response first
- Add API integration test for multipart upload

### Sprint 2 Deliverables

- camera works
- gallery works
- analyze request can be sent to backend
- first real end-to-end flow exists with mock or temporary backend response

### Suggested Backlog Items

- Build RecipesHub base UI
- Build PantryHub base UI
- Add camera permission flow
- Add capture and gallery selection
- Add image compression hook
- Implement analyze upload endpoint
- Test multipart image upload

---

## Sprint 3 - Ingredient Analysis and Meal Suggestions

**Goal:** Convert image analysis into ingredient selection and recipe suggestions.

### Person 1

- Build Ingredients review screen
- Build Meal Suggestions screen
- Create selection chips, cards, and confirmation actions
- Improve empty/error UI for analysis states

### Person 2

- Connect loading screen to analyze mutation
- Store detected ingredients in app state
- Build ingredient selection/editing logic
- Connect selected ingredients to suggestions flow
- Add local persistence for session state if needed

### Person 3

- Integrate OpenAI analysis for ingredient detection
- Normalize backend response
- Return `detectedIngredients` and a suggested recipe structure
- Add backend validation and fallback behavior
- Add tests for parse/normalize logic

### Sprint 3 Deliverables

- real analysis response structure
- ingredient list shown in app
- user can confirm ingredients
- suggestions screen opens correctly

### Suggested Backlog Items

- Build Ingredients screen
- Build Meal Suggestions cards
- Connect analyze loading to backend
- Save latest analysis in store
- Add OpenAI ingredient analysis
- Add response validation and fallback handling
- Add tests for analysis parsing

---

## Sprint 4 - Recipe Detail, Cooking Mode, and Persistence

**Goal:** Turn suggestions into a usable cooking experience and save important data.

### Person 1

- Build Recipe detail screen
- Build Cooking mode screen
- Build Completion screen
- Improve recipe hero layout and progress UI
- Add settings and language switch polish

### Person 2

- Add saved recipe local persistence
- Add cooking session store
- Add pantry persistence
- Add transitions between recipe, cooking, and completion
- Keep UI state consistent when navigating back and forth

### Person 3

- Improve recipe generation shape and fallback recipes
- Add `GET /api/v1/daily-recipes`
- Add `POST /api/v1/ask-fridge`
- Add backend-side recipe normalization
- Add tests for recipe feed and ask-fridge responses

### Sprint 4 Deliverables

- recipe detail works
- cooking mode works
- completion flow works
- saved recipes persist locally
- backend provides daily ideas and ask-fridge results

### Suggested Backlog Items

- Build Recipe screen
- Build Cooking Mode screen
- Build Completion screen
- Persist saved recipes locally
- Add daily recipes endpoint
- Add ask-fridge endpoint
- Add backend tests for recipe feed and chat suggestions

---

## Sprint 5 - Pantry Logic, Image Quality, and Feature Completion

**Goal:** Make the app feel complete and course-appropriate.

### Person 1

- Improve Pantry UX
- Add empty states, search, category chips, and editing UI
- Improve visual consistency across screens
- Polish Ask Fridge and Recipes page

### Person 2

- Make Pantry data editable and persistent
- Connect pantry data into recipe suggestion logic
- Improve local session persistence for Ask Fridge
- Add smoke testing on physical device

### Person 3

- Improve Pexels image matching logic
- Improve fallback logic for recipes and pantry images
- Optimize API response quality
- Add error handling for missing keys or failed AI responses

### Sprint 5 Deliverables

- pantry flow works cleanly
- ask-fridge is usable
- image quality is acceptable
- core MVP feature set is complete

### Suggested Backlog Items

- Add pantry add/edit/delete flow
- Persist pantry locally
- Connect pantry to recipe suggestions
- Improve Ask Fridge session persistence
- Improve recipe image matching
- Improve backend error handling
- Test app on physical device

---

## Sprint 6 - Testing, Scrum Evidence, and Submission Readiness

**Goal:** Finish the project safely and prepare for final review and submission.

### Person 1

- Final UI polish pass
- Prepare screenshots/demo flow
- Check navigation and text consistency
- Prepare final presentation/demo notes for weekly review

### Person 2

- Run full mobile smoke tests
- Verify camera and persistence behavior
- Fix final navigation/state bugs
- Check that the main branch is always demoable

### Person 3

- Run backend verification
- Check env config and deployment/readme readiness
- Clean dead code and unused files
- Verify tests, typecheck, and audit results

### Shared Project Management Tasks

- Update backlog and mark completed items
- Make sure each sprint has clear completed work
- Record hours for every team member
- Prepare final public Git repository state
- Make sure one group member is ready to submit the final Git link to Moodle

### Sprint 6 Deliverables

- stable demo build
- updated Scrum board
- hours tracked
- all core features in main branch
- run guide and project plan documents ready

### Suggested Backlog Items

- Final UI and UX polish
- Full app smoke test
- Clean repo and remove unused files
- Update run guide and project plan
- Verify typecheck, tests, and audit
- Finalize Scrum board and hour tracking
- Prepare final submission package

---

## 4. Recurring Weekly Scrum Routine

Every week, before the project meeting, the team should do all of the following:

- update backlog item status
- move tasks into the correct sprint view
- push working code to the main branch
- make sure the app can be demoed
- log hours for each member
- prepare a short spoken update:
  - what was done last week
  - what will be done next week
  - blockers
  - hours spent

---

## 5. Minimal Board Structure For GitHub Projects

Use these fields for each task if possible:

- **Title**
- **Assignee**
- **Status**
- **Type**
- **Labels**
- **Start date**
- **End date**
- **Sprint**
- **Repository**

Recommended status values:

- Todo
- In Progress
- In Review
- Done

Recommended type values:

- Feature
- Bug
- Documentation
- Testing
- Scrum

Recommended labels:

- mobile
- backend
- ui
- api
- persistence
- ai
- testing
- documentation
- scrum

---

## 6. What Must Exist By The End

By the end of the project, the team should be able to show:

- a mobile-suitable app idea
- multiple screens with working navigation
- local and/or backend persistence
- working backend/API usage
- device feature usage such as camera
- non-trivial logic
- TypeScript-based React Native code
- Scrum backlog and sprint evidence
- weekly participation and hour tracking
- code in the main branch ready for review
- public Git repository for final submission

---

## 7. Short Version

If the team wants the shortest possible summary:

- **Week 1:** Plan and set up everything
- **Week 2:** Build camera and base UI
- **Week 3:** Build analysis and suggestions
- **Week 4:** Build recipe, cooking, and persistence
- **Week 5:** Complete pantry, chat, and data quality
- **Week 6:** Polish, test, document, and submit

