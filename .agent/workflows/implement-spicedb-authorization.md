---
description: Implement SpiceDB permission-based authorization for the events module (ReBAC migration)
---

# SpiceDB Permission-Based Authorization Implementation

This workflow guides you through migrating from RBAC (static permission lists) to SpiceDB relationship-based access control (ReBAC) for fine-grained, resource-level permissions.

## Goal

Implement owner-based permissions for the **event entity**:
- **Anyone** can view events
- **Only the owner** can edit/delete events

---

## Prerequisites

Before starting, verify:

1. **SpiceDB is running** via Docker:
   ```bash
   docker ps | grep spicedb
   # Expected: spicedb container running on ports 50051, 28080
   ```

2. If SpiceDB is not running, start it:
   ```bash
   cd /Users/dangcongtoan/Desktop/codes/BE/modular-monolith
   docker-compose up -d spicedb
   ```

3. **Environment variables** are configured in `.env`:
   ```
   SPICEDB_ENDPOINT=localhost:50051
   SPICEDB_TOKEN=your-preshared-key
   ```

---

## Step 1: Install SpiceDB Client Dependency

```bash
cd /Users/dangcongtoan/Desktop/codes/BE/modular-monolith
yarn add @authzed/authzed-node
```

**Verification**: Check `package.json` includes `@authzed/authzed-node`.

---

## Step 2: Create the Authz Module Structure

Create the following directory structure under `src/modules/authz/`:

```
src/modules/authz/
├── authz.module.ts              # Main module definition
├── application/
│   └── policy.service.ts        # Public service interface
├── infrastructure/
│   ├── spicedb.client.ts        # SpiceDB gRPC client wrapper
│   └── schema-loader.ts         # Schema file loader utility
└── schemas/
    ├── user.schema.zed          # User type definition
    └── events.schema.zed        # Event permissions schema
```

Create the directories:
```bash
mkdir -p src/modules/authz/application
mkdir -p src/modules/authz/infrastructure
```

---

## Step 3: Implement SpiceDB Client

Create file: `src/modules/authz/infrastructure/spicedb.client.ts`

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { v1 } from '@authzed/authzed-node';

@Injectable()
export class SpiceDBClient implements OnModuleInit {
  private client: v1.ZedPromiseClientInterface;

  onModuleInit() {
    const endpoint = process.env.SPICEDB_ENDPOINT || 'localhost:50051';
    const token = process.env.SPICEDB_TOKEN || '';
    
    this.client = v1.NewClient(
      token,
      endpoint,
      v1.ClientSecurity.INSECURE_PLAINTEXT_CREDENTIALS
    ).promises;
  }

  getClient(): v1.ZedPromiseClientInterface {
    return this.client;
  }
}
```

---

## Step 4: Implement Policy Service

Create file: `src/modules/authz/application/policy.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { SpiceDBClient } from '../infrastructure/spicedb.client';
import { v1 } from '@authzed/authzed-node';

export interface WriteRelationshipParams {
  resourceType: string;
  resourceId: string;
  relation: string;
  subjectType: string;
  subjectId: string;
}

export interface CheckPermissionParams {
  resourceType: string;
  resourceId: string;
  permission: string;
  subjectType: string;
  subjectId: string;
}

@Injectable()
export class PolicyService {
  constructor(private readonly spiceDBClient: SpiceDBClient) {}

  async writeRelationship(params: WriteRelationshipParams): Promise<void> {
    const client = this.spiceDBClient.getClient();
    
    await client.writeRelationships(
      v1.WriteRelationshipsRequest.create({
        updates: [
          {
            operation: v1.RelationshipUpdate_Operation.CREATE,
            relationship: {
              resource: {
                objectType: params.resourceType,
                objectId: params.resourceId,
              },
              relation: params.relation,
              subject: {
                object: {
                  objectType: params.subjectType,
                  objectId: params.subjectId,
                },
              },
            },
          },
        ],
      })
    );
  }

