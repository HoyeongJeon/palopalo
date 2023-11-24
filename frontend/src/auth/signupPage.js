import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
//import "../App.css";
import "./signup.css";

function SingupPage() {
  const email = useRef();
  const password = useRef();
  const passwordCheck = useRef();
  const nickname = useRef();
  const name = useRef();
  const location = useRef();
  const introduce = useRef();
  const favorite_weather = useRef();

  const history = useHistory();

  const inputSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/auth/signup",
        data: {
          email: email.current.value,
          password: password.current.value,
          passwordCheck: passwordCheck.current.value,
          name: name.current.value,
          nickname: nickname.current.value,
          location: location.current.value,
          introduce: introduce.current.value,
          favorite_weather: favorite_weather.current.value,
        },
      });

      //   const response = await axios.post("http://localhost:3000/auth/signup", {
      //     email,
      //     password,
      //     passwordCheck,
      //     name,
      //     nickname,
      //     location,
      //     introduce,
      //     favorite_weather,
      //   });
      console.log(response.data);
    } catch (error) {
      console.log("ErrorMessage:", error.response);
    }
  };

  const handleSignIn = () => {
    history.push("/login");
  };

  return (
    <div id="container">
      <form onSubmit={inputSignup}>
        <label for="email">
          <span>이메일 주소</span>
          <div>
            <input
              id="email"
              placeholder="이메일을 입력해주세요."
              ref={email}
              required
            />
          </div>
        </label>
        <label for="name">
          <span>이름</span>
          <div>
            <input
              id="name"
              name="name"
              placeholder="이름을 입력해주세요."
              type="text"
              ref={name}
              required
            />
          </div>
        </label>
        <label for="nickname">
          <span>닉네임</span>
          <div>
            <input
              id="nickname"
              name="nickname"
              placeholder="닉네임을 입력해주세요."
              type="text"
              ref={nickname}
            />
          </div>
        </label>
        <label for="location">
          <span>본인이 거주하는 도시</span>
          <div>
            <input
              id="location"
              name="location"
              placeholder="본인이 거주하는 도시를 알려주세요."
              type="text"
              ref={location}
              required
            />
          </div>
        </label>
        <label for="favorite_weather">
          <span>좋아하는 계절</span>
          <div>
            <input
              id="favorite_weather"
              name="favorite_weather"
              placeholder="좋아하는 계절이 무엇인가요?"
              type="text"
              ref={favorite_weather}
              required
            />
          </div>
        </label>
        <label for="introduce">
          <span>한줄 자기소개</span>
          <div>
            <input
              id="introduce"
              name="introduce"
              placeholder="본인을 한줄로 표현해주세요!"
              type="text"
              ref={introduce}
              required
            />
          </div>
        </label>
        <label for="password">
          <span>비밀번호</span>
          <div>
            <input
              id="password"
              name="password"
              placeholder="비밀번호를 입력해주세요."
              type="password"
              ref={password}
              required
            />
          </div>
        </label>
        <label for="passwordCheck">
          <span>비밀번호 확인</span>
          <div>
            <input
              id="passwordCheck"
              name="passwordCheck"
              placeholder="다시 한번 입력해주세요."
              type="password"
              ref={passwordCheck}
              required
            />
          </div>
        </label>
        <button type="button" onClick={inputSignup}>
          회원가입
        </button>
      </form>
      <p class="LinkContainer">
        이미 회원이신가요?&nbsp;
        <a onClick={handleSignIn}>로그인 하러가기</a>
      </p>
    </div>
  );
}

export default SingupPage;
