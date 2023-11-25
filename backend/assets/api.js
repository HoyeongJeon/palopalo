function getSelf(callback) {
  $.ajax({
    type: "GET",
    url: "/api/me",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      // console.log(response.user); 닉네임 , loggedInUserId
      callback(response.user);
    },
    error: function (xhr, status, error) {
      if (status == 401) {
        alert("로그인이 필요합니다.");
      } else {
        localStorage.clear();
        alert("알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.");
      }
      window.location.href = "/";
    },
  });
}

function getPostDetail(postId, callback) {
  $.ajax({
    type: "GET",
    url: `/posts/${postId}`,
    error: function (xhr, status, error) {
      if (status == 401) {
        alert("로그인이 필요합니다.");
      } else if (status == 404) {
        alert("존재하지 않는 상품입니다.");
      } else {
        alert("알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.");
      }
      window.location.href = "/goods";
    },
    success: function (response) {
      console.log(response);
      callback(response.goods);
    },
  });
}
