# Changelog

All notable changes to the Kynigos Law Firm site are documented here.
Versions follow a 4-digit MAJOR.MINOR.PATCH.MICRO format.

## [0.3.0.0] - 2026-07-06

### Added
- "How It Works" section on the homepage: a three-step explanation of the pricing model (free consultation, one price in writing, aligned outcome) with the DC-only jurisdiction note. A new "How It Works" button next to "Book A Free Consultation" smooth-scrolls to it; on phones the two buttons stack full-width.
- Homepage tests (5 new, 40 total) covering the new section, the anchor button, and the ticker placement, plus new mobile-menu tests for link-tap close, desktop-resize close, and the Tab focus trap.

### Changed
- Mobile menu redesigned: one tap on the menu button now shows every page as a direct link (grouped under small About / Practice Areas / Insights labels)—no more expanding sections. The page dims behind the menu and tapping anywhere outside closes it. Links are larger and easier to read, and the consultation button sits at the bottom of the list.
- The scrolling services banner now appears only on the homepage, as a normal band between the hero and the How It Works section that scrolls with the page—it no longer sticks to the bottom of every screen.
- Slimmer mobile header: the wordmark and menu button take less vertical space, leaving more room for content.
- Smooth in-page scrolling for anchor links, while switching pages still snaps instantly (Next 16 data-scroll-behavior).

### Fixed
- Screen readers no longer announce two identical "Close menu" buttons when the menu is open; the menu is announced as a dialog and the menu button points at it (aria-controls).
- Anchor scrolling now clears the fixed header on desktop (scroll-margin), and the menu sheet has a max-height fallback for older browsers without dvh support.

## [0.2.1.0] - 2026-07-01

### Fixed
- Keyboard and screen-reader users can no longer Tab out of the open mobile menu into hidden page content; closing the menu returns focus to the menu button, and Escape now fully resets the menu.
- Cleared all pre-existing lint errors (typographic quotes in the white-papers copy; modernized the headline reel's reduced-motion handling).

### Added
- Component regression tests (8 new, 33 total): the mobile-menu close-on-navigation fix, Escape/focus behavior, the contact form's DC jurisdiction gate and submit states, and the white-paper form id fix are now locked in by tests.

## [0.2.0.0] - 2026-07-01

### Added
- Contact form on /contact: prospective clients can now send an inquiry (name, email, optional phone, message) directly from the site instead of only calling or emailing. A required jurisdiction dropdown screens DC vs other matters—non-DC selections see a referral note and cannot submit, and the API enforces the same rule.
- If the inquiry email cannot be delivered, the form now says so and shows the firm's phone and email instead of a false success message.
- Test suite (vitest): 25 tests covering the contact and lead APIs—validation, the DC jurisdiction gate, email send success/failure, spam honeypot, and input boundaries. CI runs typecheck + tests on every push and PR.

### Fixed
- Mobile menu can now be closed: the open menu panel was covering the close button, trapping visitors on phones. The logo and close button now stay visible and tappable above the panel, the tap target meets the 44px minimum, and the menu also closes automatically on any page change.
- White-paper download forms no longer cross-wire: tapping the second paper's Name/Email labels used to jump focus to the first paper's form.
- Form fields no longer trigger the iOS zoom-on-focus, keyboards match the field type (email/phone), and browsers can autofill name, email, and phone.
- Keyboard users get a visible focus ring on form fields; disabled buttons now look disabled; inline links in form notes are underlined.

### Changed
- Hero reel words trimmed to offered practice areas; practice pages no longer show "page in progress" placeholder copy; canonical contact email (bayan@kynigos.law) everywhere.
- Contact and lead APIs neutralize control characters in user input and silently drop bot submissions (honeypot), protecting the firm inbox and logs.
