import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // GitHub Codespaces에서 제공하는 URL로 변경
  //const API_URL = 'http://<your-codespace-name>.github.dev:5000/posts';  // Codespaces URL로 변경
  const API_URL = 'https://shiny-meme-r77wvvv7r6whp797-5000.app.github.dev/posts';  // Codespaces URL로 변경
  console.log(API_URL);
  

  // 게시판 목록을 API에서 가져오는 함수
  useEffect(() => {
    axios.get(API_URL)
      .then(response => {

        console.log("백에서 왔다", response)
        setPosts(response.data);  // API로부터 받은 데이터로 상태 업데이트
        setLoading(false);         // 데이터 로딩 완료
      })
      .catch(error => {
        console.error('게시판 데이터를 가져오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <h1>게시판</h1>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p><strong>작성일: </strong>{new Date(post.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
