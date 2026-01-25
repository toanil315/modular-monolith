import { Injectable, Logger } from '@nestjs/common';
import { SpiceDBClient } from './spicedb.client';
import { v1 } from '@authzed/authzed-node';

export interface WriteRelationshipParams {
  resourceType: string;
  resourceId: string;
  relation: string;
  subjectType: string;
  subjectId: string;
}

export interface DeleteRelationshipParams {
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
  private readonly logger = new Logger(PolicyService.name);

  constructor(private readonly spiceDBClient: SpiceDBClient) {}

  async writeRelationship(params: WriteRelationshipParams): Promise<void> {
    const client = this.spiceDBClient.getClient();

    this.logger.debug(
      `Writing relationship: ${params.resourceType}:${params.resourceId} -> ${params.relation} -> ${params.subjectType}:${params.subjectId}`,
    );

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
      }),
    );
  }

  async deleteRelationship(params: DeleteRelationshipParams): Promise<void> {
    const client = this.spiceDBClient.getClient();

    this.logger.debug(
      `Deleting relationship: ${params.resourceType}:${params.resourceId} -> ${params.relation} -> ${params.subjectType}:${params.subjectId}`,
    );

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
      }),
    );
  }

  async checkPermission(params: CheckPermissionParams): Promise<boolean> {
    const client = this.spiceDBClient.getClient();

    this.logger.debug(
      `Checking permission: ${params.subjectType}:${params.subjectId} has ${params.permission} on ${params.resourceType}:${params.resourceId}`,
    );

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
      }),
    );

    const hasPermission =
      response.permissionship === v1.CheckPermissionResponse_Permissionship.HAS_PERMISSION;

    this.logger.debug(`Permission check result: ${hasPermission ? 'GRANTED' : 'DENIED'}`);

    return hasPermission;
  }

  async loadSchema(schemaContent: string): Promise<void> {
    const client = this.spiceDBClient.getClient();

    this.logger.log('Loading SpiceDB schema');

    await client.writeSchema(
      v1.WriteSchemaRequest.create({
        schema: schemaContent,
      }),
    );

    this.logger.log('SpiceDB schema loaded successfully');
  }
}
