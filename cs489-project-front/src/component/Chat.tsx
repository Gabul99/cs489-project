import React, { useState , useEffect} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LLMRequestManager from "../network/LLMRequestManager";
import { TextBlock } from "@anthropic-ai/sdk/resources";
import { useRecoilValue } from "recoil";
import { ruleListAtom } from "../store/ruleStore";
import { CircularProgress } from "@mui/material";
import { RULE_EVALUATE_SUGGEST_PROMPT } from "../prompts";
import { Evaluation } from "../model/Evaluation";

const ChatContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 16px;
`;

const MessageList = styled.div`
  flex: 1;
  width: 100%;
  max-width: 600px;
  overflow-y: auto;
  margin-bottom: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const Message = styled.div`
  align-self: flex-end;
  margin: 8px 0;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  word-break: break-word;
  max-width: 70%;
  margin-left: auto;
`;

const LLMResponseContainer = styled.div`
  align-self: flex-end;
  margin: 8px 0;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #007bff;
  color: black;
  border-radius: 8px;
  word-break: break-word;
  max-width: 70%;
  margin-right: auto;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: 0 16px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
`;

const SendButton = styled.button`
  padding: 12px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const WarningContainer = styled.div`
  margin-top: 8px;
  padding: 12px;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
`;

const WarningMessage = styled.div`
  color: #856404;
  font-size: 14px;
  margin-bottom: 8px;
`;

const WarningActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ConfirmButton = styled(ActionButton)`
  background-color: #dc3545;
  &:hover {
    background-color: #c82333;
  }
`;

const CancelButton = styled(ActionButton)`
  background-color: #6c757d;
  &:hover {
    background-color: #5a6268;
  }
`;

const AlternativeButton = styled(ActionButton)`
  background-color: #28a745;
  &:hover {
    background-color: #218838;
  }
`;

const NavigateButton = styled.button`
  position: fixed;
  bottom: 16px;
  left: 16px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0056b3;
  }
`;


const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [pendingMessage, setPendingMessage] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string>("");
  const [good, setGood] = useState<boolean>(false);
  const [initialProcessing, setInitialProcessing] = useState<boolean>(false);
  const [secondaryProcessing, setSecondaryProcessing] = useState<boolean>(false);
  const navigate = useNavigate();
  const ruleList = useRecoilValue(ruleListAtom);

  const fetchResponseFromLLM = async (message: string) => {
    const userPrompt = `Rules:\n${ruleList
      .map(
        (rule, index) =>
          `${index + 1}. ${rule.rule} ${
            rule.example !== "" ? `Example: ${rule.example}` : ""
          }`
      )
      .join("\n")}\n\n Input:\n${message}`;
    try {
      const response = await LLMRequestManager.shared.requestAnthropicAPI(
        "You are chatting based on rules that users have set. Users want to verify that the rules they have set work as intended. You need to lead the conversation so that users can test the rules. Considering the chat situation, don't talk too long.Look at the rules and elicit responses from users with related topics. Considering the chat situation, don't talk too long. The rules and user's input message are as follows:",
        userPrompt,
        0.1
      );
      const text = (response?.content[0] as TextBlock).text;
      return text;
    } catch (error) {
      console.error("Error with Claude API:", error);
      return "Error: Could not fetch response.";
    }
  };

  const fetchFeedback = async (message: string) => {
    const userPrompt = `Rules:\n${ruleList
      .map(
        (rule, index) =>
          `${index + 1}. ${rule.rule} ${
            rule.example !== "" ? `Example: ${rule.example}` : ""
          }`
      )
      .join("\n")}\n\n Input:\n${message}`;

    try {
      const response = await LLMRequestManager.shared.requestAnthropicAPI(
        RULE_EVALUATE_SUGGEST_PROMPT,
        userPrompt,
        0.1
      );
      const text = (response?.content[0] as TextBlock).text;
      const evaluation: Evaluation = JSON.parse(text);
      if (evaluation.reason !== "") {
        setFeedback(evaluation.reason);
        setSuggestions(evaluation.suggestions[0]);
        setGood(false);
      } else {
        setGood(true);
      }
    } catch (error) {
      console.error("Error with API:", error);
      setFeedback("Error: Could not fetch response.");
      setGood(false);
    }
  };

  const handleInitialSend = async () => {
    if (input.trim()) {
      try {
        setInitialProcessing(true);
        await fetchFeedback(input.trim());
        setPendingMessage(input.trim());
      } finally {
        setInitialProcessing(false);
      }
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInitialSend();
    }
  };

  const handleConfirmedSend = async (message: string) => {

    setSecondaryProcessing(true);
    const llmResponse = await fetchResponseFromLLM(message);
    setMessages((prevMessages) => [...prevMessages, message, llmResponse]);
    setSecondaryProcessing(false);
    
    setPendingMessage("");
    setFeedback("");
    setGood(false);
  };

  useEffect(() => {
    if (good && pendingMessage) {
      handleConfirmedSend(pendingMessage);
    }
  }, [good, pendingMessage]);

  const handleSelectAlternative = async () => {
    const userMessage = suggestions;
    handleConfirmedSend(userMessage);
  };

  const handleCancelSend = () => {
    setPendingMessage("");
    setFeedback("");
    setInput(pendingMessage);
  };

  return (
    <ChatContainer>
      <MessageList>
        {messages.map((msg, index) => (
          <div key={index}>
            {index % 2 === 0 ? (
              <Message>{msg}</Message>
            ) : (
              <LLMResponseContainer>{msg}</LLMResponseContainer>
            )}
          </div>
        ))}
      </MessageList>
      <InputContainer>
        {feedback && !good && pendingMessage && (
          <WarningContainer>
            <WarningMessage>
              {pendingMessage}
              <br />
              {"Warning: "}
              {feedback}
              <br />
              {"Alternative: "}
              {suggestions}
            </WarningMessage>
            {secondaryProcessing ? (
              <CircularProgress size={24} />
            ) : (
              <WarningActions>
                <ConfirmButton onClick={() => handleConfirmedSend(pendingMessage)}>
                  Send Anyway
                </ConfirmButton>
                <AlternativeButton onClick={handleSelectAlternative}>
                  Select Alternative
                </AlternativeButton>
                <CancelButton onClick={handleCancelSend}>Cancel</CancelButton>
              </WarningActions>
            )}
          </WarningContainer>
        )}
        <InputRow>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
          />
          {initialProcessing || secondaryProcessing? (
            <CircularProgress size={24} />
          ) : (
            <SendButton onClick={handleInitialSend}>Send</SendButton>
          )}
        </InputRow>
      </InputContainer>
      <NavigateButton onClick={() => navigate("/")}>Go to Rule</NavigateButton>
    </ChatContainer>
  );
};

export default Chat;
