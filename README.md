# Cleanity: Community Moderator Tool based on Custom Rules and LLM Evaluator
2024 Fall KAIST CS489 `Computer Ethics and Social Issues` Term Project
Heechan Lee, Gyuho Lee, Hojun Park

## Summary
In response to the challenges faced by online communities, including strict rule enforcement, trolling, and user non-compliance with platform rules, Cleanity introduces an innovative moderation system leveraging Large Language Models (LLMs).
The system enables customizable rules tailored to each community's unique needs, provides prompt feedback to inform users about rule violations, and suggests alternative comments that align with the rules. Key features include a Custom Rules pipeline, rule refinement tools, and a Playground for testing rule efficacy.
By automating moderation tasks and fostering user awareness of community standards, Cleanity reduces the burden on moderators, mitigates harmful content, and encourages collaborative rule evolution.
Despite its reliance on LLMs and associated latency issues, Cleanity offers a promising approach to balancing user freedom and community harmony, with future plans to enhance multi-modality support and reduce response delays.

## Detail
Please check the final report and presentation document in main directory for understanding our project.
If you want to run the system demo, follow the instruction:
```
cd cs489-project-front
npm install
npm run start
```
Also, it is required to provide your own API key from Anthropic.
Please create `.env` file in front project root and write as follows:
```
REACT_APP_ANTHROPIC_API_KEY={your anthropic api key}
```
