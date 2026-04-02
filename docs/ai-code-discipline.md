AI Code Discipline Protocol

A concise rule set for generating clean, scalable software

1. Understand the Objective First

Rule: Do not write code until the task is clearly defined.

Steps:

Restate the goal of the system.

Identify the type of project:

Static website

Web application

Native/mobile/desktop application

Define:

Inputs

Outputs

User interactions

Constraints

Reason: Prevents premature coding and incorrect architecture.

2. Design Before Coding

Rule: Always produce a system design before implementation.

Steps:

Define the architecture

Break the system into modules

Identify component responsibilities

Example structure:

App
 ├── UI Components
 ├── Business Logic
 ├── Data Layer
 └── Services / APIs

Reason: Clear architecture prevents tangled code.

3. Enforce Separation of Concerns

Rule: Each file and component must have one responsibility.

Structure example:

/components
/services
/hooks or controllers
/utils
/types
/pages or screens

Guidelines:

UI → display only

Services → API calls

Logic → business rules

Utils → reusable helpers

Reason: Makes code scalable and maintainable.

4. Design Components First

Rule: Build UI as small reusable components.

Process:

Identify repeating elements

Convert them into components

Keep components small and focused

Bad:

HugePageComponent.js

Good:

Button
Navbar
Card
ProfileHeader

Reason: Reusability and clarity.

5. Define Data Flow Early

Rule: Always define how data moves through the system.

Steps:

Identify state sources

Define state ownership

Pass data through controlled interfaces

Example:

API → Service → State → UI Component

Reason: Prevents unpredictable behavior.

6. Keep Functions Small

Rule: One function = one task.

Limit:

10–20 lines maximum when possible.

Example:

Bad:

function processUser() {
   validate();
   fetch();
   format();
   save();
   render();
}

Good:

validateUser()
fetchUserData()
formatUser()
saveUser()
renderUser()

Reason: Improves readability and testing.

7. Follow Predictable File Structure

Rule: Maintain a consistent project structure.

Example:

src/
  components/
  pages/
  services/
  hooks/
  utils/
  types/
  assets/

For native apps:

ui/
viewmodels/
services/
models/
utils/

Reason: Developers and AI can navigate easily.

8. Write Logic Before Styling

Rule: Functional logic must work before styling or visual polish.

Steps:

Implement functionality

Validate behavior

Add styles last

Reason: Prevents wasted UI work.

9. Use Clear Naming

Rule: Names must explain purpose.

Examples:

Bad

data1
handlerX
tmp

Good

userProfile
fetchOrders
calculateTotal

Reason: Readability is critical for collaboration.

10. Avoid Code Duplication

Rule: Repeated logic must become a reusable function or module.

Example:

Bad:

formatDate() repeated in 5 files

Good:

utils/formatDate.ts

Reason: Easier maintenance.

11. Implement Lifecycle Awareness

Rule: Respect the application lifecycle.

Web example:

Init
Load Data
Render UI
Handle User Input
Update State
Re-render
Cleanup

Mobile example:

Create
Mount
Update
Background
Destroy

Reason: Prevents memory leaks and logic errors.

12. Validate Inputs

Rule: Never trust external input.

Validate:

user input

API responses

configuration values

Reason: Stability and security.

13. Use Predictable Error Handling

Rule: Errors must be handled gracefully.

Example:

try {
   fetchData()
} catch(error) {
   logError()
   showUserMessage()
}

Reason: Prevents application crashes.

14. Comment Intent, Not Obvious Code

Rule: Comments explain why, not what.

Bad:

// add numbers
a + b

Good:

// apply tax calculation before checkout total

Reason: Helps future developers understand design decisions.

15. Review and Refactor Before Final Output

Rule: AI must self-check code before finishing.

Checklist:

Remove unused variables

Simplify logic

Ensure consistent naming

Confirm modular structure

Verify formatting

Reason: Improves code quality.

16. Output Clean Production Code

Final code must be:

Modular

Readable

Documented

Scalable

Minimal

Consistent

Optional Advanced Rule (for stronger AI results)
Require a 4-Stage Output

Ask AI to respond in this order:

1️⃣ Architecture Plan
2️⃣ Component Structure
3️⃣ Core Logic Implementation
4️⃣ Final Clean Code

This dramatically improves code quality.
