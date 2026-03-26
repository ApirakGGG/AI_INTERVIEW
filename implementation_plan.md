# Fix @clerk/nextjs SignedIn/SignedOut Import Error

The problem is that you are using version `7.0.6` of `@clerk/nextjs`. In Clerk React v6 and `@clerk/nextjs` v7, the `<SignedIn>` and `<SignedOut>` components were removed in favor of a single `<Show>` component to handle conditional rendering based on authentication state.

## Proposed Changes

### d:\AI_Voice_chat\ai_voice_interview\components\Navbar.tsx

#### [MODIFY] Navbar.tsx
Remove `SignedIn` and `SignedOut` from the imports and import [Show](file:///d:/AI_Voice_chat/ai_voice_interview/node_modules/@clerk/nextjs/dist/types/app-router/server/controlComponents.d.ts#7-37) instead. Replace `<SignedIn>` with `<Show when="signed-in">` and `<SignedOut>` with `<Show when="signed-out">`.

## Verification Plan

### Automated Tests
- Since there are no existing automated tests for this UI component, we will rely on manual visual verification. We will check if there are no TS errors anymore.

### Manual Verification
- We will ask the user to verify if the Navbar successfully displays the correct buttons when signed out or signed in.
- The dev server is already running, so I will check `yarn dev` terminal logs to ensure there are no compile errors after the modifications.
