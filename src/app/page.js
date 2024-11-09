// pages/index.js
import GalaxyD3 from './components/Galaxy';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'black', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Generative Solar System</h1>
      <GalaxyD3 />
      <footer style={{ marginTop: '20px', color: 'gray', textAlign: 'center' }}>
      </footer>
    </div>
  );
}
