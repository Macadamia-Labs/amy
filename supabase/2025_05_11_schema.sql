

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE SCHEMA IF NOT EXISTS "vecs";


ALTER SCHEMA "vecs" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";






CREATE TYPE "public"."report_status" AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);


ALTER TYPE "public"."report_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.user_profiles (user_id)
  values (new.id);
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."embeddings" (
    "content" "text",
    "fts" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", "content")) STORED,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "embedding" "extensions"."vector"(1536),
    "resource_id" "uuid",
    "page_number" integer,
    "is_section" boolean,
    "user_id" "uuid"
);


ALTER TABLE "public"."embeddings" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."hybrid_search"("query_text" "text", "query_embedding" "extensions"."vector", "match_count" integer, "user_id" "uuid", "full_text_weight" double precision DEFAULT 1, "semantic_weight" double precision DEFAULT 1, "rrf_k" integer DEFAULT 50) RETURNS SETOF "public"."embeddings"
    LANGUAGE "sql"
    AS $$with full_text as (
  select
    id,
    row_number() over(order by ts_rank_cd(fts, websearch_to_tsquery(query_text)) desc) as rank_ix
  from
    embeddings
  where
    fts @@ websearch_to_tsquery(query_text)
    and user_id = user_id  -- Filter by user_id
  order by rank_ix
  limit least(match_count, 30) * 2
),
semantic as (
  select
    id,
    row_number() over (order by embedding <#> query_embedding) as rank_ix
  from
    embeddings
  where
    user_id = user_id  -- Filter by user_id
  order by rank_ix
  limit least(match_count, 30) * 2
)
select
  embeddings.*
from
  full_text
  full outer join semantic
    on full_text.id = semantic.id
  join embeddings
    on coalesce(full_text.id, semantic.id) = embeddings.id
order by
  coalesce(1.0 / (rrf_k + full_text.rank_ix), 0.0) * full_text_weight +
  coalesce(1.0 / (rrf_k + semantic.rank_ix), 0.0) * semantic_weight
  desc
limit
  least(match_count, 30);$$;


ALTER FUNCTION "public"."hybrid_search"("query_text" "text", "query_embedding" "extensions"."vector", "match_count" integer, "user_id" "uuid", "full_text_weight" double precision, "semantic_weight" double precision, "rrf_k" integer) OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mcmaster_embeddings" (
    "content" "text",
    "fts" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", "content")) STORED,
    "embedding" "extensions"."vector"(1536),
    "id" "uuid" NOT NULL,
    "metadata" "text"
);


ALTER TABLE "public"."mcmaster_embeddings" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."hybrid_search_mcmaster"("query_text" "text", "query_embedding" "extensions"."vector", "match_count" integer, "full_text_weight" double precision DEFAULT 1, "semantic_weight" double precision DEFAULT 1, "rrf_k" integer DEFAULT 50) RETURNS SETOF "public"."mcmaster_embeddings"
    LANGUAGE "sql"
    AS $$