  async deleteRelationship(params: WriteRelationshipParams): Promise<void> {
    const client = this.spiceDBClient.getClient();
    
    await client.writeRelationships(
      v1.WriteRelationshipsRequest.create({
        updates: [
          {
            operation: v1.RelationshipUpdate_Operation.DELETE,
            relationship: {
              resource: {
                objectType: params.resourceType,
                objectId: params.resourceId,
              },
              relation: params.relation,
              subject: {
                object: {
                  objectType: params.subjectType,
                  objectId: params.subjectId,
                },
              },
            },
          },
        ],
      })
    );
  }

  async checkPermission(params: CheckPermissionParams): Promise<boolean> {
    const client = this.spiceDBClient.getClient();

    const response = await client.checkPermission(
      v1.CheckPermissionRequest.create({
        resource: {
          objectType: params.resourceType,
          objectId: params.resourceId,
        },
        permission: params.permission,
        subject: {
          object: {
            objectType: params.subjectType,
            objectId: params.subjectId,
          },
        },
        consistency: {
          requirement: {
            oneofKind: 'fullyConsistent',
            fullyConsistent: true,
          },
        },
      })
    );

    return (
      response.permissionship ===
      v1.CheckPermissionResponse_Permissionship.HAS_PERMISSION
    );
  }

  async loadSchema(schemaContent: string): Promise<void> {
    const client = this.spiceDBClient.getClient();
    
    await client.writeSchema(
      v1.WriteSchemaRequest.create({
        schema: schemaContent,
      })
    );
  }
}
```

---

## Step 5: Implement Schema Loader

Create file: `src/modules/authz/infrastructure/schema-loader.ts`

```typescript
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PolicyService } from '../application/policy.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SchemaLoader implements OnModuleInit {
  private readonly logger = new Logger(SchemaLoader.name);

  constructor(private readonly policyService: PolicyService) {}

  async onModuleInit(): Promise<void> {
    await this.loadSchemas();
    await this.writePublicViewerRelationship();
  }

  private async loadSchemas(): Promise<void> {
    const schemasDir = path.join(__dirname, '../schemas');
    const schemaFiles = ['user.schema.zed', 'events.schema.zed'];
    
    let combinedSchema = '';
    
    for (const file of schemaFiles) {
      const filePath = path.join(schemasDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      // Remove import statements for combined schema
      const cleanContent = content.replace(/import\s+"[^"]+"/g, '');
      combinedSchema += cleanContent + '\n';
    }

    await this.policyService.loadSchema(combinedSchema);
    this.logger.log('SpiceDB schemas loaded successfully');
  }

  private async writePublicViewerRelationship(): Promise<void> {
    // Write the wildcard viewer relationship for public event access
    // This makes all events viewable by anyone
    try {
      await this.policyService.writeRelationship({
        resourceType: 'event',
        resourceId: '*',
        relation: 'viewer',
        subjectType: 'user',
        subjectId: '*',
      });
      this.logger.log('Public viewer relationship written');
    } catch (error) {
      // Relationship may already exist, ignore error
      this.logger.debug('Public viewer relationship may already exist');
    }
  }
}
```

---

## Step 6: Update SpiceDB Schema Files

### File: `src/modules/authz/schemas/user.schema.zed`

```zed
definition user {}
```

### File: `src/modules/authz/schemas/events.schema.zed`

```zed
definition event {
    // Relationships
    relation owner: user
    relation viewer: user | user:*
    
    // Permissions
    permission view = owner + viewer
    permission edit = owner
    permission delete = owner
}
```

---

## Step 7: Create the Authz Module

Create file: `src/modules/authz/authz.module.ts`

```typescript
import { Global, Module } from '@nestjs/common';
import { SpiceDBClient } from './infrastructure/spicedb.client';
import { PolicyService } from './application/policy.service';
import { SchemaLoader } from './infrastructure/schema-loader';

@Global()
@Module({
  providers: [SpiceDBClient, PolicyService, SchemaLoader],
  exports: [PolicyService],
})
export class AuthzModule {}
```

---

## Step 8: Create Permission Check Decorator

Create file: `src/modules/common/application/authorization/check-permission.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';

