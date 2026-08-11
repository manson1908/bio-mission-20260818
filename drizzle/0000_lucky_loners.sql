CREATE TABLE `groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`combo` integer DEFAULT 0 NOT NULL,
	`completed_modules` text DEFAULT '[]' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_groups_code` ON `groups` (`code`);--> statement-breakpoint
CREATE INDEX `idx_groups_score` ON `groups` (`score`);--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_id` integer NOT NULL,
	`mission_id` text NOT NULL,
	`mission_title` text NOT NULL,
	`content` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`teacher_score` integer DEFAULT 0 NOT NULL,
	`feedback` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`graded_at` integer,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_submissions_status_created` ON `submissions` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_submissions_group_id` ON `submissions` (`group_id`);
--> statement-breakpoint
PRAGMA optimize;
