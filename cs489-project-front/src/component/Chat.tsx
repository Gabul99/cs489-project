import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LLMRequestManager from "../network/LLMRequestManager";
import { TextBlock } from "@anthropic-ai/sdk/resources";
import { useRecoilValue } from "recoil";
import { ruleListAtom } from "../store/ruleStore";

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
  background-color: #007bff;
  color: white;
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
  const [warning, setWarning] = useState<string>("");
  const [pendingMessage, setPendingMessage] = useState<string>("");
  const [alternative, setAlternative] = useState<string>("");
  const [LLMresponse, setLLMResponse] = useState<string>("");
  const navigate = useNavigate();
  const ruleList = useRecoilValue(ruleListAtom);
  const rulesPrompt = ruleList.length > 0 
  ? `Specific guidelines to check:\n${ruleList.map((rule, index) => `${index + 1}. ${rule.rule || rule.example}`).join('\n')}\n\n`
  : '';

  const fetchWarningFromLLM = async (message: string) => {
    try {
       
      const response = await LLMRequestManager.shared.requestAnthropicAPI(
        `You are a text evaluator. ${rulesPrompt}Provide warnings if the following message violates any of the above guidelines.`,
        message,
        0.1
      );

      const text = (response?.content[0] as TextBlock).text;
      setWarning(text);
    } catch (error) {
      console.error("Error with Claude API:", error);
      setWarning("Error: Could not fetch response.");
    }
  };

  const fetchAlternativeFromLLM = async (message: string) => {
    try {

      const response = await LLMRequestManager.shared.requestAnthropicAPI(
        `${rulesPrompt} You are responsible for editing the user's message. Edit the user's message so that it conforms to the guidelines.`,
        message,
        0.1
      );
      const text = (response?.content[0] as TextBlock).text;
      setAlternative(text);
    } catch (error) {
      console.error("Error with Claude API:", error);
      setAlternative("Error: Could not fetch response.");
    }
  };

  const fetchResponseFromLLM = async (message: string) => {
    try {
      const response = await LLMRequestManager.shared.requestAnthropicAPI(
        "You are an assistant. Respond thoughtfully to the following message.",
        message,
        0.1
      );
      const text = (response?.content[0] as TextBlock).text;
      setLLMResponse(text);
    } catch (error) {
      console.error("Error with Claude API:", error);
      setLLMResponse("Error: Could not fetch response.");
    }
  };

  const handleInitialSend = async () => {
    if (input.trim()) {
      await fetchWarningFromLLM(input.trim());
      await fetchAlternativeFromLLM(input.trim());
      await fetchResponseFromLLM(input.trim());
      setPendingMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInitialSend();
    }
  };

  const handleConfirmedSend = () => {
    setMessages((prevMessages) => [...prevMessages, pendingMessage, LLMresponse]);
    setPendingMessage("");
    setWarning("");
  };

  const handleCancelSend = () => {
    setPendingMessage("");
    setWarning("");
    setInput(pendingMessage);
  };

  const handleSelectAlternative = () => {
    setMessages((prevMessages) => [...prevMessages, alternative, LLMresponse]);
    setPendingMessage("");
    setWarning("");
  };
  
  return (
    <ChatContainer>
      <MessageList>
        {messages.map((msg, index) => (
          <div key={index}>
            {index % 2 === 0 ? ( // 짝수: 사용자 메시지, 홀수: LLM 응답
              <Message>{msg}</Message>
            ) : (
              <LLMResponseContainer>{msg}</LLMResponseContainer>
            )}
          </div>
        ))}
      </MessageList>
      <InputContainer>
        <InputRow>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
          />
          <SendButton onClick={handleInitialSend}>Send</SendButton>
        </InputRow>
        {warning && pendingMessage && (
          <WarningContainer>
            <WarningMessage>
              {pendingMessage}
              <br />
              {"Warning: "}
              {warning}
              <br />
              {"Alternative: "}
              {alternative}
            </WarningMessage>
            <WarningActions>
              <ConfirmButton onClick={handleConfirmedSend}>
                Send Anyway
              </ConfirmButton>
              <AlternativeButton onClick={handleSelectAlternative}>
                Select Alternative
              </AlternativeButton>
              <CancelButton onClick={handleCancelSend}>
                Cancel
              </CancelButton>
            </WarningActions>
          </WarningContainer>
        )}
      </InputContainer>
      <NavigateButton onClick={() => navigate("/")}>Go to Rule</NavigateButton>
    </ChatContainer>
  );
};

export default Chat;
