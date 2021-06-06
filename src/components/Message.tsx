import React from "react";

export const Message = ({ text }: { text: string }) => (
  <div className="message">
    <h2>{text}</h2>
    <hr />
  </div>
);
