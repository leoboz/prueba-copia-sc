# README_GUIDELINES.md

## Introduction

This document standardizes how Lovable writes and updates a README.md for any software project. The goal is to ensure the README.md is a clear, consistent, and developer-friendly reference that allows developers to instantly understand the project’s purpose, structure, and functionality, enabling coding or debugging without guesswork. These guidelines are generic, reusable across all project types (web, mobile, backend, etc.), and emphasize customer journeys—mapping each user role’s steps to system actions and database changes—to keep the code tied to user outcomes. The README.md must be copy-paste-ready for sharing the project’s current state and follow these rules for all updates.

## Best Practices for README.md Structure

Lovable must structure the README.md with the following sections, in this order, to ensure clarity and traceability:

- **Overview**: Summarize the project’s purpose, key features, and user roles (e.g., Admin, User, Guest).
- **Tech Stack**: List frontend, backend, database, and other tools (e.g., React, Node.js, PostgreSQL, third-party APIs).
- **Project Directory Structure**: List all directories and files with their paths and purposes in a tree-like format.
- **Database Schema**: Detail **all tables** with columns, data types, constraints (e.g., primary/foreign keys), and purpose. For Supabase-based projects, query the database to fetch all tables and Row Level Security (RLS) policies to ensure accuracy.
- **Functions & Hooks**: Document key functions, React hooks (if applicable), and API endpoints with purpose, parameters, return values, and usage examples.
- **Customer Journeys**: For each user role, map their journey (steps) to system actions and database changes in a table format.
- **System/Database Actions**: Provide a detailed reference of how user actions trigger system events and update the database.
- **Version History**: Track changes with a table listing date, description, and author.

The README.md must include a note in its intro stating: “This document follows the best practices outlined in README_GUIDELINES.md and adheres to its rules for all updates.” The README.md should be self-contained, requiring no external references to understand the project’s state.

## Project Directory Structure

The “Project Directory Structure” section must list all directories and files in the project, including source code, configuration files, build artifacts, and hidden files (e.g., .gitignore). Use a code block with a tree-like format, two-space indentation, and a “path: description” style for each entry. The section should:

- Include full paths relative to the project root (e.g., `/src/main.py`).
- Describe the purpose of each file or directory (e.g., “/src - Contains application source code”).
- Cover all files, including hidden files (e.g., `.env`), build outputs (e.g., `/dist`), and temporary directories (e.g., `/node_modules`).
- Be verified against the actual project files during updates (e.g., using `tree -a -I '.git'` on Unix or `dir /s /a` on Windows).
- Include a note with commands to generate the tree for maintainers (e.g., `tree -a -I '.git'` for Unix, `dir /s /a` for Windows).

**Example:**
/.git: Version control repository
/.gitignore: Specifies files to ignore in version control
/.env: Environment variables for configuration
/src: Contains application source code
/src/main.py: Application entry point
/src/utils: Utility functions and helpers
/src/utils/helpers.py: General helper functions
/tests: Unit and integration tests
/tests/test_main.py: Tests for main application logic
/config: Configuration files for different environments
/config/dev.yml: Development environment settings
/dist: Build output and compiled artifacts
/dist/app.js: Compiled application bundle
/README.md: Project documentation
/package.json: Node.js project dependencies and scripts

**Note**: Maintainers can generate the directory tree using `tree -a -I '.git'` (Unix) or `dir /s /a` (Windows) and manually add descriptions for each file/directory.

## Customer Journey Documentation

Customer journeys are the heart of the README.md, as all code and database changes exist to support user outcomes. For each user role, Lovable must document:

- **Steps**: What the user does (e.g., logs in, submits a form, views data).
- **System Actions**: Corresponding system events (e.g., API call like `POST /api/login`, hook like `useUserData`).
- **Database Changes**: Tables affected and records created/updated/deleted (e.g., new record in `Users` table).

Use a table format for clarity:

