import { useState } from 'react';
import './App.css'
import Layout from './components/Layout';

function App() {
  const [message, setMessage] = useState('Dashboard');

  const onSelectItem = (item: string) => {
    setMessage(item);
  }

  return (
    <Layout onSelectItem={onSelectItem}>
      <p>{`${message} is selected.`}</p>
    </Layout>
  );
}

export default App;