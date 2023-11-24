import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faPen,
  faCircleUser,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

function Main() {
  const [boardList, setboardList] = useState([]);
  // const [title, setTitle] = useState([]);
  // const [author, setAuthor] = useState([]);
  // const [createdAt, setCreatedAt] = useState([]);

  const getBoardList = () => {
    axios.get('http://localhost:8080/posts').then(res => {
      console.log(res.data.posts);
      setboardList(res.data.posts);
    });
  };

  useEffect(() => {
    getBoardList();
  }, []);

  return (
    <>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="#home">오늘의 날씨</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link
              onClick={() => {
                navigate('/');
              }}
            >
              <FontAwesomeIcon icon={faHouse} />
              메인
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                navigate('/post');
              }}
            >
              <FontAwesomeIcon icon={faPen} />
              게시글
            </Nav.Link>
            <Nav.Link href="#pricing">
              <FontAwesomeIcon icon={faCircleUser} />
              프로필
            </Nav.Link>
            <Nav.Link href="#pricing" className="faBars">
              <FontAwesomeIcon icon={faBars} />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <div className="weather"></div>
      {boardList.map(function (boardList, i) {
        return (
          <div className="list" key="{boardList.idx}">
            <div className="topList">
              <h4 className="name">{boardList.id}</h4>
              <h4 className="title">{boardList.title}</h4>
              <h4 className="upDate">{boardList.createdAt}</h4>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Main;
