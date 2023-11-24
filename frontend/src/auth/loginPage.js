import React, { useState, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
//import "./App.css";

function App() {
  const email = useRef();
  const password = useRef();

  const handleSignIn = async (event) => {
    event.preventDefault();
    if (!email) {
      alert("아이디를 입력해 주세요");
      return false;
    } else if (!password) {
      alert("비밀번호를 입력해 주세요");
    }
    //console.log(password.current.value);
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: email.current.value,
        password: password.current.value,
      });
      console.log(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const history = useHistory();

  const handleSignUp = () => {
    history.push("/signup");
  };

  return (
    <div className="login">
      <h2>로그인</h2>
      <form onSubmit={handleSignIn}>
        <div className="form">
          <p>
            <input
              className="loginId"
              type="email"
              placeholder="아이디"
              ref={email}
            />
          </p>
          <p>
            <input
              className="loginPassword"
              type="password"
              placeholder="비밀번호"
              ref={password}
            />
          </p>
          <p>
            <button className="loginBtn" type="submit">
              로그인
            </button>
          </p>
          <p>
            <button className="signupBtn" type="button" onClick={handleSignUp}>
              회원가입
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default App;