with full_text as (
  select
    id,
    -- Note: ts_rank_cd is not indexable but will only rank matches of the where clause
    -- which shouldn't be too big
    row_number() over(order by ts_rank_cd(fts, websearch_to_tsquery(query_text)) desc) as rank_ix
  from
    mcmaster_embeddings
  where
    fts @@ websearch_to_tsquery(query_text)
  order by rank_ix
  limit least(match_count, 30) * 2
),
semantic as (
  select
    id,
    row_number() over (order by embedding <#> query_embedding) as rank_ix
  from
    mcmaster_embeddings
  order by rank_ix
  limit least(match_count, 30) * 2
)
select
  mcmaster_embeddings.*
from
  full_text
  full outer join semantic
    on full_text.id = semantic.id
  join mcmaster_embeddings
    on coalesce(full_text.id, semantic.id) = mcmaster_embeddings.id
order by
  coalesce(1.0 / (rrf_k + full_text.rank_ix), 0.0) * full_text_weight +
  coalesce(1.0 / (rrf_k + semantic.rank_ix), 0.0) * semantic_weight
  desc
limit
  least(match_count, 30)
$$;


ALTER FUNCTION "public"."hybrid_search_mcmaster"("query_text" "text", "query_embedding" "extensions"."vector", "match_count" integer, "full_text_weight" double precision, "semantic_weight" double precision, "rrf_k" integer) OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."documents_yt" (
    "content" "text",
    "fts" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", "content")) STORED,
    "embedding" "extensions"."vector"(1536),
    "metadata" "jsonb",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text",
    "source" "text"
);


ALTER TABLE "public"."documents_yt" OWNER TO "postgres";


COMMENT ON COLUMN "public"."documents_yt"."type" IS 'Either video, documentation, webpage';



CREATE OR REPLACE FUNCTION "public"."hybrid_search_old"("query_text" "text", "query_embedding" "extensions"."vector", "match_count" integer, "full_text_weight" double precision DEFAULT 1, "semantic_weight" double precision DEFAULT 1, "rrf_k" integer DEFAULT 50) RETURNS SETOF "public"."documents_yt"
    LANGUAGE "sql"
    AS $$with full_text as (
  select
    id,
    -- Note: ts_rank_cd is not indexable but will only rank matches of the where clause
    -- which shouldn't be too big
    row_number() over(order by ts_rank_cd(fts, websearch_to_tsquery(query_text)) desc) as rank_ix
  from
    documents_yt
  where
    fts @@ websearch_to_tsquery(query_text)
  order by rank_ix
  limit least(match_count, 30) * 2
),
semantic as (
  select
    id,
    row_number() over (order by embedding <#> query_embedding) as rank_ix
  from
    documents_yt
  order by rank_ix
  limit least(match_count, 30) * 2
)
select
  documents_yt.*
from
  full_text
  full outer join semantic
    on full_text.id = semantic.id
  join documents_yt
    on coalesce(full_text.id, semantic.id) = documents_yt.id
order by
  coalesce(1.0 / (rrf_k + full_text.rank_ix), 0.0) * full_text_weight +
  coalesce(1.0 / (rrf_k + semantic.rank_ix), 0.0) * semantic_weight
  desc
limit
  least(match_count, 30)$$;


ALTER FUNCTION "public"."hybrid_search_old"("query_text" "text", "query_embedding" "extensions"."vector", "match_count" integer, "full_text_weight" double precision, "semantic_weight" double precision, "rrf_k" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."hybrid_search_with_context"("query_text" "text", "query_embedding" "extensions"."vector", "match_count" integer, "full_text_weight" double precision DEFAULT 0.5, "semantic_weight" double precision DEFAULT 0.5, "rrf_k" integer DEFAULT 60) RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "similarity_score" double precision, "resource_id" "uuid", "page_number" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  WITH matches AS (
    WITH full_text AS (
      SELECT
        embeddings.id,
        row_number() OVER(ORDER BY ts_rank_cd(embeddings.fts, websearch_to_tsquery('english', query_text)) DESC) as rank_ix
      FROM
        embeddings
      WHERE
        embeddings.fts @@ websearch_to_tsquery('english', query_text)
        AND NOT (embeddings.metadata ? 'section_index')
      ORDER BY rank_ix
      LIMIT least(match_count, 30) * 2
    ),
    semantic AS (
      SELECT
        embeddings.id,
        row_number() OVER (ORDER BY embeddings.embedding <#> query_embedding) as rank_ix
      FROM
        embeddings
      WHERE
        NOT (embeddings.metadata ? 'section_index')
      ORDER BY rank_ix
      LIMIT least(match_count, 30) * 2
    )
    SELECT
      e.id,
      e.content,
      e.metadata,
      e.resource_id,
      e.page_number,
      (
        COALESCE(1.0 / (rrf_k + full_text.rank_ix), 0.0) * full_text_weight +
        COALESCE(1.0 / (rrf_k + semantic.rank_ix), 0.0) * semantic_weight
      ) as similarity_score
    FROM
      full_text
      FULL OUTER JOIN semantic ON semantic.id = full_text.id
      JOIN embeddings e ON e.id = COALESCE(full_text.id, semantic.id)
    WHERE
      e.resource_id IS NOT NULL 
      AND e.page_number IS NOT NULL
      AND NOT (e.metadata ? 'section_index')
    ORDER BY
      similarity_score DESC
    LIMIT match_count
  )
  SELECT DISTINCT ON (e.id) -- This ensures we don't get duplicate pages
    e.id,
    e.content,
    e.metadata,
    GREATEST(m.similarity_score, COALESCE(m2.similarity_score, 0)) as similarity_score, -- Take highest score if page appears multiple times
    e.resource_id,
    e.page_number
  FROM matches m
  JOIN embeddings e ON (
    e.resource_id = m.resource_id AND
    e.page_number BETWEEN (m.page_number - 1) AND (m.page_number + 1)
  )
  LEFT JOIN matches m2 ON e.id = m2.id -- Join back to matches to get original score if this was a direct match
  WHERE
    NOT (e.metadata ? 'section_index')
  ORDER BY
    e.id, -- DISTINCT ON needs this
    GREATEST(m.similarity_score, COALESCE(m2.similarity_score, 0)) DESC, -- Highest score first
    ABS(e.page_number - m.page_number); -- Prefer the original matching page over context
END;
$$;


ALTER FUNCTION "public"."hybrid_search_with_context"("query_text" "text", "query_embedding" "extensions"."vector", "match_count" integer, "full_text_weight" double precision, "semantic_weight" double precision, "rrf_k" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_embeddings"("query_embedding" "extensions"."vector", "match_threshold" double precision, "match_count" integer) RETURNS SETOF "record"
    LANGUAGE "sql"
    AS $$SELECT 
    id, 
    content, 
    url, 
    metadata, 
    (1 - (embeddings.dense_embedding <=> query_embedding)) AS similarity_score
  from 
    embeddings
  where 
    embeddings.dense_embedding <=> query_embedding < 1 - match_threshold
  order by 
    embeddings.dense_embedding <=> query_embedding asc
  limit 
    least(match_count, 200);$$;


ALTER FUNCTION "public"."match_embeddings"("query_embedding" "extensions"."vector", "match_threshold" double precision, "match_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."moddatetime"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;


ALTER FUNCTION "public"."moddatetime"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Ansys FEA" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workbench_schematic" "text",
    "material_model" "text",
    "mesh" "text",
    "step" "text",
    "post_processing" "text",
    "report_generator" "text",
    "main_script" "text",
    "Output file" "text",
    "Monitor file" "text"
);


ALTER TABLE "public"."Ansys FEA" OWNER TO "postgres";


COMMENT ON TABLE "public"."Ansys FEA" IS 'This table contains the files to run FEA simulation in Ansys';



ALTER TABLE "public"."Ansys FEA" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Ansys FEA_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."chat_files" (
    "chat_id" "uuid" NOT NULL,
    "file_id" "uuid" NOT NULL
);


ALTER TABLE "public"."chat_files" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chats" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text",
    "messages" "jsonb"[] DEFAULT ARRAY[]::"jsonb"[],
    "app" "text" NOT NULL,
    "last_message_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "is_shared" boolean DEFAULT false NOT NULL,
    "share_path" "text",
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "project_id" "uuid"
);


ALTER TABLE "public"."chats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."documents" (
    "content" "text",
    "fts" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", "content")) STORED,
    "embedding" "extensions"."vector"(1536),
    "metadata" "jsonb",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text",
    "source" "text",
    "resource_id" "uuid"
);


ALTER TABLE "public"."documents" OWNER TO "postgres";


COMMENT ON TABLE "public"."documents" IS 'This is a duplicate of documents with the videos as content';



COMMENT ON COLUMN "public"."documents"."type" IS 'Either video, documentation, webpage';



CREATE TABLE IF NOT EXISTS "public"."embeddings_old" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text",
    "url" "text",
    "content" "text" NOT NULL,
    "dense_embedding" "extensions"."vector"(3072),
    "sparse_embedding" "jsonb",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."embeddings_old" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exdocuments" (
    "id" bigint NOT NULL,
    "content" "text",
    "fts" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", "content")) STORED,
    "embedding" "extensions"."vector"(512)
);


ALTER TABLE "public"."exdocuments" OWNER TO "postgres";


ALTER TABLE "public"."exdocuments" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."exdocuments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."files" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "content" "text" DEFAULT ''::"text" NOT NULL,
    "language" "text",
    "framework" "text",
    "format" "text",
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "file_path" "text",
    "app" "text",
    "content_type" "text"
);


ALTER TABLE "public"."files" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workbench_finetune_data" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user query" "text",
    "system_prompt" "text",
    "output" "text"
);


