import { atom } from "recoil";
import { Rule } from "../model/Rule";

export const ruleListAtom = atom<Rule[]>({
  key: "ruleListAtom",
  default: [],
});
