# Authorization Hierarchy and Schema

This document outlines the proposed authorization hierarchy and provides a Prisma schema and example API endpoints to demonstrate its structure.

## Proposed Authorization Hierarchy

1.  **Tenant:** The highest level, representing a distinct organization or customer.
2.  **Workspace:** A subdivision within a Tenant, allowing for separate teams or projects.
3.  **User:** Individuals who have access to a Workspace.
4.  **Role:** Assigned to Users to define their permissions and access rights within a Workspace.
5.  **Permission:** Specific actions that can be granted or denied, grouped by Roles.

---

## Prisma Schema (`schema.prisma`)

```prisma
// 1. Tenant Model: Top-level organization
model Tenant {
  id          String      @id @default(cuid())
  name        String
  workspaces  Workspace[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

// 2. Workspace Model: Belongs to a Tenant
model Workspace {
  id        String    @id @default(cuid())
  name      String
  tenantId  String
  tenant    Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  members   UsersOnWorkspaces[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// 3. User Model: Can exist across multiple Workspaces
model User {
  id          String      @id @default(cuid())
  email       String      @unique
  name        String?
  password    String      // Hashed password
  workspaces  UsersOnWorkspaces[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

// 4. Role Model: Defines a set of permissions
model Role {
  id          Int      @id @default(autoincrement())
  name        String   @unique // e.g., "Admin", "Editor", "Viewer"
  users       UsersOnWorkspaces[]
  permissions RolesOnPermissions[]
}

// 5. Permission Model: A specific action
model Permission {
  id    Int     @id @default(autoincrement())
  name  String  @unique // e.g., "create:post", "delete:user"
  roles RolesOnPermissions[]
}

// --- Join Tables for Relationships ---

// Links a User to a Workspace with a specific Role
model UsersOnWorkspaces {
  userId      String
  workspaceId String
  roleId      Int
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspace   Workspace   @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  role        Role        @relation(fields: [roleId], references: [id])

  @@id([userId, workspaceId])
}

// Links a Role to a Permission
model RolesOnPermissions {
  roleId        Int
  permissionId  Int
  role          Role        @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission    Permission  @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
}
```

---

## Example API Endpoints

*   **Tenant & Workspace Management**
    *   `POST /tenants` - Create a new tenant.
    *   `POST /tenants/{tenantId}/workspaces` - Create a new workspace within a tenant.

*   **User & Role Management within a Workspace**
    *   `GET /workspaces/{workspaceId}/users` - List users in a workspace.
    *   `POST /workspaces/{workspaceId}/users` (Body: `{ "email": "user@example.com", "role": "Admin" }`) - Add a user to a workspace with a specific role.
    *   `PUT /workspaces/{workspaceId}/users/{userId}` (Body: `{ "role": "Editor" }`) - Update a user's role in a workspace.

*   **Permission Checking (example middleware logic)**
    *   `GET /users/me/permissions` - To fetch permissions for the currently authenticated user in a specific workspace (workspace inferred from token/session).
