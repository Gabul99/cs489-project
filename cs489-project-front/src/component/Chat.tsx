import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
  flex-direction: column; /* 메시지가 세로로 나열되도록 설정 */
`;

const Message = styled.div`
  align-self: flex-end; /* 메시지를 오른쪽으로 정렬 */
  margin: 8px 0;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  word-break: break-word; /* 긴 단어 줄바꿈 */
  max-width: 70%; /* 최대 너비 */
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 600px;
  margin: 0 16px;
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
  const navigate = useNavigate();

  const sendMessage = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, input]);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleNavigateBack = () => {
    navigate("/");
  };

  return (
    <ChatContainer>
      <MessageList>
        {messages.map((msg, index) => (
          <Message key={index}>{msg}</Message>
        ))}
      </MessageList>
      <InputContainer>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
        />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </InputContainer>
      <NavigateButton onClick={handleNavigateBack}>Go to Rule</NavigateButton>
    </ChatContainer>
  );
};

export default Chat;