ALTER TABLE "public"."workbench_finetune_data" OWNER TO "postgres";


COMMENT ON TABLE "public"."workbench_finetune_data" IS 'Contains the examples used for codegen finetuning of workbench';



ALTER TABLE "public"."workbench_finetune_data" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."finetune_data_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."issues" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "issue" "text",
    "resolution" "text",
    "resource_id" "uuid",
    "severity" "text",
    "category" "text",
    "impact" "text",
    "implementation_steps" "jsonb",
    "estimated_impact" "text",
    "overall_assessment" "text",
    "user_id" "uuid",
    CONSTRAINT "issues-dashboard_severity_check" CHECK (("severity" = ANY (ARRAY['critical'::"text", 'warning'::"text", 'info'::"text"])))
);


ALTER TABLE "public"."issues" OWNER TO "postgres";


COMMENT ON TABLE "public"."issues" IS 'Stores technical analysis issues and their resolutions with detailed metadata';



COMMENT ON COLUMN "public"."issues"."severity" IS 'Level of severity: critical, warning, or info';



COMMENT ON COLUMN "public"."issues"."category" IS 'Category of the issue (e.g., compatibility, safety, performance)';



COMMENT ON COLUMN "public"."issues"."impact" IS 'Potential consequences of this issue';



COMMENT ON COLUMN "public"."issues"."implementation_steps" IS 'Array of steps to implement the resolution';



