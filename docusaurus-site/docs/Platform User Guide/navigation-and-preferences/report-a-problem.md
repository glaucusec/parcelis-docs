---
title: Report a problem
slug: /report-a-problem
---

Active, signed-in staff in any role, including maintenance, can report a Parcelis bug without administrator permissions or a GitHub account. Tenant and resident accounts are not included.

## Send a report

1. Open **My Account** at the bottom of the sidebar. On mobile, open the navigation first.
2. Select **Report a problem**, directly below **Request a feature**.
3. Describe what happened, what you expected, and the steps needed to reproduce it. Remove private information before continuing.
4. Optionally include the page URL, browser/app version, or screenshots. These are off by default. You can attach up to three PNG, JPEG, or WebP images, up to 5 MB each. Preview each image and remove private information yourself before attaching it.
5. Select **Next** to review all included details and screenshots. URL query parameters and fragments are removed; check the remaining path for private information. Use **Back** to make changes.
6. Select **Send report**. Wait for the **Report sent** confirmation, then select **Done**.

Reports are emailed privately to **support@parcelis.dev**, including from self-hosted installations. Parcelis does not automatically collect logs, cookies, tokens, other form contents, or tenant/property records. Screenshot filenames are replaced with generic names; the image contents are sent as selected.

Parcelis maintainers review reports privately outside the app and remove sensitive information before manually creating any public GitHub issue. Submission does not automatically publish anything to GitHub. Report history and status tracking are not available in the app. Use **Request a feature** for suggestions.

## If sending fails

Your description, selected context, and screenshots remain available so you can retry or go back and edit. Avoid refreshing or navigating away before retrying: drafts are held only in this browser page and are not stored as report history. After repeated attempts, wait 15 minutes before trying again.

Closing the form keeps your description and screenshots, but clears optional page and browser/app context. Select those options again after reopening the form to include current information.

Ask your administrator to check [outgoing email settings](./email-settings.md) if the error continues. Reports use the active organization's saved SMTP settings or the deployment SMTP configuration when no organization configuration exists. The recipient is always **support@parcelis.dev**; organizations cannot redirect product bug reports to another inbox. SMTP acceptance confirms submission, but does not guarantee inbox delivery.

For a self-hosted deployment with an additional reverse proxy, allow at least 16 MB request bodies for `/trpc/bugReports.submit`. The bundled proxies already allow this size. An email provider may impose its own message size limits, including encoding overhead; use fewer or smaller screenshots if needed.
