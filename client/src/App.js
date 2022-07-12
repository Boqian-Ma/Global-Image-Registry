import './App.css';
import ImageUploadComponent from './components/ImageUploadComponent';
import React, { useState, useEffect } from 'react';


function App() {
  const [metamaskStatus, setMetamaskStatus] = useState(true);
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      setMetamaskStatus(false);
    }
  }, [])
  return (
    <div className="App">
      {metamaskStatus && <div>Please install metamask</div>}
      <ImageUploadComponent />
    </div>
  );
}

export default App;