COMMENT ON COLUMN "public"."issues"."estimated_impact" IS 'Expected improvement after implementing the solution';



COMMENT ON COLUMN "public"."issues"."overall_assessment" IS 'Overall assessment of the issues and solutions';



CREATE TABLE IF NOT EXISTS "public"."mastra_evals" (
    "input" "text" NOT NULL,
    "output" "text" NOT NULL,
    "result" "jsonb" NOT NULL,
    "agent_name" "text" NOT NULL,
    "metric_name" "text" NOT NULL,
    "instructions" "text" NOT NULL,
    "test_info" "jsonb",
    "global_run_id" "text" NOT NULL,
    "run_id" "text" NOT NULL,
    "created_at" timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone
);


ALTER TABLE "public"."mastra_evals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mastra_messages" (
    "id" "text" NOT NULL,
    "thread_id" "text" NOT NULL,
    "content" "text" NOT NULL,
    "role" "text" NOT NULL,
    "type" "text" NOT NULL,
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."mastra_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mastra_threads" (
    "id" "text" NOT NULL,
    "resourceId" "text" NOT NULL,
    "title" "text" NOT NULL,
    "metadata" "text",
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."mastra_threads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mastra_traces" (
    "id" "text" NOT NULL,
    "parentSpanId" "text",
    "name" "text" NOT NULL,
    "traceId" "text" NOT NULL,
    "scope" "text" NOT NULL,
    "kind" integer NOT NULL,
    "attributes" "jsonb",
    "status" "jsonb",
    "events" "jsonb",
    "links" "jsonb",
    "other" "text",
    "startTime" bigint NOT NULL,
    "endTime" bigint NOT NULL,
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."mastra_traces" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mastra_workflow_snapshot" (
    "workflow_name" "text" NOT NULL,
    "run_id" "text" NOT NULL,
    "snapshot" "text" NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."mastra_workflow_snapshot" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mistral-ocr" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "content" "jsonb" NOT NULL,
    "resource_id" "uuid",
    "user_id" "uuid",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" smallint
);


ALTER TABLE "public"."mistral-ocr" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pdf_pages" (
    "id" "uuid" NOT NULL,
    "resource_id" "uuid",
    "page_number" integer NOT NULL,
    "file_path" "text" NOT NULL,
    "public_url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."pdf_pages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "description" "text",
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "color" "text" DEFAULT 'blue'::"text" NOT NULL
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "status" "public"."report_status" DEFAULT 'pending'::"public"."report_status" NOT NULL,
    "instructions" "text",
    "content" "text",
    "input_files" "jsonb" DEFAULT '[]'::"jsonb",
    "error" "text",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."resource_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "resource_id" "uuid" NOT NULL,
    "description" "text",
    "metadata" "jsonb",
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."resource_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."resources" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "category" "text" DEFAULT 'uncategorized'::"text",
    "file_path" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "processed" boolean DEFAULT false NOT NULL,
    "processing_result" "text",
    "processing_completed_at" timestamp with time zone,
    "status" "text",
    "processing_error" "text",
    "file_type" "text",
    "outline" "jsonb",
    "origin" "text",
    "parent_id" "text",
    "content" "jsonb",
    "content_as_text" "text"
);


ALTER TABLE "public"."resources" OWNER TO "postgres";


COMMENT ON COLUMN "public"."resources"."origin" IS 'The origin of the resource, e.g. upload, google_drive, confluence';



CREATE TABLE IF NOT EXISTS "public"."resources_public" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "category" "text" DEFAULT 'uncategorized'::"text",
    "file_path" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "processed" boolean DEFAULT false NOT NULL,
    "processing_result" "text",
    "processing_completed_at" timestamp with time zone,
    "status" "text",
    "processing_error" "text",
    "file_type" "text",
    "outline" "jsonb",
    "origin" "text",
    "parent_id" "text",
    "content" "jsonb",
    "content_as_text" "text"
);


