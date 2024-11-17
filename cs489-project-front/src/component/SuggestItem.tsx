import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: fit-content;
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.6);
  }
`;

const Text = styled.div`
  font-size: 12px;
  font-weight: 500;
`;

interface Props {
  suggestion: string;
  onClick: () => void;
}

const SuggestItem = ({ suggestion, onClick }: Props) => {
  return (
    <Container onClick={onClick}>
      <Text>{suggestion}</Text>
    </Container>
  );
};

export default SuggestItem;
