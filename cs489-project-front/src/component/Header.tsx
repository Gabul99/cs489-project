import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 64px;
  background-color: white;
  padding: 16px 32px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
`;

const Button = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/chat");
  };

  return (
    <Container>
      👍 Cleanity
      <Button onClick={handleNavigate}>Go to Chat</Button>
    </Container>
  );
};

export default Header;
