/**
 * Embassy Approval & Auth State
 * ----------------------------------
 * TEMPORARY STATIC STATE
 * This file will be replaced later by Redux / Supabase
 * without changing routing or pages.
 */

export const embassyStatus = {
  /**
   * Is embassy logged in?
   * false → redirect to /auth
   */
  isAuthenticated: true,

  /**
   * Has embassy completed country setup?
   * false → redirect to /country-setup
   */
  hasCountrySetup: true,

  /**
   * Approval status from admin
   * Possible values:
   * - "pending"   → /review
   * - "approved"  → /dashboard
   * - "rejected"  → /rejected
   */
  approvalStatus: "pending",
};
