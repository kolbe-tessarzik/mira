import { useState } from 'react';
import { useTabs } from '../features/tabs/TabsProvider';

export default function AddressBar() {
  const { navigate } = useTabs();
  const [input, setInput] = useState('');

  const go = () => {
    let url = input;

    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    navigate(url);
  };

  return (
    <div style={{ display: 'flex' }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && go()}
        style={{ flex: 1 }}
      />
      <button onClick={go}>Go</button>
    </div>
  );
}
