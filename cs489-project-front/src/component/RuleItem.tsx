import styled from "styled-components";
import { Rule } from "../model/Rule";
import { IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;

  .icon-holder {
    width: fit-content;
    height: fit-content;
    flex-shrink: 0;
  }

  .sub-title {
    font-size: 12px;
  }
`;

interface Props {
  rule: Rule;
  idx: number;
  onChange: (r: Rule) => void;
  onDelete: (r: Rule) => void;
}

const RuleItem = ({ rule, idx, onChange, onDelete }: Props) => {
  return (
    <Container>
      <Row>
        <TextField
          variant="outlined"
          label={`Rule ${idx + 1}`}
          value={rule.rule}
          placeholder="Write your rule"
          size="small"
          onChange={(e) => {
            onChange({
              ...rule,
              rule: e.target.value,
            });
          }}
          sx={{
            flexGrow: 1,
            minWidth: 0,
            "& ::placeholder": { fontSize: "small" },
          }}
        />
        <IconButton onClick={() => onDelete(rule)}>
          <DeleteIcon />
        </IconButton>
      </Row>
      <Row>
        <div className="sub-title">Example</div>
        <TextField
          variant="standard"
          value={rule.example}
          placeholder="Write example breaking above rule"
          size="small"
          onChange={(e) => {
            onChange({
              ...rule,
              example: e.target.value,
            });
          }}
          sx={{
            flexGrow: 1,
            minWidth: 0,
            "& ::placeholder": { fontSize: "small" },
          }}
        />
        {/* <IconButton disabled={rule.rule === ""} onClick={() => {}}>
          <AutoFixHighIcon />
        </IconButton> */}
      </Row>
    </Container>
  );
};

export default RuleItem;
