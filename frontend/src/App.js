import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      if (!email) {
        alert('아이디를 입력해 주세요');
        return false;
      } else if (!password) {
        alert('비밀번호를 입력해 주세요');
      }

      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password,
      });
      console.log(response.data);
      alert('로그인에 성공하였습니다');
    } catch (error) {
      console.log('errorMessage:', error.response);
    }
  };

  return (
    <div className="login">
      <h2>로그인</h2>
      <form>
        <div className="form">
          <p>
            <input
              className="loginId"
              type="text"
              placeholder="아이디"
              value={email}
              onChange={event => setUsername(event.currentTarget.value)}
            />
          </p>
          <p>
            <input
              className="loginPassword"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={event => setPassword(event.currentTarget.value)}
            />
          </p>
          <p>
            <button className="loginBtn" type="button" onClick={handleSignUp}>
              로그인
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default App;

