# Ground Experience Firebase Schema

This document defines the non-destructive Firebase target for the portal. Existing collections remain authoritative and are not renamed, cleared, or replaced.

## Existing collections retained

`airportsystems`, `airports`, `auditLogs`, `documents`, `inbox`, `initiatives`, `loungeVisitors`, `lounges`, `news`, `personnel`, `skyPriority`, `stationMaterials`, `touchpoints`, `users`.

## users/{uid}

Profile/access metadata only. Authentication credentials belong to Firebase Authentication, not Firestore.

```js
{
  uid,
  username,
  email,
  name,
  employeeNo,
  role,
  status,
  unit,
  scopeType,
  airports: [],
  loungeIds: [],
  tabs: [],
  permissions: [],
  mustChangePassword,
  createdAt,
  updatedAt
}
```

External User target permissions: `initiatives`, `calendar`, `project-tracking`, `inbox`.

## initiatives/{initiativeId}

Legacy records remain valid. New fields are additive:

```js
{
  // existing initiative fields remain
  createdBy,
  visibility: 'INTERNAL',
  sharedWithUserIds: [],
  mentionedUserIds: [],
  createdAt,
  updatedAt
}
```

External access is granted only when the authenticated UID is in `sharedWithUserIds` or `mentionedUserIds`. Never retrieve all initiatives and filter them in the browser.

## inbox/{messageId}

```js
{
  type,
  actorId,
  actorName,
  recipientId,
  initiativeId,
  initiativeName,
  subject,
  message,
  createdAt,
  read,
  status
}
```

Mention notification type: `INITIATIVE_MENTION`.

## documents/{documentId}

Metadata remains in Firestore. Binary content belongs in Firebase Storage.

```js
{
  name,
  description,
  category,
  initiativeId,
  airport,
  uploadedBy,
  storagePath,
  mimeType,
  size,
  status,
  createdAt,
  updatedAt
}
```

Document access follows the accessibility of its parent initiative where `initiativeId` is present.

## projectEvents/{eventId}

New collection for Calendar / Project Tracking; it does not replace any existing collection.

```js
{
  title,
  initiativeId,
  date,
  time,
  airport,
  picUserId,
  picName,
  touchpoint,
  category,
  priority,
  reminderMinutes,
  remark,
  status,
  createdBy,
  createdAt,
  updatedAt
}
```

External users see only events whose `initiativeId` refers to an accessible initiative.

## Migration rules

1. Read existing data before writing.
2. Normalize only where necessary.
3. Add missing fields without deleting existing fields.
4. Preserve existing IDs where possible.
5. Never clear/reset/overwrite all data.
6. Keep `GEStore` as a compatibility layer until Firebase-backed flows are verified.
7. Firebase Authentication + Firestore Security Rules are the authorization boundary; UI hiding is not a security boundary.
