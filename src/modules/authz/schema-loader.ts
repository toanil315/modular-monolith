import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PolicyService } from './policy.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SchemaLoader implements OnModuleInit {
  private readonly logger = new Logger(SchemaLoader.name);

  constructor(private readonly policyService: PolicyService) {}

  async onModuleInit(): Promise<void> {
    await this.loadSchemas();
  }

  private async loadSchemas(): Promise<void> {
    const schemasDir = path.join(__dirname, './schemas');
    const schemaFiles = ['user.schema.zed', 'events.schema.zed'];

    let combinedSchema = '';

    for (const file of schemaFiles) {
      const filePath = path.join(schemasDir, file);

      if (!fs.existsSync(filePath)) {
        this.logger.warn(`Schema file not found: ${filePath}`);
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      // Remove import statements for combined schema
      const cleanContent = content.replace(/import\s+"[^"]+"/g, '').trim();
      combinedSchema += cleanContent + '\n\n';
    }

    console.log(schemasDir);

    if (combinedSchema.trim()) {
      await this.policyService.loadSchema(combinedSchema);
    } else {
      this.logger.warn('No schema content found to load');
    }
  }
}
