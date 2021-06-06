export type LabelType = {
  id: string;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string | null;
};

export type IssueType = {
  title: string;
  url: string;
  labels: LabelType[];
};