export interface CheckPermissionOptions {
  resourceType: string;
  resourceIdParam: string;  // Name of the route/body param containing resource ID
  permission: string;       // The permission to check: 'view', 'edit', 'delete'
}

export const CHECK_PERMISSION_KEY = 'check_permission';

export const CheckPermission = (options: CheckPermissionOptions) =>
  SetMetadata(CHECK_PERMISSION_KEY, options);
```

---

## Step 9: Create Resource Authorization Guard

Create file: `src/modules/common/infrastructure/authorization/resource-authorization.guard.ts`

```typescript
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PolicyService } from '../../../authz/application/policy.service';
import {
  CHECK_PERMISSION_KEY,
  CheckPermissionOptions,
} from '../../application/authorization/check-permission.decorator';

@Injectable()
export class ResourceAuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly policyService: PolicyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionOptions = this.reflector.get<CheckPermissionOptions>(
      CHECK_PERMISSION_KEY,
      context.getHandler(),
    );

    if (!permissionOptions) {
      return true; // No permission check required
    }

    const request = context.switchToHttp().getRequest();
    const userId = this.extractUserId(request);
    const resourceId = this.extractResourceId(request, permissionOptions.resourceIdParam);

    if (!userId || !resourceId) {
      throw new ForbiddenException('Unable to determine user or resource');
    }

    const hasPermission = await this.policyService.checkPermission({
      resourceType: permissionOptions.resourceType,
      resourceId: resourceId,
      permission: permissionOptions.permission,
      subjectType: 'user',
      subjectId: userId,
    });

    if (!hasPermission) {
      throw new ForbiddenException(
        `You do not have ${permissionOptions.permission} permission on this ${permissionOptions.resourceType}`,
      );
    }

    return true;
  }

  private extractUserId(request: any): string | null {
    // Extract user ID from JWT token payload
    // Adjust based on your actual JWT structure
    return request.user?.sub || request.user?.id || null;
  }

  private extractResourceId(request: any, paramName: string): string | null {
    // Try route params first, then body
    return request.params?.[paramName] || request.body?.[paramName] || null;
  }
}
```

---

## Step 10: Update Create Event Command Handler

Modify file: `src/modules/events/application/events/create-event/create-event.command.handler.ts`

Add the following after the event is created and persisted:

```typescript
// Import PolicyService
import { PolicyService } from '../../../../authz/application/policy.service';

// Inject in constructor
constructor(
  // ... existing dependencies
  private readonly policyService: PolicyService,
) {}

// After event.commit() or repository.save(), add:
async execute(command: CreateEventCommand): Promise<CreateEventResult> {
  // ... existing event creation logic ...
  
  // After event is saved, write ownership relationship
  await this.policyService.writeRelationship({
    resourceType: 'event',
    resourceId: event.id, // or event.getId().toString()
    relation: 'owner',
    subjectType: 'user',
    subjectId: command.userId, // The creator's user ID
  });
  
  return result;
}
```

---

## Step 11: Update Events Controller with Permission Checks

Modify file: `src/modules/events/presentation/events/events.controller.ts`

Add imports:
```typescript
import { UseGuards } from '@nestjs/common';
import { ResourceAuthorizationGuard } from '../../../common/infrastructure/authorization/resource-authorization.guard';
import { CheckPermission } from '../../../common/application/authorization/check-permission.decorator';
```

Update endpoints that require owner permission:

```typescript
@Put('cancel')
@UseGuards(ResourceAuthorizationGuard)
@CheckPermission({ resourceType: 'event', resourceIdParam: 'id', permission: 'delete' })
async cancelEvent(@Body() dto: CancelEventDto) {
  // ... existing implementation
}

@Put('reschedule')
@UseGuards(ResourceAuthorizationGuard)
@CheckPermission({ resourceType: 'event', resourceIdParam: 'id', permission: 'edit' })
async rescheduleEvent(@Body() dto: RescheduleEventDto) {
  // ... existing implementation
}

