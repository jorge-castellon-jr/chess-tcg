import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_cards\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`card_type\` text,
  	\`material_value\` numeric,
  	\`cost\` numeric,
  	\`attack\` numeric,
  	\`health\` numeric,
  	\`effects\` text,
  	\`tactic_type\` text,
  	\`set_id\` integer,
  	\`image_id\` integer,
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
  	\`focal_y\` numeric,
  	FOREIGN KEY (\`set_id\`) REFERENCES \`sets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_cards\`("id", "name", "card_type", "material_value", "cost", "attack", "health", "effects", "tactic_type", "set_id", "image_id", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y") SELECT "id", "name", "card_type", "material_value", "cost", "attack", "health", "effects", "tactic_type", "set_id", "image_id", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y" FROM \`cards\`;`)
  await db.run(sql`DROP TABLE \`cards\`;`)
  await db.run(sql`ALTER TABLE \`__new_cards\` RENAME TO \`cards\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`cards_set_idx\` ON \`cards\` (\`set_id\`);`)
  await db.run(sql`CREATE INDEX \`cards_image_idx\` ON \`cards\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`cards_updated_at_idx\` ON \`cards\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`cards_created_at_idx\` ON \`cards\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`cards_filename_idx\` ON \`cards\` (\`filename\`);`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_cards\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`card_type\` text,
  	\`material_value\` numeric,
  	\`cost\` numeric,
  	\`attack\` numeric,
  	\`health\` numeric,
  	\`effects\` text,
  	\`tactic_type\` text,
  	\`set_id\` integer,
  	\`image\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`set_id\`) REFERENCES \`sets\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_cards\`("id", "name", "card_type", "material_value", "cost", "attack", "health", "effects", "tactic_type", "set_id", "image", "updated_at", "created_at") SELECT "id", "name", "card_type", "material_value", "cost", "attack", "health", "effects", "tactic_type", "set_id", "image", "updated_at", "created_at" FROM \`cards\`;`)
  await db.run(sql`DROP TABLE \`cards\`;`)
  await db.run(sql`ALTER TABLE \`__new_cards\` RENAME TO \`cards\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`cards_set_idx\` ON \`cards\` (\`set_id\`);`)
  await db.run(sql`CREATE INDEX \`cards_updated_at_idx\` ON \`cards\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`cards_created_at_idx\` ON \`cards\` (\`created_at\`);`)
}
