import { useState } from "react";
import { FUNCTIONS } from "../common/Utilities";

interface Props {
  itemClickHandler: (item: string) => void;
}

/**
 * The Navigation component renders the navigation menu for the application,
 * allowing users to switch between different functions.
 * @param {Props} itemClickHandler - Function to handle item click event
 */
const Navigation = ({ itemClickHandler }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Define the list of navigation items
  const items = [FUNCTIONS.Dashboard, FUNCTIONS.Categories, FUNCTIONS.Budgets, FUNCTIONS.Transactions, FUNCTIONS.Groups, FUNCTIONS.GroupTransactions];

  return (
    <div style={{ width: "200px", backgroundColor: "#ddd", padding: "20px" }}>
      <ul className="list-group">
        {/* Map through the items array to create navigation items */}
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