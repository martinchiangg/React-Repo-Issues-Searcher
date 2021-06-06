import React from "react";
import { Message } from "./Message";
import { IssueType, LabelType } from "../type";
import "./IssuesList.css";

const Label = ({ labelData }: { labelData: LabelType }) => {
  const { id, url, name, description } = labelData;
  return (
    <div className="label">
      <p>{`Label name: ${name}`}</p>
      <ul>
        <li>{`ID: ${id}`}</li>
        <li>{`Description: ${description}`}</li>
        <li>{`Url: ${url}`}</li>
      </ul>
    </div>
  );
};

const Issue = ({
  issueData,
  index,
}: {
  issueData: IssueType;
  index: number;
}) => {
  const { url, title, labels } = issueData;

  return (
    <div key={index} className="issue">
      <a href={url} target="_blank">
        {title}
      </a>
      {labels.map((label, idx) => (
        <Label labelData={label} key={`label-${idx}`} />
      ))}
    </div>
  );
};

export const IssuesList = ({ data }: { data: IssueType[] }) => {
  if (data.length === 0)
    return (
      <Message text="Can't find any result on Github. Try to search for something else" />
    );

  return (
    <>
      {data.map((issue, index) => (
        <Issue issueData={issue} index={index} key={index} />
      ))}
    </>
  );
};
