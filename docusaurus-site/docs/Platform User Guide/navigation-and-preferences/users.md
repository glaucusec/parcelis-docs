---
title: Users
slug: /users
---
Open **Settings** from the sidebar to view the accounts created for the Parcelis workspace. The **Users** tab shows
each account's name, email address, phone number, role, and account status.

Select **New user** in the page header to create an account, assign a role, and set a temporary password. Parcelis
sends the user a verification link; the account remains pending until they open it. The Users
navigation item requires **Users** View. Roles with Users Create can create non-administrator accounts; Users Edit,
Archive, and Delete control the matching Actions-menu options. Administrators can create any role and always have
every permission.

Select a user row to open that user's profile. Organization administrators can update the profile's name, email
address, and phone number.

Use the Actions menu to edit an account, disable or enable sign-in access, or permanently delete the account.
Disabled accounts cannot sign in until they are enabled again.

The **Roles** tab lists Administrator, Property Manager, Lease Manager, Maintenance, Property Owner, and Resident
Manager roles. Select **Manage** to grant View, Create, Edit, Archive, and Delete permissions independently for
Properties, Units, Tenants, Leases, Applications, Maintenance, Invoices, and Users. Selecting a modifying action also
enables View; clearing View clears the other actions for that area. The API enforces these permissions for reads,
writes, archive and restore actions, and permanent deletion.

Expand **Notes** to configure Property Notes, Unit Notes, Tenant Notes, Application Notes, Maintenance Notes, and
Invoice Notes separately. The parent Notes checkboxes apply an action to every note type and show a mixed state when
the sub-items differ. A role must also have View access to the record containing the note. For example, reading a unit
note requires both Unit Notes View and Units View. Notes do not support archiving. Administrator permissions are
always enabled and cannot be changed.

## Related records and restricted information

Viewing a property or tenant does not grant access to its related records. Property and tenant
responses apply each related resource's View permission. Restricted collections are empty; restricted
balances, occupancy, and lease-derived tenant status are unavailable rather than reported as zero or
past. The screens display **Unavailable** for restricted metrics and status. A tenant's archive status
remains visible with Tenants View. Property capacity (`unitCount`) remains part of the property record.
Lease-derived rent and current-lease information also display **Unavailable** without Leases View.
Property status filters are unavailable without Leases View; the open-ticket filter keeps properties
whose maintenance counts are hidden.

Invoices View is required for nested invoice records and overdue balances, including when Leases View
is granted. Direct invoice details and PDF downloads also require Invoices View. Notes View is required
for legacy note fields as well as the Notes drawer, together with View access to the parent record.

Roles and their resource permissions are platform-wide. The platform Administrator role has access to
all organizations and bypasses stored role grants; it is not an organization-isolated administrator role.
Other users can select only organizations where they have membership, and record reads are scoped to
the selected organization. These controls do not provide independently configured roles per organization.
Organization API tokens receive their issuing organization's capabilities for allowlisted REST operations.
Feature flags, supported-action checks, nested ownership checks, and domain validation still apply.
