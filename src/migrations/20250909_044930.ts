import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`cards\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`image_id\` integer,
  	\`suit\` text,
  	\`type\` text,
  	\`set_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`set_id\`) REFERENCES \`sets\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`cards_image_idx\` ON \`cards\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`cards_set_idx\` ON \`cards\` (\`set_id\`);`)
  await db.run(sql`CREATE INDEX \`cards_updated_at_idx\` ON \`cards\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`cards_created_at_idx\` ON \`cards\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`sets\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`release_date\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`sets_updated_at_idx\` ON \`sets\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`sets_created_at_idx\` ON \`sets\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`tournaments_results\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`rank\` numeric,
  	\`player_name\` text,
  	\`deck_id\` integer,
  	FOREIGN KEY (\`deck_id\`) REFERENCES \`decks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tournaments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tournaments_results_order_idx\` ON \`tournaments_results\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tournaments_results_parent_id_idx\` ON \`tournaments_results\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tournaments_results_deck_idx\` ON \`tournaments_results\` (\`deck_id\`);`)
  await db.run(sql`CREATE TABLE \`tournaments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`date\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`tournaments_updated_at_idx\` ON \`tournaments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`tournaments_created_at_idx\` ON \`tournaments\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`decks\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`user_id\` text,
  	\`is_public\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`decks_user_idx\` ON \`decks\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`decks_updated_at_idx\` ON \`decks\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`decks_created_at_idx\` ON \`decks\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`decks_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`cards_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`decks\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cards_id\`) REFERENCES \`cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`decks_rels_order_idx\` ON \`decks_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`decks_rels_parent_idx\` ON \`decks_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`decks_rels_path_idx\` ON \`decks_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`decks_rels_cards_id_idx\` ON \`decks_rels\` (\`cards_id\`);`)
  await db.run(sql`CREATE TABLE \`users_roles\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_roles_order_idx\` ON \`users_roles\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`users_roles_parent_idx\` ON \`users_roles\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`username\` text,
  	\`avatar\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`cards_id\` integer,
  	\`sets_id\` integer,
  	\`tournaments_id\` integer,
  	\`decks_id\` integer,
  	\`users_id\` text,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cards_id\`) REFERENCES \`cards\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`sets_id\`) REFERENCES \`sets\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tournaments_id\`) REFERENCES \`tournaments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`decks_id\`) REFERENCES \`decks\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_cards_id_idx\` ON \`payload_locked_documents_rels\` (\`cards_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_sets_id_idx\` ON \`payload_locked_documents_rels\` (\`sets_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_tournaments_id_idx\` ON \`payload_locked_documents_rels\` (\`tournaments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_decks_id_idx\` ON \`payload_locked_documents_rels\` (\`decks_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`rules\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`cards\`;`)
  await db.run(sql`DROP TABLE \`sets\`;`)
  await db.run(sql`DROP TABLE \`tournaments_results\`;`)
  await db.run(sql`DROP TABLE \`tournaments\`;`)
  await db.run(sql`DROP TABLE \`decks\`;`)
  await db.run(sql`DROP TABLE \`decks_rels\`;`)
  await db.run(sql`DROP TABLE \`users_roles\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`rules\`;`)
}
