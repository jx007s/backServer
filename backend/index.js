const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'user1',
  password: '1234',
  database: 'study_db'
});

// MySQL 연결 확인
db.connect(err => {
  if (err) {
    console.error('MySQL 연결 실패:', err.stack);
    return;
  }
  console.log('MySQL에 연결됨');
});

//proxy 처리
app.use(cors());

// JSON 요청 본문 처리
app.use(express.json());

// 게시판 목록 조회
app.get('/posts', (req, res) => {
  console.log("/posts 진입")
  db.query('SELECT * FROM posts ORDER BY created_at DESC', (err, results) => {
    if (err) {
      return res.status(500).send('데이터베이스 오류');
    }
    res.json(results);
  });
});

// 게시글 상세 조회
app.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM posts WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).send('데이터베이스 오류');
    }
    if (results.length === 0) {
      return res.status(404).send('게시글을 찾을 수 없습니다');
    }
    res.json(results[0]);
  });
});

// 게시글 작성
app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  db.query('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], (err, results) => {
    if (err) {
      return res.status(500).send('게시글 작성 오류');
    }
    res.status(201).send({ id: results.insertId, title, content });
  });
});

// 게시글 수정
app.put('/posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  db.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, id], (err, results) => {
    if (err) {
      return res.status(500).send('게시글 수정 오류');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('게시글을 찾을 수 없습니다');
    }
    res.send({ id, title, content });
  });
});

// 게시글 삭제
app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM posts WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).send('게시글 삭제 오류');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('게시글을 찾을 수 없습니다');
    }
    res.send('게시글이 삭제되었습니다');
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});