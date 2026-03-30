import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/news" element={<div>News</div>} />
        <Route path="/notices" element={<div>Notices</div>} />
        <Route path="/friends" element={<div>Friends</div>} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="/add-pet" element={<div>Add Pet</div>} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;