ALTER TABLE "public"."resources_public" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rules" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "text" "text" NOT NULL,
    "type" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "examples" "jsonb"[],
    "enhanced_text" "text"
);


ALTER TABLE "public"."rules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."standards_figures" (
    "id" "uuid" NOT NULL,
    "figure_number" "text" NOT NULL,
    "figure_title" "text" NOT NULL,
    "page_number" integer NOT NULL,
    "source_book" "text" DEFAULT 'ASME 2015 BPVC I'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."standards_figures" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "is_approved" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "name" "text",
    "company" "text"
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workflow_executions" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "result" "text",
    "status" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workflow_id" "uuid"
);


ALTER TABLE "public"."workflow_executions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workflow_runs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workflow_id" "uuid" DEFAULT "gen_random_uuid"(),
    "resource_ids" "text"[] NOT NULL,
    "status" "text",
    "user_id" "uuid",
    "status_message" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "output_resource_id" "text"
);


ALTER TABLE "public"."workflow_runs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workflows" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "instructions" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    "description" "text",
    "status" "text",
    "last_run" timestamp with time zone
);


ALTER TABLE "public"."workflows" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workflows_resources" (
    "workflow_id" "uuid" NOT NULL,
    "resource_id" "uuid" NOT NULL
);


ALTER TABLE "public"."workflows_resources" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "vecs"."dense_embeddings" (
    "id" character varying NOT NULL,
    "vec" "extensions"."vector"(1536) NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL
);


ALTER TABLE "vecs"."dense_embeddings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "vecs"."docs" (
    "id" character varying NOT NULL,
    "vec" "extensions"."vector"(3) NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL
);


ALTER TABLE "vecs"."docs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "vecs"."sparse_embeddings" (
    "id" character varying NOT NULL,
    "vec" "extensions"."vector"(1000) NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL
);


ALTER TABLE "vecs"."sparse_embeddings" OWNER TO "postgres";


ALTER TABLE ONLY "public"."Ansys FEA"
    ADD CONSTRAINT "Ansys FEA_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."issues"
    ADD CONSTRAINT "Issues-dashboard_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_files"
    ADD CONSTRAINT "chat_files_chat_id_file_id_key" UNIQUE ("chat_id", "file_id");



ALTER TABLE ONLY "public"."chat_files"
    ADD CONSTRAINT "chat_files_pkey" PRIMARY KEY ("chat_id", "file_id");



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "designs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documents_yt"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_yt_videos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."embeddings_old"
    ADD CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."embeddings"
    ADD CONSTRAINT "embeddingscooper_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exdocuments"
    ADD CONSTRAINT "exdocuments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workbench_finetune_data"
    ADD CONSTRAINT "finetune_data_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mastra_messages"
    ADD CONSTRAINT "mastra_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mastra_threads"
    ADD CONSTRAINT "mastra_threads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mastra_traces"
    ADD CONSTRAINT "mastra_traces_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mastra_workflow_snapshot"
    ADD CONSTRAINT "mastra_workflow_snapshot_workflow_name_run_id_key" UNIQUE ("workflow_name", "run_id");



ALTER TABLE ONLY "public"."mcmaster_embeddings"
    ADD CONSTRAINT "mcmaster_embeddings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mistral-ocr"
    ADD CONSTRAINT "mistral-ocr_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pdf_pages"
    ADD CONSTRAINT "pdf_pages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."resource_images"
    ADD CONSTRAINT "resource_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."resources"
    ADD CONSTRAINT "resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."resources_public"
    ADD CONSTRAINT "resources_public_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rules"
    ADD CONSTRAINT "rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."standards_figures"
    ADD CONSTRAINT "standards_figures_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."workflow_executions"
    ADD CONSTRAINT "workflow_executions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workflow_runs"
    ADD CONSTRAINT "workflow_runs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workflows"
    ADD CONSTRAINT "workflows_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workflows_resources"
    ADD CONSTRAINT "workflows_resources_pkey" PRIMARY KEY ("workflow_id", "resource_id");



