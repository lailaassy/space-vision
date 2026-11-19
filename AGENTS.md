# Working on Space Vision

## Project
This is Laila's early computer-vision project for finding individual items in cluttered household photos. Keep it separate from Drawer Studio until an integration is tested. Read README.md and DATASETS.md first; consult reports only when relevant.

## Communication and writing
Use plain, natural language. README text should explain what I am building and why in first person. Avoid corporate language, exaggerated claims, and resume-style filler. Clearly distinguish working code, untested code, planned work, and measured results.

## Keep work focused
Inspect only files needed for the task. Prefer targeted searches and small diffs. Summarize findings instead of printing large files or repeating browser snapshots. Do not add dependencies or paid model calls when an existing utility or local test is enough. Finish authorized reversible work without repeatedly asking to continue.

## Data and models
Never commit API keys, personal photos, downloaded datasets, model weights, or experiment outputs. Keep those in ignored paths. Record dataset source, license, version, and original split. Keep related views of the same scene together. AI predictions are not ground truth. Do not claim a model was trained or report accuracy before running and recording the experiment. Preserve unknown dimensions, especially height.

## Checks and Git
Run npm test after changing data or geometry code. Validate actual sample loading when changing imports. Changes to Python inference need a real inference check or an explicit note that it was not run. Stage specific files and inspect the diff for private data. Commit completed work with a clear message. Do not publish private data or change repository visibility without user authorization.

## Handoff
Keep HANDOFF.md short: current state, exact next step, tests, and blockers. Use it to start a fresh chat without replaying the full development history.
