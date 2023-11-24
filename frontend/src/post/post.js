import React, { useState, useRef, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";

function Post() {
  //const postId = match.params.Post;
  const { postsId } = useParams();
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  // const content = useRef();

  const comment = useRef();

  async function Postinfo() {
    try {
      const response = await axios.get(`http://localhost:3000/posts/${1}`);

      // console.log(response.data.data.title);
      setTitle(response.data.data.post.title);
      setComments(response.data.data.comments);
      setContent(response.data.data.post.content);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    Postinfo();
  }, []);

  const onDelSubmit = (event) => {
    console.log(event);
  };

  console.log(comments);
  return (
    <div className="container">
      <h1>{title}</h1>
      <p className="result-content">{content}</p>
      <button type="submit">글삭제</button>

      <div className="comment-section">
        <h3>댓글</h3>
        <form className="comment-form">
          <textarea
            id="comment"
            rows="3"
            placeholder="댓글을 입력하세요"
          ></textarea>
          <br />
          <button type="submit">댓글 작성</button>
        </form>
        <ul className="comment-list">
          {comments.map((comment) => {
            return <li key={comment.id}>{comment.content}</li>;
          })}
          {/* {comments.map((comment) => {
            return (
              <li key={comment.id}>
                <p className="comment-content">{comment.content}</p>
                <p className="comment-author">{comment.nickname}</p>
                <button onClick={onDelSubmit} type="submit">
                  삭제
                </button>
              </li>
            );
          })} */}
          {/* {link} */}
          {/* <li class="comment-item">
            <p class="comment-content">댓글 내용 1</p>
            <p class="comment-author">작성자 1</p>
            <button type="submit">삭제</button>
          </li>
          <li class="comment-item">
            <p class="comment-content">댓글 내용 2</p>
            <p class="comment-author">작성자 2</p>
            <button type="submit">삭제</button>
          </li> */}
        </ul>
      </div>
    </div>
  );
}

export default Post;
