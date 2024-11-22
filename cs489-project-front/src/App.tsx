import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./component/Header";
import RuleArea from "./component/RuleArea";
import PlaygroundArea from "./component/PlaygroundArea";
import Chat from "./component/Chat";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const Contents = styled.div`
  width: 100%;
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const NavigateButton = styled.button`
  position: fixed;
  bottom: 16px;
  right: 16px;
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

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/chat");
  };

  return (
    <Container>
      <Header />
      <Contents>
        <RuleArea />
        <PlaygroundArea />
      </Contents>
      <NavigateButton onClick={handleNavigate}>Go to Chat</NavigateButton>
    </Container>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;
