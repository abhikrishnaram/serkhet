import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

// Base event fields that are common across all event types
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  event_type: text('event_type').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  pid: integer('pid').notNull(),
  process: text('process').notNull(),
  process_path: text('process_path').notNull(),
  node_id: text('node_id').notNull(),
  raw_data: jsonb('raw_data').notNull() // Store the complete event data
});

// Nodes table
export const nodes = pgTable('nodes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ip: text('ip').notNull(),
  status: text('status').notNull(),
  last_seen: timestamp('last_seen').notNull(),
  metrics: jsonb('metrics').notNull()
});

// File uploads tracking
export const fileUploads = pgTable('file_uploads', {
  id: serial('id').primaryKey(),
  filename: text('filename').notNull(),
  upload_time: timestamp('upload_time').defaultNow().notNull(),
  status: text('status').notNull(), // 'processing', 'completed', 'failed'
  error: text('error'),
  records_processed: integer('records_processed').default(0),
  metadata: jsonb('metadata').default({})
});
