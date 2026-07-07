// Feature flags read from build-time env. Kept in a lib module so components
// share one definition instead of importing flags from each other.

export const NEWSLETTER_ENABLED =
  process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === "1" ||
  process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === "true";
