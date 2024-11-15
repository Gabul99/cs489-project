import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 64px;
  background-color: white;
  padding: 16px 32px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;

  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
`;

const Header = () => {
  return <Container>👍 Cleanity</Container>;
};

export default Header;
