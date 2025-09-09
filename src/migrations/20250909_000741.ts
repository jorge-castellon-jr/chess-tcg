import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_cards\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`image_id\` integer,
  	\`suit\` text,
  	\`type\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_cards\`("id", "name", "image_id", "suit", "type", "updated_at", "created_at") SELECT "id", "name", "image_id", "suit", "type", "updated_at", "created_at" FROM \`cards\`;`)
  await db.run(sql`DROP TABLE \`cards\`;`)
  await db.run(sql`ALTER TABLE \`__new_cards\` RENAME TO \`cards\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`cards_image_idx\` ON \`cards\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`cards_updated_at_idx\` ON \`cards\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`cards_created_at_idx\` ON \`cards\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_media\` (
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
  await db.run(sql`INSERT INTO \`__new_media\`("id", "alt", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y") SELECT "id", "alt", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y" FROM \`media\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
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
  await db.run(sql`INSERT INTO \`__new_media\`("id", "alt", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y") SELECT "id", "alt", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y" FROM \`media\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`card_type\` text;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`material_value\` numeric;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`cost\` numeric;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`attack\` numeric;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`health\` numeric;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`effects\` text;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`tactic_type\` text;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`set_id\` integer REFERENCES sets(id);`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`url\` text;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`thumbnail_u_r_l\` text;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`filename\` text;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`mime_type\` text;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`filesize\` numeric;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`width\` numeric;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`height\` numeric;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`focal_x\` numeric;`)
  await db.run(sql`ALTER TABLE \`cards\` ADD \`focal_y\` numeric;`)
  await db.run(sql`CREATE INDEX \`cards_set_idx\` ON \`cards\` (\`set_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`cards_filename_idx\` ON \`cards\` (\`filename\`);`)
  await db.run(sql`ALTER TABLE \`cards\` DROP COLUMN \`suit\`;`)
  await db.run(sql`ALTER TABLE \`cards\` DROP COLUMN \`type\`;`)
}
