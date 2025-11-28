# PlantPal - Bug & Feature Tracker

## 🐛 Bugs

### High Priority
- [ ] **[BUG-001]** Second page after landing is shifted up
  - **Location:** OnboardingFlow welcome screen
  - **Impact:** Poor first impression, layout issues
  - **Files:** `src/components/OnboardingFlow.tsx`

- [ ] **[BUG-002]** Text input boxes cause screen to shift when clicked
  - **Location:** All survey screens with text inputs
  - **Impact:** Jarring user experience, accessibility issue
  - **Files:** `src/components/OnboardingFlow.tsx`, `src/components/CreateSpotFlow.tsx`

- [ ] **[BUG-003]** Input highlight box edges are cut off
  - **Location:** All text input fields
  - **Impact:** Visual polish issue
  - **Files:** CSS/styling files

- [ ] **[BUG-004]** Blinking cursor should be dark green
  - **Location:** All text input fields
  - **Impact:** Brand consistency
  - **Files:** `src/index.css` or `src/styles/globals.css`

### Medium Priority
- [ ] **[BUG-005]** Not enough space below bottom elements (needs ~8px more)
  - **Location:** Survey screens
  - **Impact:** Content slightly covered by navigation
  - **Files:** `src/components/OnboardingFlow.tsx`, `src/components/CreateSpotFlow.tsx`, `src/components/AddPlantFlow.tsx`

- [ ] **[BUG-006]** Onboarding survey headers are too dull
  - **Location:** Survey headers (e.g., "Add Plant")
  - **Impact:** Visual hierarchy, engagement
  - **Files:** All flow components

- [ ] **[BUG-007]** Room type scroll should be independent
  - **Location:** Room type selection screen
  - **Impact:** UX issue when scrolling
  - **Files:** `src/components/CreateSpotFlow.tsx`

- [ ] **[BUG-008]** Color inconsistency between "All Environments" and environment details
  - **Location:** SpotsTab screens
  - **Impact:** Visual consistency
  - **Files:** `src/components/SpotsTab.tsx`, `src/components/SpotDetailScreen.tsx`

- [ ] **[BUG-009]** Background beige color doesn't cover all screens
  - **Location:** Various screens throughout app
  - **Impact:** Visual consistency
  - **Files:** Multiple component files

### Low Priority
- [ ] **[BUG-010]** Keyboard doesn't feel native
  - **Location:** All text input interactions
  - **Impact:** User experience polish
  - **Note:** May require Capacitor keyboard plugin configuration

---

## ✨ Features

### High Priority
- [ ] **[FEAT-001]** Show "App Recommended" care schedules for plants
  - **Description:** Display AI-generated or preset care schedules with "App Recommended" badge
  - **Impact:** Core value proposition, user guidance
  - **Files:** Plant detail screens, task generation logic
  - **Complexity:** Medium

- [ ] **[FEAT-002]** Add sticky top component on each page (plant name/type)
  - **Description:** Persistent header showing context (plant name, room name, etc.)
  - **Impact:** Navigation clarity, context awareness
  - **Files:** All main screens
  - **Complexity:** Medium

### Medium Priority
- [ ] **[FEAT-003]** Implement slide transitions between connected pages
  - **Description:** Smooth slide animations for sequential navigation
  - **Impact:** Native app feel, polish
  - **Files:** Navigation/routing logic
  - **Complexity:** Medium

- [ ] **[FEAT-004]** Implement fade transitions between unconnected pages
  - **Description:** Fade animations for non-sequential navigation (e.g., tab switches)
  - **Impact:** Visual polish
  - **Files:** Tab navigation, modal transitions
  - **Complexity:** Low-Medium

### Low Priority
- [ ] **[FEAT-005]** Skip location re-selection in onboarding
  - **Description:** Don't make user repeat location selection after choosing recommended plant
  - **Impact:** Streamlined onboarding UX
  - **Files:** `src/components/OnboardingFlow.tsx`
  - **Complexity:** Low

---

## 📊 Progress Summary

**Bugs:** 0/10 completed (0%)
**Features:** 0/5 completed (0%)
**Total:** 0/15 completed (0%)

---

## 🏷️ Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `high-priority` - Needs immediate attention
- `medium-priority` - Important but not urgent
- `low-priority` - Nice to have
- `ui/ux` - User interface/experience related
- `performance` - Performance related
- `mobile` - Mobile-specific issues
- `accessibility` - Accessibility improvements

---

## 📝 Notes

### Implementation Order Recommendation:
1. **Phase 1 - Critical Bugs** (BUG-001, BUG-002, BUG-005)
   - Fix layout and spacing issues first
   
2. **Phase 2 - Visual Polish** (BUG-003, BUG-004, BUG-006, BUG-008, BUG-009)
   - Improve visual consistency and brand alignment
   
3. **Phase 3 - Core Features** (FEAT-001, FEAT-002)
   - Add value-driving features
   
4. **Phase 4 - UX Enhancements** (FEAT-003, FEAT-004, FEAT-005)
   - Polish user experience with animations and flow improvements
   
5. **Phase 5 - Nice-to-Haves** (BUG-007, BUG-010)
   - Final polish items

---

Last Updated: 2025-11-27
