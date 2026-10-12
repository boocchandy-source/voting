CREATE TABLE "announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"body" text NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"is_latest" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" serial PRIMARY KEY NOT NULL,
	"position_id" integer NOT NULL,
	"name" varchar(128) NOT NULL,
	"course" varchar(64) NOT NULL,
	"tagline" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "election_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"voting_start" timestamp NOT NULL,
	"voting_end" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "election_winners" (
	"id" serial PRIMARY KEY NOT NULL,
	"position_id" integer NOT NULL,
	"candidate_id" integer NOT NULL,
	CONSTRAINT "election_winners_position_id_unique" UNIQUE("position_id")
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "positions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" varchar(32) NOT NULL,
	"lastname" varchar(100) NOT NULL,
	"firstname" varchar(100) NOT NULL,
	"password_hash" text NOT NULL,
	"has_voted" boolean DEFAULT false NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"status" varchar(16) DEFAULT 'approved' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "students_student_id_unique" UNIQUE("student_id")
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"position_id" integer NOT NULL,
	"candidate_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_position_id_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "election_winners" ADD CONSTRAINT "election_winners_position_id_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "election_winners" ADD CONSTRAINT "election_winners_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_position_id_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "votes_student_position_unique" ON "votes" USING btree ("student_id","position_id");