ALTER TABLE ONLY "vecs"."dense_embeddings"
    ADD CONSTRAINT "dense_embeddings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "vecs"."docs"
    ADD CONSTRAINT "docs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "vecs"."sparse_embeddings"
    ADD CONSTRAINT "sparse_embeddings_pkey" PRIMARY KEY ("id");



CREATE INDEX "chat_files_chat_id_idx" ON "public"."chat_files" USING "btree" ("chat_id");



CREATE INDEX "chat_files_file_id_idx" ON "public"."chat_files" USING "btree" ("file_id");



CREATE INDEX "chats_last_message_at_idx" ON "public"."chats" USING "btree" ("last_message_at" DESC);



CREATE INDEX "chats_user_id_idx" ON "public"."chats" USING "btree" ("user_id");



CREATE INDEX "documents_embedding_idx" ON "public"."documents_yt" USING "hnsw" ("embedding" "extensions"."vector_ip_ops");



CREATE INDEX "documents_fts_idx" ON "public"."documents_yt" USING "gin" ("fts");



CREATE INDEX "documents_yt_videos_embedding_idx" ON "public"."documents" USING "hnsw" ("embedding" "extensions"."vector_ip_ops");



CREATE INDEX "documents_yt_videos_fts_idx" ON "public"."documents" USING "gin" ("fts");



CREATE INDEX "embeddingscooper_fts_idx" ON "public"."embeddings" USING "gin" ("fts");



CREATE INDEX "idx_issues_category" ON "public"."issues" USING "btree" ("category");



CREATE INDEX "idx_issues_severity" ON "public"."issues" USING "btree" ("severity");



CREATE INDEX "idx_resource_id" ON "public"."workflows_resources" USING "btree" ("resource_id");



CREATE INDEX "idx_workflow_id" ON "public"."workflows_resources" USING "btree" ("workflow_id");



CREATE INDEX "mcmaster_embeddings_embedding_idx" ON "public"."mcmaster_embeddings" USING "hnsw" ("embedding" "extensions"."vector_ip_ops");



CREATE INDEX "mcmaster_embeddings_fts_idx" ON "public"."mcmaster_embeddings" USING "gin" ("fts");



CREATE INDEX "pdf_pages_page_number_idx" ON "public"."pdf_pages" USING "btree" ("page_number");



CREATE INDEX "pdf_pages_resource_id_idx" ON "public"."pdf_pages" USING "btree" ("resource_id");



CREATE INDEX "reports_user_id_idx" ON "public"."reports" USING "btree" ("user_id");



CREATE INDEX "resources_user_id_idx" ON "public"."resources" USING "btree" ("user_id");



CREATE INDEX "ix_vector_cosine_ops_hnsw_m16_efc64_6b30f39" ON "vecs"."sparse_embeddings" USING "hnsw" ("vec" "extensions"."vector_cosine_ops") WITH ("m"='16', "ef_construction"='64');



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."chat_files" FOR EACH ROW EXECUTE FUNCTION "public"."moddatetime"('updated_at');



