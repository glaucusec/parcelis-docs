---
title: Lease Dashboard
slug: /lease-dashboard
---
Use **Leases** in the sidebar to review lease records across the portfolio.

The dashboard summarizes all leases, active leases, leases expiring in the next 90 days, and leases in notice. Search
by property, unit, or resident, and use **Filters** to narrow the list by status. Select a lease to open its details,
including its term, monthly rent, rent due day, property, unit, and associated residents.

Archived leases are excluded from the default directory. Archiving preserves lease history and contractual status,
so it does not change occupancy or operating metrics. Restoring a lease returns it to the directory.

## Add a Lease

1. Select **Lease** in the page header.
2. Choose an available property unit. Parcelis immediately creates a draft lease, which is also visible on the
   Lease dashboard with a **Draft** status.
3. Add residents, monthly rent, deposit, billing responsibility, term dates, and the configured rent invoice item. Changes save automatically while
   you work.
4. Leaving the wizard preserves the draft. **Lease** always opens a fresh property/unit selection screen.
   To continue saved work, select **Resume draft** under **Unfinished leases** on the dashboard. Drafts show their
   property, unit, and last update, even before residents have been added. **Discard** permanently deletes a draft
   after confirmation.
   Selecting a unit with an unfinished lease offers **Resume draft**, **Discard and start new**, or
   **Choose another unit**. Discarding requires permission to delete leases.
5. Review the lease details and planned rent invoice count, total, due dates, and amounts. The security deposit
   appears separately. Then select **Finalize lease**.

A lease starting on or before the current date in the organization's timezone becomes **Active**. A later start date becomes **Scheduled**
and does not count as current occupancy until activation. Parcelis checks the unit's lease dates before completing
the draft. Completing it creates the full rent invoice schedule for a fixed term spanning at most 120 calendar months,
or the first 12 calendar months for a month-to-month lease. A fixed term spanning more than 120 months cannot be
finalized. Scheduled leases receive their invoices at finalization; activation does not create another schedule.
Partial first and last months are prorated. Security deposits are not included in these rent invoices, and
completing a lease does not collect payments.
The rent item name and default description are copied into each generated invoice. Manage the organization catalog in
**Settings → Invoicing**. Use `{month}` and `{year}` in a charge's default description to include each invoice's
billing period, for example, "Monthly rent for January 2027." Later catalog edits do not change saved invoices.

Creating a completed lease from a resident record uses the same rent schedule. Draft leases have no invoices until
they are completed. Creating a completed lease requires permission to create both leases and invoices.

Units with an active or notice-period lease are unavailable for a new lease. A lease with no end date is displayed as
**Month-to-month**.


## Listing row actions

These workflows are available from each row’s **Actions** menu on the **Leases**
dashboard, in grouped and ungrouped views. The detail-page header is unchanged.

Open a lease detail page by selecting its lease number or choosing **Actions → View** on its row in the
**Leases** dashboard. The row menu is available in grouped and ungrouped views and requires Leases View
permission. For an unfinished lease with a saved draft, users with Leases Edit permission can choose
**Resume draft** to continue the existing lease wizard.

The row menu also provides **Archive** or **Unarchive** with Leases Archive permission. Archiving requires
confirmation; unarchiving restores the lease to the default directory. With Leases Delete permission,
eligible draft rows provide **Delete**, with a permanent-deletion confirmation. The server rejects deletion
if the draft has invoices or has already been finalized. Completed actions refresh the directory and unfinished
lease list. These actions are available in both grouped and ungrouped views.


## Edit lease settings

Choose **Actions → Edit Lease** to change partial-payment and fixed-term
month-to-month continuation settings. This requires **Leases → Edit** and an
unarchived, finalized lease that has not ended. A lease with a termination notice
or linked renewal cannot be changed to continue month to month.

Existing rent, deposit, billing allocations, and contract dates are preserved.
Use **Renew Lease** to review new contract terms, or **Terminate** for an earlier
end date. Unfinished leases use **Resume draft** instead.

## Edit tenants

Choose **Actions → Edit Tenants** with **Leases → Edit** and **Tenants → View**.
You can manage joint household assignments on an unarchived, ongoing lease.
At least one resident is required. Existing invoices and their recipients remain
unchanged. Residents referenced by invoice history cannot be removed; changes to
individual billing allocations require a renewal. Archived residents cannot be
newly assigned.

## Renew a lease

Choose **Actions → Renew Lease** with **Leases → Create** and **Leases → Edit**.
Enter a start date after the existing fixed lease ends. A continuing month-to-month
lease needs a recorded end first. Parcelis creates one linked renewal draft and
opens the lease wizard with the same property, unit, residents, and billing settings.
If a renewal already exists, continue to that record instead.
If the unit has another unfinished, unarchived lease draft, renewal creation is
blocked. Resume, archive, or delete that draft before creating the renewal.

Review the new term, rent, deposit, and household allocations before finalizing.
Creating a draft does not create invoices or change occupancy. Finalization checks
unit availability and overlapping dates, then uses the normal invoice and lifecycle
process.

## Lease notes

Choose **Actions → Notes** to use the shared Notes drawer. Viewing requires both
**Leases → View** and **Lease Notes → View**. Creating, editing, and deleting notes
require the corresponding **Lease Notes** permission. Administrators have these
permissions automatically; configure them explicitly for other roles in Roles &
permissions. Notes are saved to the lease and remain available after archiving.

## Terminate a lease

Choose **Actions → Terminate** with **Leases → Edit**. Enter the last lease day
and a reason, then explicitly confirm the billing policy: the existing final
period charge is retained without additional proration. Only wholly unpaid
invoices for periods beginning after the end date are voided. Payments and
historical invoices are retained. Voiding future invoices also requires
**Invoices → Edit**; without it, termination is rejected without changing the
lease or invoices. This additional permission is not required when no future
invoices need voiding. Parcelis rejects termination if a future invoice
needs a credit, refund, or payment adjustment, or if a linked renewal must first
be resolved.

A future end date places an active lease on notice; the lifecycle worker releases
occupancy after the final day in the organization's timezone. A past end date ends
occupancy immediately. A scheduled lease can be canceled before move-in without
changing occupied-unit counts. The end date cannot extend a fixed lease unless
it is continuing month to month; continued tenancies can end after the original
fixed-term date. Archived
leases must first be unarchived, and ended leases cannot be terminated again.

Lease activity records settings, household changes, renewal creation, and termination
reasons alongside lifecycle transitions.
