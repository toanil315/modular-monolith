import { WorkflowContext } from '@restatedev/restate-sdk';

export type CancelEventHandler = {
  run: (context: WorkflowContext, { eventId }: CancelEventRequest) => Promise<void>;
};

export interface CancelEventRequest {
  eventId: string;
}

export const CANCEL_EVENT_WORKFLOW_NAME = 'cancel-event';