| User Role | Step | System Action | Database Change |
|-----------|------|---------------|-----------------|
| Admin     | Creates new user | `POST /api/users`, `useCreateUser` | Inserts record in `Users` table |
| User      | Views profile | `GET /api/users/:id`, `useUserData` | Reads from `Users` table |

Journeys must cover all major user interactions and outcomes, ensuring every feature is traceable to user needs.

## Database Schema

The “Database Schema” section must document **all tables** in the database, including their columns, data types, constraints, and purposes. For Supabase-based projects, Lovable must query the database to fetch the complete list of tables and Row Level Security (RLS) policies to ensure accuracy and completeness. The schema must be updated with every change to the database (e.g., new tables, columns, or RLS policies) and verified against the actual database state.

### Table Documentation
Use a table format with the following columns:
- **Table**: Name of the table.
- **Column**: Name of the column.
- **Type**: Data type (e.g., UUID, VARCHAR, INTEGER).
- **Constraints**: Constraints applied (e.g., Primary Key, Foreign Key, Not Null, Unique).
- **Purpose**: Description of the column’s role in the system.

**Example**:
| Table | Column | Type | Constraints | Purpose |
|-------|--------|------|-------------|---------|
| Users | id     | UUID | Primary Key | Unique user identifier |
| Users | email  | VARCHAR | Unique, Not Null | User’s email address |

### RLS Policies
For Supabase projects, include a separate table listing all RLS policies for each table:
- **Policy Name**: Name of the RLS policy.
- **Operation**: SQL operation (e.g., SELECT, INSERT, UPDATE, DELETE).
- **Roles**: Roles the policy applies to (e.g., authenticated, anonymous).
- **Condition**: The policy condition (e.g., `auth.uid() = id`).

**Example**:
| Policy Name | Operation | Roles | Condition |
|-------------|-----------|-------|-----------|
| Users view own profile | SELECT | authenticated | `auth.uid() = id` |

### Supabase Query Requirements
For Supabase projects, Lovable must run the following SQL queries to fetch the complete schema and RLS policies, ensuring no tables or policies are missed:

```sql
-- Fetch all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Fetch all columns for each table
SELECT table_name, column_name, data_type, is_nullable, column_default, 
       (SELECT constraint_type 
        FROM information_schema.constraint_column_usage ccu
        JOIN information_schema.table_constraints tc 
        ON tc.constraint_name = ccu.constraint_name
        WHERE ccu.table_name = c.table_name 
        AND ccu.column_name = c.column_name 
        LIMIT 1) as constraint_type
FROM information_schema.columns c
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Fetch all foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name, 
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public';

-- Fetch all RLS policies
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_catalog.pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

Update Rules
Completeness: Document every table in the database, not just a subset (e.g., no “Core Tables” limitation).
Verification: Query the database before updating the README.md to confirm the schema matches the current state.
Consistency: Update the schema section whenever tables, columns, constraints, or RLS policies are added, modified, or removed.
Supabase-Specific: For Supabase projects, verify RLS policies are enabled on relevant tables and document any tables without RLS, noting the reason (e.g., public access intended).
Purpose Clarity: Ensure each table and column’s purpose is clearly described, linking to system functionality or user outcomes where possible.

Writing Guidelines
Style
Use clear, concise, active voice (e.g., “The system creates a record” vs. “A record is created”).
Use bullet points for lists, tables for schemas/endpoints/journeys, and code blocks for examples.
Define terminology in the Overview and use it consistently (e.g., “user” vs. “client”).
Avoid jargon unless explained; assume readers know basic dev concepts.
Functions & Hooks
Document with:

Purpose: One sentence describing the function/hook’s role.
Parameters: Name, type, and description.
Return Value: Type and description.
Example: Code snippet showing usage.
Example:
createUser

Purpose: Creates a new user account.
Parameters:
email (string): User’s email address.
role (string): User role (e.g., admin, user).
Returns: User ID (UUID).
Example:
typescript

Copy
async function createUser(email: string, role: string) {
  const user = await db.Users.insert({ email, role });
  return user.id;
}
Update Rules
Preserve the existing README.md structure unless explicitly modified.
Reflect the project’s current state (e.g., new tables, endpoints, or journey steps).
For Supabase projects, always query the database to verify tables, columns, constraints, and RLS policies, ensuring no assumptions or outdated info.
Verify the Project Directory Structure against actual project files (e.g., using tree -a -I '.git' or find . -type f) during updates.
Log all changes in Version History with clear descriptions.
Validate updates against the codebase (e.g., no outdated function signatures or missing tables).
Supabase-Specific Instructions
For projects using Supabase, Lovable must:

Query the database to fetch all tables, columns, constraints, and RLS policies using the SQL queries provided in the Database Schema section.
Include all table schemas (columns, data types, constraints) and RLS policies (name, operation, roles, conditions) in the Database Schema section.
Verify RLS policies are enabled on relevant tables and document any tables without RLS, noting the reason (e.g., public access intended).
Use Supabase helper functions (e.g., auth.uid()) in RLS policy conditions where applicable.
Include Supabase configuration files (e.g., .env, supabase/config.toml) in the Project Directory Structure with their purposes.
Tone & Style
Write in a professional, approachable tone, like a senior dev explaining a project to a teammate.
Prioritize clarity and traceability; make it easy to map user actions to code and data.
Ensure the README.md is concise but comprehensive, avoiding unnecessary complexity.
Examples
Database Schema

Table	Column	Type	Constraints	Purpose
Items	id	UUID	Primary Key	Unique item identifier
Items	name	VARCHAR	Not Null	Item name
RLS Policies for Items:


Policy Name	Operation	Roles	Condition
Users view own items	SELECT	authenticated	auth.uid() = owner_id
Function
createItem

Purpose: Creates a new item.
Parameters:
name (string): Item name.
ownerId (UUID): User ID of the owner.
Returns: Item ID (UUID).
Example:
async function createItem(name: string, ownerId: string) {
  const item = await db.Items.insert({ name, ownerId });
  return item.id;
}
Customer Journey

User Role	Step	System Action	Database Change
Guest	Submits contact form	POST /api/contact	Inserts record in Contacts table
Admin	Views contact submissions	GET /api/contacts, useContactData	Reads from Contacts table
Version History

Date	Changes	Author
2025-05-23	Added Project Directory Structure section	Grok
2025-05-18	Added Users table, login endpoint	Dev Team


---

### Instructions

1. **Copy and Paste**: Copy the entire content above (from `# README_GUIDELINES.md` to the end) and paste it into your `README_GUIDELINES.md` file, overwriting the existing one.
2. **Save**: Ensure the file is named `README_GUIDELINES.md` (case-sensitive) in your project directory.
3. **Use with Lovable**: Instruct Lovable to follow this updated `README_GUIDELINES.md` when updating `Readme SC.txt`. This ensures the Database Schema section includes **all tables** (not just "Core Tables") by querying the Supabase database with the provided SQL queries.

### Why This Works

- **Fixes Schema Issue**: The guidelines now explicitly require documenting **all tables** in the Database Schema section, with SQL queries to fetch the complete schema (tables, columns, constraints, RLS policies) from Supabase, ensuring no tables are missed.
- **Clean and Simple**: It’s a single Markdown file, formatted for direct replacement, with no extra commentary or artifacts to confuse things.
- **Supabase-Ready**: The SQL queries and Supabase-specific rules ensure compatibility with your `SeedQuality` project, covering all tables and RLS policies.

### Additional Notes

- **Applying to Readme SC.txt**: To update `Readme SC.txt`, Lovable should:
  - Run the SQL queries in the guidelines to fetch all tables, columns, constraints, and RLS policies from your Supabase database.
  - Replace the "Core Tables" section with a complete schema, including any additional tables (e.g., for `reclamos`, `encuestas`) inferred from `Requerimientos Sistema de Calidad.pptx`.
  - Update the Version History with an entry like:
  | 2025-05-30 | Updated Database Schema to include all tables and RLS policies | Grok |