CREATE OR REPLACE TRIGGER "update_reports_updated_at" BEFORE UPDATE ON "public"."reports" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."chat_files"
    ADD CONSTRAINT "chat_files_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_files"
    ADD CONSTRAINT "chat_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."embeddings"
    ADD CONSTRAINT "embeddings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."embeddings"
    ADD CONSTRAINT "embeddingscooper_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workflows_resources"
    ADD CONSTRAINT "fk_resource" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workflows_resources"
    ADD CONSTRAINT "fk_workflow" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."issues"
    ADD CONSTRAINT "issues_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mistral-ocr"
    ADD CONSTRAINT "mistral-ocr_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mistral-ocr"
    ADD CONSTRAINT "mistral-ocr_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pdf_pages"
    ADD CONSTRAINT "pdf_pages_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."resource_images"
    ADD CONSTRAINT "resource_images_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."resource_images"
    ADD CONSTRAINT "resource_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."resources"
    ADD CONSTRAINT "resources_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rules"
    ADD CONSTRAINT "rules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workflow_executions"
    ADD CONSTRAINT "workflow_executions_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workflow_runs"
    ADD CONSTRAINT "workflow_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workflow_runs"
    ADD CONSTRAINT "workflow_runs_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workflows"
    ADD CONSTRAINT "workflows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE "public"."Ansys FEA" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Enable ALL for users based on user_id" ON "public"."rules" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable all for users based on user_id" ON "public"."files" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable all for users based on user_id" ON "public"."projects" USING (true) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable all for users based on user_id" ON "public"."user_profiles" USING (true) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable all for users based on user_id" ON "public"."workflow_runs" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable all for users based on user_id" ON "public"."workflows" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."resources" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."resources" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable read access for all users" ON "public"."mcmaster_embeddings" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."resources" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable read access for all users" ON "public"."resources_public" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."workflow_executions" FOR SELECT USING (true);



CREATE POLICY "Enable update for users based on email" ON "public"."resources" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable users to view their own data only" ON "public"."workflow_runs" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Service role can manage all profiles" ON "public"."user_profiles" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role can update any resource" ON "public"."resources" FOR SELECT TO "service_role" USING (true);



CREATE POLICY "Users can create their own chats" ON "public"."chats" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own chats" ON "public"."chats" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own chat files" ON "public"."chat_files" USING (("auth"."uid"() IN ( SELECT "chats"."user_id"
   FROM "public"."chats"
  WHERE ("chats"."id" = "chat_files"."chat_id"))));



CREATE POLICY "Users can update their own chats" ON "public"."chats" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own chats" ON "public"."chats" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."user_profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."chat_files" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."documents_yt" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."embeddings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."embeddings_old" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exdocuments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."files" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."issues" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mastra_evals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mastra_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mastra_threads" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mastra_traces" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mastra_workflow_snapshot" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mcmaster_embeddings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mistral-ocr" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pdf_pages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."resource_images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."resources" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."resources_public" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."standards_figures" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workbench_finetune_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workflow_executions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workflow_runs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workflows" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workflows_resources" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."resources";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."workflow_runs";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






























































































































































































































































































































































































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON TABLE "public"."embeddings" TO "anon";
GRANT ALL ON TABLE "public"."embeddings" TO "authenticated";
GRANT ALL ON TABLE "public"."embeddings" TO "service_role";






GRANT ALL ON TABLE "public"."mcmaster_embeddings" TO "anon";
GRANT ALL ON TABLE "public"."mcmaster_embeddings" TO "authenticated";
GRANT ALL ON TABLE "public"."mcmaster_embeddings" TO "service_role";






GRANT ALL ON TABLE "public"."documents_yt" TO "anon";
GRANT ALL ON TABLE "public"."documents_yt" TO "authenticated";
GRANT ALL ON TABLE "public"."documents_yt" TO "service_role";












GRANT ALL ON FUNCTION "public"."moddatetime"() TO "anon";
GRANT ALL ON FUNCTION "public"."moddatetime"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."moddatetime"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";






























GRANT ALL ON TABLE "public"."Ansys FEA" TO "anon";
GRANT ALL ON TABLE "public"."Ansys FEA" TO "authenticated";
GRANT ALL ON TABLE "public"."Ansys FEA" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Ansys FEA_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Ansys FEA_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Ansys FEA_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."chat_files" TO "anon";
GRANT ALL ON TABLE "public"."chat_files" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_files" TO "service_role";



GRANT ALL ON TABLE "public"."chats" TO "anon";
GRANT ALL ON TABLE "public"."chats" TO "authenticated";
GRANT ALL ON TABLE "public"."chats" TO "service_role";



GRANT ALL ON TABLE "public"."documents" TO "anon";
GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";



GRANT ALL ON TABLE "public"."embeddings_old" TO "anon";
GRANT ALL ON TABLE "public"."embeddings_old" TO "authenticated";
GRANT ALL ON TABLE "public"."embeddings_old" TO "service_role";



GRANT ALL ON TABLE "public"."exdocuments" TO "anon";
GRANT ALL ON TABLE "public"."exdocuments" TO "authenticated";
GRANT ALL ON TABLE "public"."exdocuments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."exdocuments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exdocuments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exdocuments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."files" TO "anon";
GRANT ALL ON TABLE "public"."files" TO "authenticated";
GRANT ALL ON TABLE "public"."files" TO "service_role";



