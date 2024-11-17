import { IconButton, TextField } from "@mui/material";
import { useRef, useState } from "react";
import styled from "styled-components";
import SendIcon from "@mui/icons-material/Send";
import SuggestItem from "./SuggestItem";

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

const SendButtonRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: end;
`;

const PlaygroundArea = () => {
  const [targetText, setTargetText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectSuggestion = (suggestion: string) => {
    setTargetText(suggestion);
    inputRef.current?.focus();
  };

  return (
    <Container>
      <Title>Playground</Title>
      <Desc>
        Write any posts or comments you want to test and check your custom rule
        can detect it!
      </Desc>
      <TextField
        inputRef={inputRef}
        placeholder="Write your target content"
        multiline
        fullWidth
        minRows={3}
        maxRows={8}
        size="small"
        value={targetText}
        onChange={(e) => setTargetText(e.target.value)}
        sx={{ "& ::placeholder": { fontSize: "small" } }}
      />
      <SendButtonRow>
        <IconButton color={"primary"} disabled={targetText.length === 0}>
          <SendIcon />
        </IconButton>
      </SendButtonRow>
      <Title>Suggestions</Title>
      <SuggestItem
        suggestion="Suggestion 1"
        onClick={() => selectSuggestion("Suggestion 1")}
      />
      <SuggestItem
        suggestion="Suggestion 2"
        onClick={() => selectSuggestion("Suggestion 2")}
      />
    </Container>
  );
};

export default PlaygroundArea;
