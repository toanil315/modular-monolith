export const INBOX_CONFIG_TOKEN = 'INBOX_CONFIG_TOKEN';

export interface InboxConfig {
  consumedEntity: new () => any;
}
