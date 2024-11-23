import {
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import styled from "styled-components";
import SendIcon from "@mui/icons-material/Send";
import SuggestItem from "./SuggestItem";
import OpenAI from "openai";
import LLMRequestManager from "../network/LLMRequestManager";
import { TextBlock } from "@anthropic-ai/sdk/resources";

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

const ResponseContainer = styled.div`
  margin-top: 16px;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const PlaygroundArea = () => {
  const [targetText, setTargetText] = useState<string>("");
  const [responseText, setResponseText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectSuggestion = (suggestion: string) => {
    setTargetText(suggestion);
    inputRef.current?.focus();
  };

  const handleSend = async () => {
    setLoading(true);
    setResponseText(null);

    try {
      const response = await LLMRequestManager.shared.requestAnthropicAPI(
        "Please tell anything", // We will replace this to real system prompt
        targetText,
        0.1
      );
      const text = (response?.content[0] as TextBlock).text;
      setFeedback(text);
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      setResponseText("Error: Could not fetch response.");
    } finally {
      setLoading(false);
    }
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
        error={feedback !== null}
        helperText={feedback}
        onChange={(e) => setTargetText(e.target.value)}
        sx={{ "& ::placeholder": { fontSize: "small" } }}
      />
      <SendButtonRow>
        {loading && <CircularProgress size={24} />}
        {!loading && (
          <IconButton
            color={"primary"}
            disabled={targetText.length === 0 || loading}
            onClick={handleSend}
          >
            <SendIcon />
          </IconButton>
        )}
      </SendButtonRow>
      {responseText && (
        <ResponseContainer>
          <Typography variant="subtitle1" sx={{ marginBottom: "8px" }}>
            GPT Response:
          </Typography>
          <Typography variant="body2">{responseText}</Typography>
        </ResponseContainer>
      )}
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