GRANT ALL ON TABLE "public"."workbench_finetune_data" TO "anon";
GRANT ALL ON TABLE "public"."workbench_finetune_data" TO "authenticated";
GRANT ALL ON TABLE "public"."workbench_finetune_data" TO "service_role";



GRANT ALL ON SEQUENCE "public"."finetune_data_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."finetune_data_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."finetune_data_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."issues" TO "anon";
GRANT ALL ON TABLE "public"."issues" TO "authenticated";
GRANT ALL ON TABLE "public"."issues" TO "service_role";



GRANT ALL ON TABLE "public"."mastra_evals" TO "anon";
GRANT ALL ON TABLE "public"."mastra_evals" TO "authenticated";
GRANT ALL ON TABLE "public"."mastra_evals" TO "service_role";



GRANT ALL ON TABLE "public"."mastra_messages" TO "anon";
GRANT ALL ON TABLE "public"."mastra_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."mastra_messages" TO "service_role";



GRANT ALL ON TABLE "public"."mastra_threads" TO "anon";
GRANT ALL ON TABLE "public"."mastra_threads" TO "authenticated";
GRANT ALL ON TABLE "public"."mastra_threads" TO "service_role";



GRANT ALL ON TABLE "public"."mastra_traces" TO "anon";
GRANT ALL ON TABLE "public"."mastra_traces" TO "authenticated";
GRANT ALL ON TABLE "public"."mastra_traces" TO "service_role";



GRANT ALL ON TABLE "public"."mastra_workflow_snapshot" TO "anon";
GRANT ALL ON TABLE "public"."mastra_workflow_snapshot" TO "authenticated";
GRANT ALL ON TABLE "public"."mastra_workflow_snapshot" TO "service_role";



GRANT ALL ON TABLE "public"."mistral-ocr" TO "anon";
GRANT ALL ON TABLE "public"."mistral-ocr" TO "authenticated";
GRANT ALL ON TABLE "public"."mistral-ocr" TO "service_role";



GRANT ALL ON TABLE "public"."pdf_pages" TO "anon";
GRANT ALL ON TABLE "public"."pdf_pages" TO "authenticated";
GRANT ALL ON TABLE "public"."pdf_pages" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";



GRANT ALL ON TABLE "public"."resource_images" TO "anon";
GRANT ALL ON TABLE "public"."resource_images" TO "authenticated";
GRANT ALL ON TABLE "public"."resource_images" TO "service_role";



GRANT ALL ON TABLE "public"."resources" TO "anon";
GRANT ALL ON TABLE "public"."resources" TO "authenticated";
GRANT ALL ON TABLE "public"."resources" TO "service_role";



GRANT ALL ON TABLE "public"."resources_public" TO "anon";
GRANT ALL ON TABLE "public"."resources_public" TO "authenticated";
GRANT ALL ON TABLE "public"."resources_public" TO "service_role";



GRANT ALL ON TABLE "public"."rules" TO "anon";
GRANT ALL ON TABLE "public"."rules" TO "authenticated";
GRANT ALL ON TABLE "public"."rules" TO "service_role";



GRANT ALL ON TABLE "public"."standards_figures" TO "anon";
GRANT ALL ON TABLE "public"."standards_figures" TO "authenticated";
GRANT ALL ON TABLE "public"."standards_figures" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."workflow_executions" TO "anon";
GRANT ALL ON TABLE "public"."workflow_executions" TO "authenticated";
GRANT ALL ON TABLE "public"."workflow_executions" TO "service_role";



GRANT ALL ON TABLE "public"."workflow_runs" TO "anon";
GRANT ALL ON TABLE "public"."workflow_runs" TO "authenticated";
GRANT ALL ON TABLE "public"."workflow_runs" TO "service_role";



GRANT ALL ON TABLE "public"."workflows" TO "anon";
GRANT ALL ON TABLE "public"."workflows" TO "authenticated";
GRANT ALL ON TABLE "public"."workflows" TO "service_role";



GRANT ALL ON TABLE "public"."workflows_resources" TO "anon";
GRANT ALL ON TABLE "public"."workflows_resources" TO "authenticated";
GRANT ALL ON TABLE "public"."workflows_resources" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
