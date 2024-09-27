import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.js';
import Menudoc from './pages/Menu_doc.js';
import Menuest from './pages/Menu_est.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu_doc" element={<Menudoc />} />
        <Route path="/menu_est" element={<Menuest />} />
      </Routes>
    </Router>
  );
}

export default App;
