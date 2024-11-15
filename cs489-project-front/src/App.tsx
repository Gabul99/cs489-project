import styled from "styled-components";
import Header from "./component/Header";
import RuleArea from "./component/RuleArea";
import PlaygroundArea from "./component/PlaygroundArea";

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

function App() {
  return (
    <Container>
      <Header />
      <Contents>
        <RuleArea />
        <PlaygroundArea />
      </Contents>
    </Container>
  );
}

export default App;
