import { useRecoilState } from "recoil";
import styled from "styled-components";
import { ruleListAtom } from "../store/ruleStore";
import { Rule } from "../model/Rule";
import { Button, CircularProgress } from "@mui/material";
import { v4 } from "uuid";
import RuleItem from "./RuleItem";
import SuggestItem from "./SuggestItem";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import LLMRequestManager from "../network/LLMRequestManager";
import { RULE_REFINE_PROMPT } from "../prompts";
import { useState } from "react";
import { ContentBlock, TextBlock } from "@anthropic-ai/sdk/resources";
import { TextContentBlock } from "openai/resources/beta/threads/messages";

const Container = styled.div`
  width: 480px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 8px;
`;

const Title = styled.h1`
  color: rgba(0, 0, 0, 0.8);
  font-size: 16px;
  margin-bottom: 0;
`;

const Desc = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  margin: 0;
`;

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
`;

const PresetTitle = styled.h3`
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  margin: 0;
`;

const RuleArea = () => {
  const [ruleList, setRuleList] = useRecoilState(ruleListAtom);
  const [isLoading, setLoading] = useState(false);

  const handleAddRule = () => {
    setRuleList((prev) => [
      ...prev,
      {
        id: v4(),
        rule: "",
        example: "",
      },
    ]);
  };

  const handleRuleChange = (rule: Rule) => {
    setRuleList(
      ruleList.map((r) => {
        if (rule.id === r.id) return rule;
        else return r;
      })
    );
  };

  const handleRefine = async () => {
    const refinePrompt = RULE_REFINE_PROMPT;
    setLoading(true);
    const response = await LLMRequestManager.shared.requestAnthropicAPI(
      refinePrompt,
      JSON.stringify(ruleList),
      0.5
    );
    const content = response?.content[0] as TextBlock;
    setLoading(false);
    if (!content) return;
    const newRules = JSON.parse(`${content.text}`).map((t: string) => {
      return {
        id: t,
        rule: t,
        example: "",
      };
    });
    setRuleList(newRules);
  };

  const deleteRule = (rule: Rule) => {
    setRuleList(ruleList.filter((r) => r.id !== rule.id));
  };

  const handleAddPresetRules = (presetType: string) => {
    let newRules: Rule[] = [];
  
    if (presetType === "Preset 1") {
      newRules = [
        {
          id: v4(),
          rule: "Do not post photos/recipes of dishes containing meat",
          example: "I grilled a beef steak for dinner tonight and it was so delicious!",
        },
        {
          id: v4(),
          rule: "Do not disparage the vegan lifestyle",
          example: "I think vegan food is not good for the environment at all.",
        },
        {
          id: v4(),
          rule: "Respect the various forms of veganism.",
          example: "You're vegan but you eat fish and eggs? I don't understand.",
        },
      ];
    } else if (presetType === "Preset 2") {
      newRules = [
        {
          id: v4(),
          rule: "Do not criticize a specific movie as a whole. When criticizing a movie, you must mention a specific regrettable part.",
          example: "Captain Marvel, which just came out, was total garbage. My 2 hours were a waste.",
        },
        {
          id: v4(),
          rule: "No spoilers for important parts of the movie",
          example: "My favorite scene is when Iron Man takes Thanos's glove and snaps his fingers.",
        },
        {
          id: v4(),
          rule: "Respect the other person's taste",
          example: "You like that movie? You have no taste for movies.",
        },
      ];
    }

    else if (presetType === "Preset 3") {
      newRules = [
        {
          id: v4(),
          rule: "No spoilers for twists in the game",
          example: "The main character's colleague OOO turned out to be the final boss! It was shocking.",
        },
        {
          id: v4(),
          rule: "No excessive mentions of other games",
          example: "Let's move on to another game. This game is so boring.",
        },
        {
          id: v4(),
          rule: "No criticism of teammates",
          example: "You know we lost today's game because of you? Don't log in again.",
        },
      ];
    }
  
    setRuleList((prev) => [...prev, ...newRules]);
  };

  return (
    <Container>
      <Title>Rules</Title>
      <Desc>
        Please write your own rules for your community! You can describe your
        rule with natural language and also add example for violation case
      </Desc>
      {ruleList.length === 0 && (
        <>
          <PresetTitle>Presets</PresetTitle>
          <SuggestItem suggestion="🥗 Vegan cooking community" onClick={() => handleAddPresetRules("Preset 1")} />
          <SuggestItem suggestion="🎞️ Movie chat room" onClick={() => handleAddPresetRules("Preset 2")} />
          <SuggestItem suggestion="🎮 Game chat room" onClick={() => handleAddPresetRules("Preset 3")} />
          <Desc>... or start with your own rules with below button!</Desc>
        </>
      )}
      <ListContainer>
        {ruleList.length > 0 && !isLoading && (
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="outlined"
              startIcon={<AutoFixHighIcon />}
              size="small"
              onClick={handleRefine}
              sx={{ width: "fit-content", textTransform: "none" }}
            >
              Refine Rule
            </Button>
          </div>
        )}
        {ruleList.length > 0 && isLoading && (
          <div style={{ display: "flex", justifyContent: "end" }}>
            <CircularProgress size={20} />
          </div>
        )}
        {ruleList.map((r, idx) => (
          <RuleItem
            rule={r}
            idx={idx}
            onChange={handleRuleChange}
            onDelete={deleteRule}
          />
        ))}
      </ListContainer>
      <Button
        variant="outlined"
        onClick={handleAddRule}
        size="small"
        sx={{ width: "fit-content", textTransform: "none" }}
      >
        Add New Rule
      </Button>
    </Container>
  );
};

export default RuleArea;
