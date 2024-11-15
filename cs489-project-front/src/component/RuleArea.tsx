import { useRecoilState } from "recoil";
import styled from "styled-components";
import { ruleListAtom } from "../store/ruleStore";
import { Rule } from "../model/Rule";
import { Button } from "@mui/material";
import { v4 } from "uuid";
import RuleItem from "./RuleItem";

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

const RuleArea = () => {
  const [ruleList, setRuleList] = useRecoilState(ruleListAtom);

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

  const deleteRule = (rule: Rule) => {
    setRuleList(ruleList.filter((r) => r.id !== rule.id));
  };

  return (
    <Container>
      <Title>Rules</Title>
      <Desc>
        Please write your own rules for your community! You can describe your
        rule with natural language and also add example for violation case
      </Desc>
      <ListContainer>
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
