import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "screens/homePage";
import LoginPage from "screens/loginPage";
import ProfilePage from "screens/profilePage";
function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
