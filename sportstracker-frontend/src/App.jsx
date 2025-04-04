import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import backgroundImage from './assets/images/login-background.jpg'; // Importiere das Bild

import './App.css'

function App() {

  return (
<BrowserRouter>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          margin: 0,
        }}
      >
        <AppRoutes /> {/* Deine Routen-Komponente */}
      </div>
    </BrowserRouter>

  )
}

export default App
