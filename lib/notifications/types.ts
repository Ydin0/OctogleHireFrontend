export type NotificationType =
  | "new_match"
  | "developer_accepted"
  | "developer_declined"
  | "invoice_generated"
  | "engagement_started"
  | "engagement_ended"
  | "requirement_update"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  href?: string;
  createdAt: string;
}
