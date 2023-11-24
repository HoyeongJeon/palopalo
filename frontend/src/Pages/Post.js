import { useNavigate, Outlet } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faPen,
  faCircleUser,
} from '@fortawesome/free-solid-svg-icons';

function Post() {
  const navigate = useNavigate();
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
          </Nav>
        </Container>
      </Navbar>
      <p>게시물 작성 페이지입니다.</p>
    </>
  );
}

export default Post;
