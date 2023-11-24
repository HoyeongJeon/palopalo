import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

function Post() {
  //const postId = match.params.Post;
  const [title, setTitle] = useState("");
  const content = useRef();
  const comment = useRef();

  useEffect(() => {
    async function Postinfo() {
      try {
        const response = await axios.get("http://localhost:3000/posts/", {
          params: { postId: "1" },
        });
        setTitle(response);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
    Postinfo();
  });

  return (
    <div class="container">
      <h2 class="result-title">
        <p value={title}></p>
      </h2>
      <p class="result-content">게시글 내용이 여기에 표시됩니다.</p>

      <button type="submit">글삭제</button>

      <div class="comment-section">
        <h3>댓글</h3>
        <form class="comment-form">
          <textarea
            id="comment"
            rows="3"
            placeholder="댓글을 입력하세요"
          ></textarea>
          <br />
          <button type="submit">댓글 작성</button>
        </form>
        <ul class="comment-list">
          <li class="comment-item">
            <p class="comment-content">댓글 내용 1</p>
            <p class="comment-author">작성자 1</p>
            <button type="submit">삭제</button>
          </li>
          <li class="comment-item">
            <p class="comment-content">댓글 내용 2</p>
            <p class="comment-author">작성자 2</p>
            <button type="submit">삭제</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Post;