@Put('publish')
@UseGuards(ResourceAuthorizationGuard)
@CheckPermission({ resourceType: 'event', resourceIdParam: 'id', permission: 'edit' })
async publishEvent(@Body() dto: PublishEventDto) {
  // ... existing implementation
}
```

---

## Step 12: Register AuthzModule in App Module

Modify file: `src/app.module.ts`

```typescript
import { AuthzModule } from './modules/authz/authz.module';

@Module({
  imports: [
    // ... existing imports
    AuthzModule,
  ],
  // ...
})
export class AppModule {}
```

---

## Verification

### Step 1: Start the Application

```bash
cd /Users/dangcongtoan/Desktop/codes/BE/modular-monolith
yarn start:dev
```

**Check logs for**: "SpiceDB schemas loaded successfully"

### Step 2: Create an Event (as User A)

```bash
curl -X POST http://localhost:3000/events \
  -H "Authorization: Bearer <USER_A_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": "...",
    "title": "Test Event",
    "description": "...",
    "startsAt": "2026-02-01T10:00:00Z",
    "endsAt": "2026-02-01T12:00:00Z"
  }'
```

**Note the returned event ID.**

### Step 3: Verify Owner Can Edit

```bash
curl -X PUT http://localhost:3000/events/reschedule \
  -H "Authorization: Bearer <USER_A_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "<EVENT_ID>",
    "startsAt": "2026-02-02T10:00:00Z",
    "endsAt": "2026-02-02T12:00:00Z"
  }'
```

**Expected**: 200 OK

### Step 4: Verify Non-Owner Cannot Edit

```bash
curl -X PUT http://localhost:3000/events/reschedule \
  -H "Authorization: Bearer <USER_B_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "<EVENT_ID>",
    "startsAt": "2026-02-02T10:00:00Z",
    "endsAt": "2026-02-02T12:00:00Z"
  }'
```

**Expected**: 403 Forbidden

### Step 5: Verify Anyone Can View

```bash
curl -X GET "http://localhost:3000/events/<EVENT_ID>" \
  -H "Authorization: Bearer <ANY_USER_TOKEN>"
```

**Expected**: 200 OK with event details

---

## Troubleshooting

### SpiceDB Connection Errors
- Verify SpiceDB container is running: `docker ps | grep spicedb`
- Check endpoint in `.env` matches container port mapping
- Ensure token matches the one used when starting SpiceDB

### Schema Loading Errors
- Check `.zed` files have valid syntax
- Use SpiceDB Playground at `http://localhost:13000` to validate schemas

### Permission Denied Unexpectedly
- Verify ownership relationship was written when event was created
- Check SpiceDB relationships: use `zed relationship read event:<id> viewer`
- Ensure user ID extraction from JWT is correct

---

## File Checklist

After implementation, verify these files exist:

- [ ] `src/modules/authz/authz.module.ts`
- [ ] `src/modules/authz/application/policy.service.ts`
- [ ] `src/modules/authz/infrastructure/spicedb.client.ts`
- [ ] `src/modules/authz/infrastructure/schema-loader.ts`
- [ ] `src/modules/authz/schemas/user.schema.zed`
- [ ] `src/modules/authz/schemas/events.schema.zed`
- [ ] `src/modules/common/application/authorization/check-permission.decorator.ts`
- [ ] `src/modules/common/infrastructure/authorization/resource-authorization.guard.ts`

And these files are modified:

- [ ] `src/app.module.ts` - Added AuthzModule import
- [ ] `src/modules/events/application/events/create-event/create-event.command.handler.ts` - Added ownership write
- [ ] `src/modules/events/presentation/events/events.controller.ts` - Added permission checks
- [ ] `package.json` - Added `@authzed/authzed-node` dependency

---

## Notes for Data Migration

> [!WARNING]
> Existing events in the database don't have ownership relationships in SpiceDB. You must backfill these:

```typescript
// Example backfill script
const events = await eventRepository.findAll();
for (const event of events) {
  await policyService.writeRelationship({
    resourceType: 'event',
    resourceId: event.id,
    relation: 'owner',
    subjectType: 'user',
    subjectId: event.creatorId,
  });
}
```
