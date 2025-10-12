export const OUTBOX_CONFIG_TOKEN = 'OUTBOX_CONFIG_TOKEN';

export interface OutboxConfig {
  entity: new () => any;
}
