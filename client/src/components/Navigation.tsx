import { useState } from "react";

interface Props {
  items: string[];
  onSelectItem: (item: string) => void;
}

const Navigation = ({ items, onSelectItem }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

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
              onSelectItem(item);
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
