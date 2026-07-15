// YP (Yahshua Payroll) sync capability.
//
// Whether a user can sync with Payroll is an EMPLOYER-level fact (does the
// employer have a YP integration), NOT a per-user fact. Only the user who signs
// in via YP SSO gets login_type "yahshua-payroll" / "yg-payroll"; sub-users
// created inside HRIS always have login_type "password". Gating the sync UI on
// login_type therefore hides it from every sub-user even though their employer
// is fully linked to Payroll.
//
// `has_yp_integration` (from the login / user-detail responses) is the
// authoritative signal. We also accept the payroll login types as a fallback so
// existing SSO sessions keep working even if the flag is absent from a response.

export const PAYROLL_LOGIN_TYPES = ['yahshua-payroll', 'yg-payroll'];

export function canSyncWithPayroll(
  loginType?: string | null,
  hasYpIntegration?: boolean | null,
): boolean {
  return Boolean(hasYpIntegration) || PAYROLL_LOGIN_TYPES.includes(loginType ?? '');
}
