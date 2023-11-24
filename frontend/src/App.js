import './App.css';

import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import Login from './Pages/Login.js';
import Main from './Pages/Main.js';
import Post from './Pages/Post.js';

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<div>회원가입페이지</div>} />
        <Route path="/post" element={<Post />} />
        <Route path="/post/:idx" element={<div>게시물 상세보기페이지</div>} />
        <Route path="*" element={<div>404 없는 페이지입니다.</div>} />
      </Routes>
    </div>
  );
}

export default App;

