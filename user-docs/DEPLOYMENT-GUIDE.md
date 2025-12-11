# Complete Deployment and Usage Guide

## What You Have

In this `_orchestrator` directory, you have a complete repository-agnostic sprint orchestration system for Claude Code. The system consists of four specialized AI agents that work together to autonomously process software development sprints without protocol drift.

## Understanding the Core Innovation

The system you have solves the specific problem you encountered where saying "continue" caused Claude to skip critical workflow steps because it relied on conversation memory instead of verifying actual file system state. The solution implemented here makes the orchestrator completely stateless - it must re-read configuration files at every iteration, which prevents it from assuming it knows what's already been done based on faulty conversation memory.

The second innovation is making the system repository-agnostic through variable substitution. Instead of hardcoding things like "there are seven epics" or "Epic 11 comes first," the orchestrator reads your sprint-status.yaml file and discovers these facts dynamically. This means the same orchestrator code works for any project with any epic structure - you just change the configuration file, not the agent code.

## Files You Have and Their Purpose

In the agents folder, you have four agent definition files. The sprint-orchestrator.md file defines the master orchestrator that coordinates the entire workflow. This agent is stateless and discovers epic structure by parsing your sprint status file at every iteration. The sprint-tech-writer.md file defines an agent that expands one-line story descriptions into detailed implementation plans. The sprint-game-dev.md file defines an agent that implements code using Test-Driven Development, always writing tests before implementation. The sprint-code-reviewer.md file defines an adversarial reviewer that deliberately looks for three to ten real issues in every code review.

In the commands folder, you have sprint.md which provides the slash commands `/sprint start`, `/sprint resume`, and `/sprint status` for controlling the orchestration workflow from within Claude Code.

## How to Deploy This System

To use this orchestration system in your Overlord project or any other project, you need to copy these files into specific locations within your project directory structure. Claude Code expects agents to be in a hidden `.claude` directory at your project root.

Start by navigating to your project directory. For your Overlord game, that would be the Overlord.Phaser directory. Inside that directory, you need to create a `.claude` folder structure if it doesn't already exist. Inside `.claude`, create three subdirectories: agents, commands, and skills.

Now copy the files from this _orchestrator directory into your project structure. Copy all four markdown files from the agents folder here into your project's `.claude/agents/` folder. Copy the sprint.md file from the commands folder here into your project's `.claude/commands/` folder.

For the skills folder, you'll need one more file that I'll help you create - the three-agent-story-cycle.md skill file that codifies the workflow pattern. I can generate that for you next.

The final critical piece is a CLAUDE.md file that goes in your project root (not inside the `.claude` folder, but at the top level next to your source code). This file establishes prime directives that override conversational instructions.

## Creating Your Sprint Status File

The orchestrator discovers your epic and story structure by reading a file at `design-docs/artifacts/sprint-artifacts/sprint-status.yaml` in your project. This file needs to follow a specific format that allows the orchestrator to parse it and understand your work structure.

The file should start with an optional epic_order field that lists your epic numbers in the sequence you want them processed. For your Overlord project, that would be `[11, 3, 2, 4, 5, 6, 7]`. If you omit this field, the orchestrator will process epics in numeric order, which would give you `[2, 3, 4, 5, 6, 7, 11]` instead.

Next comes the story status entries. Each entry is a key-value pair where the key follows the pattern `{epic-number}-{story-number}-{story-slug}` and the value is the current status. For example, your first story would be `11-1-mouse-and-keyboard-input-support: backlog`. The orchestrator parses these keys to extract the epic number (first number), story number (second number), and creates the story ID (the first two numbers combined, like "11-1") for looking up the full story description in your epics.md file.

Finally, you can include optional epic_metadata that provides names and descriptions for each epic. This makes git branch names and tags more readable. For Epic 11, you'd have name set to "input" and description set to "Input System Foundation". This way when the orchestrator creates a branch, it becomes `epic/11-input` instead of just `epic/11`.

## How the Variable Substitution Works

When the orchestrator starts each loop iteration, it reads your sprint-status.yaml file completely. It extracts all the story keys and parses them to discover what epics exist. Stories starting with "11-1" and "11-3" tell the orchestrator that Epic 11 exists and has at least two stories. Stories starting with "3-1", "3-2", and "3-3" tell it that Epic 3 exists with three stories.

The orchestrator then looks for the epic_order field to determine processing sequence. If it finds `[11, 3, 2, 4, 5, 6, 7]`, that becomes the variable {{epic_order}}. It groups all stories by epic number, creating a variable {{stories_by_epic}} that maps epic numbers to their story lists. It reads all the status values, creating {{story_statuses}} that maps each story key to its current status.

Now the orchestrator can find the next task to work on. It iterates through {{epic_order}}, and for each epic, it gets the stories from {{stories_by_epic}} and searches for the first one with status "backlog". When it finds that story, it extracts the story ID ("11-1") and the full story key ("11-1-mouse-and-keyboard-input-support") and passes these as variables to the technical writer agent.

