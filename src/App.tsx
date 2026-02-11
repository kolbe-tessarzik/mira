import TabsProvider from './features/tabs/TabsProvider';
import TabBar from './features/tabs/TabBar';
import TabView from './features/tabs/TabView';
import AddressBar from './components/AddressBar';

export default function App() {
  return (
    <TabsProvider>

      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        width: '100vw'
      }}>
        <TabBar />
        <AddressBar />
        <TabView />
      </div>
    </TabsProvider>
  );
}





