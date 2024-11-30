export const RULE_REFINE_PROMPT = `
  Consider that there is a program that gets the 1. customizable rules and 2. users' chatting as an input.
  This program would gave an output if the users' chatting obeys the rule or not. In the processing of generating output, LLM would be used.
  Your role is to modify the customizable rule that users given as an input so that LLM could understand it much better.
  To do this, you should eliminate the parts that seems ambiguous.
  List of rules would be given as an input.
  You ONLY should give an output in the format of the JSON file. NO additional explanation is required.
  JSON format should be as follows.

  [
    {
      "newRule": <alternative rule that can replace the original rule. It should've similar meanings and LLM should understand it easily.>,
      "newExample": <Example comment that violate new rule. It would be used for few-shot example in evaluation phase>
    },
      ...<same for all rules>...
  ]

  For example,
  Input:
  ["No hatred expression.", "No teabagging.", "Only articles with EDM are allowed."]
  Output:
  [
  {
    "newRule": "No sexual harassment.",
    "newExample": "That comment makes me feel uncomfortable; stop making sexual jokes about me."
  },
  {
    "newRule": "No racial harassment.",
    "newExample": "You yellow, you are inferior to mine, and you should not be here."
  },
  {
    "newRule": "Do not harm others people maliciously.",
    "newExample": "LOL, your post is so pathetic. I feel embarrassed just reading it."
  },
  {
    "newRule": "Only articles with EDM are allowed.",
    "newExample": "Check out this rock music article I found, it's awesome!"
  }
  ]

  For another example,
  Input:
  ["Do not harm other people's feeling.", "No sexual contents.", "Don't post anything that aren't related to reptiles.", "No inflammatory pronouncement."]
  Output:
  [
    {
      "newRule": "Do not engage in verbal abuse or intentionally hurt others emotionally.",
      "newExample": "You're an idiot, and your opinion is worthless."
    },
    {
      "newRule": "No explicit sexual descriptions or pornographic content.",
      "newExample": "Here's a link to a site with some porn you should check out."
    },
    {
      "newRule": "Only post content directly related to reptiles, including discussions, images, and scientific information.",
      "newExample": "(In the discussion about car) I just got a new cat! Look at this cute picture!"
    },
    {
      "newRule": "Avoid making statements designed to provoke strong negative emotional reactions or incite conflict.",
      "newExample": "Anyone who believes in this is completely stupid and deserves no respect."
    }
  ]

  I'll now give you an input. Please give me an output.
`;

export const RULE_EVALUATE_SUGGEST_PROMPT = `
  You are now going to evaluate the users' chatting. The thing is, the rules for evaluating the user's chatting are also customizable. And, also if the user's chatting is violating the rule, you should give 1. why is this text violating the rule, and 2. a suggestion that has a similar meaning and both obey the rules. The list of 1. user's chatting and 2. the custom rules would be given as input. You should give an list of output in the format of the JSON file. JSON file format should be {isError: false, reason: what rules user violated, suggestions: two alternative suggestions that can replace the original chat. It should've similar meanings and both obeys the rules}. NO additional explanation is required.

  First, isError should be always false if you get the input correctly. For the reason part, if the chat doesn't violate any rules, leave it as ''. For the suggestion part, if the reason is '', leave it as [], empty list. Remember that the output should be only the JSON file, and the JSON file should follow the format.

  If more than one inputs come in, just output the list of JSON files WITHOUT indexing.

  For example,
  rules: ["No abusive words.", "No sexual harassment.", "Every chat should be related to baseball."]
  1. Input:
  "He is absolutely trash!"
  ["He is absolutely trash!", "Women shouldn't do the baseball.", "Let's talk soccer, not the boring baseball.", "Who won this game?"]
  Output:
  {
    "isError": false,
    "reason": "abusive word 'trash' is detected",
    "suggestions": ["He is not doing well on this game."]
  }
  2. Input:
  "Women shouldn't do the baseball."
  Output:
  {
    "isError": false,
    "reason": "sexual harassment detected",
    "suggestions": ["Everyone can enjoy baseball."]
  }
  3. Input:
  "Let's talk soccer, not the boring baseball."
  Output:
  {
    "isError": false,
    "reason": "every chat should be related to baseball",
    "suggestions": ["Let's talk about some baseball things."]
  }
  4. Input:
  "Who won this game?"
  Output:
  {
    "isError": false,
    "reason": "",
    "suggestions": []
  }

  For another example, 
  Rules:
  ["No abusive words.", "No racial harassment.", "Every chat should be related to computer science or computer science courses.", "No writings that can cause controversy related to politics.", "No cheating on test or assignments.", "Don't pretend to know someone else who is anonymous."]
  1. Input:
  We only need more female students, not male.
  Output:
  {
    "isError": false,
    "reason": "gender discrimination detected",
    "suggestions": ["We need more diversity in computer science students.", "We should encourage participation from all genders in computer science."]
  }
  2. Input:
  "This professor is so dumb. TA's are also dumbass."
  Output:
  {
    "isError": false,
    "reason": "abusive words detected",
    "suggestions": ["This professor's teaching method could be improved.", "I find the course instruction challenging."]
  }
  3. Input:
  "Do you know where the 'Programming Language' course's class?"
  Output:
  {
    "isError": false,
    "reason": "",
    "suggestions": []
  }
  4. Input:
  "Anyone please give me answers with this 'Molecular Biology' lecture?"
  Output:
  {
    "isError": false,
    "reason": "not related to computer science or computer science courses",
    "suggestions": ["Can someone help me understand this computer science assignment?", "I need guidance on solving this programming problem."]
  }
  5. Input:
  "Why are there so many Europeans in this Class?"
  Output:
  {
    "isError": false,
    "reason": "racial harassment detected",
    "suggestions": ["I'm curious about the diversity in our class.", "What are the backgrounds of students in this computer science course?"]
  }
  6. Input:
  "I think we should pick him in this election because he said that he would give us more money on R&D."
  Output:
  {
    "isError": false,
    "reason": "political controversy detected",
    "suggestions": ["Let's discuss technical aspects of research funding.", "What are some innovative research strategies in computer science?"]
  }
  7. Input:
  "Please help me with this "Operative System" assignment. I'll give 30$."
  Output:
  {
    "isError": false,
    "reason": "potential academic dishonesty and cheating",
    "suggestions": ["Could someone explain the problem-solving approach for this assignment?", "I'm looking for study resources to help me understand the assignment."]
  }
  8. Input:
  "Hey, Brian what do you think you are doing?"
  Output:
  {
    "isError": false,
    "reason": "pretending to know an anonymous person",
    "suggestions": ["Is anyone available to help me?", "Could someone provide guidance?"]
  }

  I'll now give you an input. Please give me an output.
`;
