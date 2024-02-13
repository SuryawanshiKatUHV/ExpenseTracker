
import Header from './Header';
import Navigation from './Navigation';
import Content from './Content';
import { ReactNode } from 'react';

interface Props {
  children :ReactNode;
  onSelectItem: (item: string) => void;
}

const Layout = ({ children, onSelectItem } : Props) => {
  const items = ["Dashboard", "Users", "Categories", "Expenses", "Incomes"];

  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <Navigation items={items} onSelectItem={onSelectItem}/>
        <Content>{children}</Content>
      </div>
    </div>
  );
};

export default Layout;