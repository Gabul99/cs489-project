import { IconButton, TextField } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import SendIcon from "@mui/icons-material/Send";

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
  return (
    <Container>
      <Title>Playground</Title>
      <Desc>
        Write any posts or comments you want to test and check your custom rule
        can detect it!
      </Desc>
      <TextField
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
    </Container>
  );
};

export default PlaygroundArea;
