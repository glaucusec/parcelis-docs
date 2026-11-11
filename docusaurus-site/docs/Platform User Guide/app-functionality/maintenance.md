---
title: Manage Maintenance
slug: /maintenance
---
Use **Maintenance** in the sidebar to create, find, and manage maintenance tickets across the portfolio.

## Dashboard

The dashboard lists tickets. Search by ticket, property, category, or status, use **Filters** to narrow results, or
use **Group by** to organize tickets by property. Ticket action menus include **View**, **Edit**, **Notes**, lifecycle
actions, archive, and delete.

Each ticket has a sequential reference number in the format `MNT-0000001`. Use this number when referring to a
ticket with another team member.

Select **Filters** to narrow tickets by status, property, unit, category, or priority. **Open statuses** includes
New, In Progress, Pending, and Scheduled. Choosing a property limits the unit choices; changing properties clears
a selected unit if it does not belong to the new property. The choices include all accessible properties and their
units, including those without maintenance tickets. Unit filtering includes tickets associated with that
unit, including tickets shared with other units, and excludes property-wide tickets without unit associations.

Maintenance View permission provides access to the property and unit filter choices without requiring Properties
View permission. If unit details fail to load, a notice in the results area identifies potentially incomplete results
and offers **Retry loading unit details**. Tickets matched by their saved unit IDs remain visible while details
needed for label-only tickets are unavailable.

Open-ticket counts in Properties link here with the relevant filters already selected. Property, unit, and status
selections are kept in the URL: `/maintenance?propertyId=3&status=open` shows a property's open tickets, and
`/maintenance?propertyId=3&unitId=12&status=open` narrows them to one unit. You can change the status after opening
the link. Invalid IDs or status values use the corresponding unfiltered default.

**Clear Filters** resets status, property, unit, category, and priority while retaining the search text and grouping.
If no tickets match, the page shows an empty state; tickets may have changed since the source count was displayed.

The collapsed **Logging** card shows recent activity across maintenance tickets. Expand it to review when a
note was added or a ticket was acknowledged, resolved, canceled, reopened, or otherwise moved to a different status.

The ticket detail header groups **Edit Maintenance** with the current workflow action: **Acknowledge** for new tickets, **Resolve** for other active tickets, or **Reopen Ticket** for resolved tickets. **Actions** contains **Add Notes** and **Cancel Ticket**. On mobile, all header actions move into Actions. Existing permission, note, and confirmation requirements still apply.

## Create or Edit a Ticket

Select **New Maintenance Item** or **Edit Maintenance**. Required details are a title, property, at least one unit,
category, description, requester, and priority. You can mark a request urgent and record whether consent to enter
the premises is granted. Use **Maintenance Images** to attach one or more JPG, PNG, or WebP images up to 2 MB;
existing images can be removed
from the edit drawer.

## Status and Resolution

Tickets use **New**, **In Progress**, **Pending**, **Scheduled**, **Resolved**, **Closed**, and **Canceled**.
Acknowledging a New ticket changes it to In Progress. Resolving requires a maintenance note from the previous
24 hours; Parcelis prompts for a resolution note when one is needed. Reopening a resolved ticket changes it to In
Progress and adds a `Ticket Reopened` note. Resolving adds a `Ticket Resolved` note. Canceling an active ticket
requires a cancellation note.

## Ticket Details

Ticket details show status, requester, issue date, category, priority, description, and entry consent. Photos are
view-only and open in a gallery. Recent notes show the latest five notes, support inline edit and delete, and link to
the full Notes drawer. Property and unit detail pages link listed maintenance items to their ticket details.
