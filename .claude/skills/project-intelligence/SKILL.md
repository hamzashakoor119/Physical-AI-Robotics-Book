# Project Intelligence - Instant Status & Summary Skill

## Auto-Generated
- **Trigger**: Requested for instant project status without latency
- **Created**: 2025-12-29
- **Reuse Count**: 0

## Purpose
Provide instantaneous project summaries and status reports with minimal token consumption and zero "thinking" delays.

## Trigger Conditions
- User types `/status` or `/summary`
- User asks "What's the project status?"
- User asks "Give me a summary"
- User asks "Where are we?"

## Design Principles

### Token Optimization Strategy
1. **Metadata-First**: Scan folder structures and file headers, not full content
2. **Checklist Parsing**: Extract only `[x]` and `[ ]` patterns from checklists
3. **Fixed Template**: Use standardized output format to avoid generation overhead
4. **No Code Reading**: Never read source code files for status
5. **Cache-Friendly**: Same inputs always produce same structure

## Inputs Required
None - automatically scans the following locations:
- `specs/spec.md` - Feature specification (header only)
- `specs/checklists/requirements.md` - Progress tracking
- `specs/tasks.md` - Task breakdown
- `history/prompts/` - PHR files (count + last 3)
- `history/adr/` - ADR files (count + last 3)
- `README.md` - Phase identity
- `CLAUDE.md` - Tech stack

## Execution Steps

### Step 1: Phase Identity Extraction (5 seconds max)
```
SCAN: README.md first 20 lines
EXTRACT: Phase name, description
SCAN: CLAUDE.md "Technology Stack" section
EXTRACT: Language, framework, storage type
```

### Step 2: Progress Calculation (10 seconds max)
```
READ: specs/checklists/requirements.md
COUNT: Lines matching "[x]" = completed
COUNT: Lines matching "[ ]" = pending
CALCULATE: % = completed / (completed + pending) * 100
```

### Step 3: Milestone Summary (5 seconds max)
```
LIST: history/prompts/*.prompt.md (last 3 by name)
LIST: history/adr/*.md (last 3 by name)
EXTRACT: Filename slugs only (no content read)
```

### Step 4: Next Tasks Extraction (5 seconds max)
```
READ: specs/tasks.md
FIND: First section with "[ ]" items
EXTRACT: Up to 3 pending items
```

### Step 5: Risk Detection (5 seconds max)
```
CHECK: specs/spec.md exists?
CHECK: specs/plan.md exists?
CHECK: specs/tasks.md exists?
CHECK: history/prompts/ has files?
FLAG: Any missing = risk
```

## Output Format (Fixed Template)

```markdown
## Project Status Report

### Phase Identity
**Phase**: [Phase Name]
**Tech Stack**: [Language] | [Framework] | [Storage]
**Branch**: [Current Git Branch]

### Current Progress
**Completion**: [XX]% ([completed]/[total] requirements)
**Status**: [On Track | At Risk | Blocked]

### Completed Milestones (Last 3)
1. [PHR/ADR slug 1]
2. [PHR/ADR slug 2]
3. [PHR/ADR slug 3]

### Next Immediate Tasks
- [ ] [Task 1 from tasks.md]
- [ ] [Task 2 from tasks.md]
- [ ] [Task 3 from tasks.md]

### Blocked/Risks
[List missing files or "None detected"]

---
*Generated: [timestamp] | Tokens: ~minimal*
```

## Error Handling

| Error | Response |
|-------|----------|
| specs/spec.md missing | Report "Specification not found - run /sp.specify" |
| specs/tasks.md missing | Report "Tasks not generated - run /sp.tasks" |
| history/prompts/ empty | Report "No PHRs recorded yet" |
| No checklist found | Report "No requirements checklist - run /sp.checklist" |

## Quick Execution Script

For Claude to execute this skill:

```
1. DO NOT read source code files (*.py, *.ts, etc.)
2. DO NOT analyze implementation details
3. ONLY scan metadata files: md, toml, json headers
4. USE glob patterns for file counting
5. EXTRACT first 5 lines for identification
6. PARSE checklists with regex: /\[(x| )\]/g
7. OUTPUT using fixed template above
8. TOTAL TIME: Under 30 seconds
```

## Examples

### Example 1: Healthy Project
```markdown
## Project Status Report

### Phase Identity
**Phase**: Phase 1 - Console Todo App
**Tech Stack**: Python 3.13 | UV | In-Memory
**Branch**: 001-console-todo

### Current Progress
**Completion**: 100% (14/14 requirements)
**Status**: On Track

### Completed Milestones (Last 3)
1. 003-generate-task-breakdown.tasks
2. 002-complete-implementation-plan.plan
3. 001-create-phase1-spec.spec

### Next Immediate Tasks
- [ ] All tasks completed!

### Blocked/Risks
None detected

---
*Generated: 2025-12-29 | Tokens: ~minimal*
```

### Example 2: Early Project
```markdown
## Project Status Report

### Phase Identity
**Phase**: Phase 2 - Full Stack Web App
**Tech Stack**: Python/TypeScript | FastAPI/Next.js | PostgreSQL
**Branch**: 002-fullstack-web-app

### Current Progress
**Completion**: 25% (3/12 requirements)
**Status**: On Track

### Completed Milestones (Last 3)
1. 001-create-phase2-spec.spec

### Next Immediate Tasks
- [ ] Create data model design
- [ ] Design API endpoints
- [ ] Set up database schema

### Blocked/Risks
- specs/tasks.md missing - run /sp.tasks

---
*Generated: 2025-12-29 | Tokens: ~minimal*
```

## Integration

### Slash Command: /status
Located at: `.claude/commands/status.md`

### Alternative Trigger: /summary
Same output, different trigger phrase.

## Performance Targets

| Metric | Target |
|--------|--------|
| Execution Time | < 30 seconds |
| Token Usage | < 500 tokens output |
| Files Read | < 10 files |
| Lines Scanned | < 200 lines total |
| Accuracy | 100% fact-based |

---

## Version
- **Version**: 1.0.0
- **Created**: 2025-12-29
- **Category**: Project Intelligence
- **Reuse Potential**: High (works across all phases)
