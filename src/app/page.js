// pages/index.js
import Galaxy from './components/Galaxy';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'black', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Galaxy Coin Tracker</h1>
      <Galaxy />
      <footer style={{ marginTop: '20px', color: 'gray', textAlign: 'center' }}>
        <p>Powered by Three.js and Next.js</p>
      </footer>
    </div>
  );
}