This variable-driven approach means the orchestrator never assumes it knows your project structure. If you add an eighth epic tomorrow, the orchestrator discovers it exists by reading the file. If you reorder epics, the orchestrator follows the new sequence. If you use this system on a completely different project with three epics instead of seven, the orchestrator adapts to that structure automatically.

## Running the System

Once you've deployed the files to your project and created the sprint-status.yaml file, restart Claude Code so it loads the new agents and commands. Open your project in Claude Code and verify the agents are loaded by typing `@sprint` and seeing if the orchestrator appears in the autocomplete suggestions.
 
When you're ready to begin, type `/sprint start` in Claude Code. The orchestrator will read your sprint-status.yaml file, discover your epic structure, verify git is ready, and begin processing the first backlog story it finds. You'll see brief progress logs as work happens - messages like "[STORY 11-1] Spawning @sprint-tech-writer" followed by "[STORY 11-1] Planning complete, spawning @sprint-game-dev" and so on.

The critical behavior to understand is that the system runs autonomously. You don't interact with it during processing. The orchestrator works through all your stories across all your epics without stopping to ask permission. You'll see periodic confirmations as each epic completes, showing the merge to main and the version tag created.

If the system gets interrupted - maybe you hit usage limits, or your computer restarts, or there's an error - you simply type `/sprint resume` when you're ready to continue. The orchestrator reads the sprint-status.yaml file to see what's been completed (stories marked "done"), what's in progress (stories marked "review" or "in-progress"), and picks up exactly where it left off. It doesn't rely on remembering the conversation - it trusts the file system state.

At any point, you can check progress without disturbing the workflow by typing `/sprint status`. This reads the status file and reports how many stories are complete, which epic is current, and what story is being worked on.

## What Happens If You Say "Continue"

This is the scenario that caused your original problem. When you say "continue" or "keep going," the system now handles it differently than normal Claude behavior would. The CLAUDE.md prime directives file establishes rules that override conversational instructions. When the orchestrator sees "continue," the directives translate this to mean "re-read sprint-status.yaml, check file system state, resume from documented state."

So even if you simply say "continue" without using the `/sprint resume` command, the orchestrator won't assume it knows what to do based on conversation memory. It re-reads the configuration file, discovers what work exists, checks which stories show as done in the status file, verifies those story files actually exist in the sprint-artifacts directory, and only then determines the correct next action.

This is why the stateless design is so powerful for preventing protocol drift. The orchestrator can't shortcut the verification steps because it genuinely doesn't remember what happened in previous conversation turns - it must check the files every time.

## Understanding the Three-Agent Cycle

Every story in your sprint goes through a mandatory three-phase workflow with quality gates between phases. First comes the planning phase where the sprint-tech-writer agent reads your story from epics.md, reads your architecture constraints, creates a detailed task breakdown file, and updates the status from "backlog" to "drafted". The quality gate here verifies the story file exists and contains all required sections before allowing progression.

Second comes the implementation phase where the sprint-game-dev agent reads the story file, implements using Test-Driven Development (writing tests first, then code to pass tests, then refactoring), and updates status through "in-progress" to "review". The quality gate requires all tests passing and no build errors before allowing progression to review.

Third comes the review phase where the sprint-code-reviewer agent validates every acceptance criterion, checks architecture compliance, deliberately looks for three to ten real issues, and makes an approval decision. If issues are found, the story returns to implementation with a detailed issue list. If approved, status updates to "done". The quality gate ensures genuine quality validation rather than rubber-stamping.

This three-phase cycle with gates means you can't skip steps. If a story file doesn't exist, planning didn't happen. If tests aren't passing, implementation isn't done. If the reviewer hasn't approved, the code isn't ready. The file system state and test results are the source of truth, not conversation claims about what was supposedly completed.

## What Success Looks Like

When the system works correctly, your experience is minimal involvement during processing. You run `/sprint start`, you see initial progress logs, you wait while the agents work (the time varies based on story count - figure roughly ten to twenty minutes per story on average), you see epic completion confirmations as each finishes, and eventually you see a final report showing all epics complete with all stories done.

The work happens autonomously. You're not answering questions, not giving permissions, not making decisions during the workflow. The agents handle everything by reading your specifications in the epics.md file and following the architecture constraints in your architecture documentation.

You only intervene if the system reports a critical blocker, and even then, the system tells you exactly what's missing or what decision is needed. You provide the information, then run `/sprint resume` to continue.

## Next Steps

To complete your deployment, you need three more pieces. First, create the three-agent-story-cycle.md skill file (I can generate this content for you). Second, create the CLAUDE.md prime directives file for your project root (I can generate this content for you). Third, create or verify your sprint-status.yaml file follows the format with your specific epic and story structure.

Once those pieces are in place, you'll have a complete autonomous orchestration system ready to process your entire sprint backlog while you focus on other work. The system is designed to be reliable enough that you can kick it off on Friday afternoon, let it run through the weekend (assuming no usage limit issues), and come back Monday to find all your stories implemented, tested, and reviewed.

Would you like me to generate the remaining skill file and CLAUDE.md file content for you to complete the deployment package?
