import { useState } from "react";
import { FUNCTIONS } from "../common/Utilities";

interface Props {
  itemClickHandler: (item: string) => void;
}

const Navigation = ({ itemClickHandler }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const items = [FUNCTIONS.Dashboard, FUNCTIONS.Categories, FUNCTIONS.Budgets, FUNCTIONS.Transactions, FUNCTIONS.Groups, FUNCTIONS.GroupTransactions];

  return (
    <div style={{ width: "200px", backgroundColor: "#ddd", padding: "20px" }}>
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              itemClickHandler(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navigation;
