import { ReactNode } from "react";

interface Props {
  children :ReactNode;
}

const Content = ({ children }: Props) => {
  return (
    <div style={{ flex: 1, padding: '20px' }}>
      {children || "Default Content"}
    </div>
  );
};

export default Content;