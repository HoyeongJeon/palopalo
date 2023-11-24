import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
//import "../App.css";

function PostRegister() {
  const title = useRef();
  const password = useRef();
  const content = useRef();
  const file = useRef();

  const history = useHistory();

  const inputPost = async (event) => {
    event.preventDefault();
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/posts/",
        data: {
          title: title.current.value,
          content: content.current.value,
          photo: file.current.value,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log("ErrorMessage:", error.response);
    }
  };

  const handleHome = () => {
    history.push("/mainpage");
  };

  return (
    <div class="container">
      <form onSubmit={inputPost} enctype="multipart/form-data">
        <div class="form-group">
          <label for="title">Title:</label>
          <input type="text" id="title" name="title" ref={title} />
        </div>
        <div class="form-group">
          <label for="content">Content:</label>
          <textarea
            id="content"
            name="content"
            rows="5"
            ref={content}
          ></textarea>
        </div>
        <div class="form-group">
          <label for="attach">Attach:</label>
          <input type="file" id="attach" name="attach" ref={file} />
        </div>
        <div class="btn-group">
          <button type="button" id="cancel" onClick={handleHome}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}

export default PostRegister;
