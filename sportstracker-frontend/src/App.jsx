import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import backgroundImage from './assets/images/login-background.jpg'; // Importiere das Bild

import './App.css'

function App() {

  return (
<BrowserRouter>

        <AppRoutes /> {/* Deine Routen-Komponente */}
    </BrowserRouter>

  )
}

export default App
