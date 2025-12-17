import { useEffect, useRef, useState } from 'react';
import'./index.css'
const API_URL = 'https://2bdefcae3c52b8b2.mokky.dev/shortsAPI';

export default function App() {
  const [shorts, setShorts] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setShorts(data))
      .catch(err => console.error('Ошибка загрузки шортов:', err));
  }, []);

  return (
    <div className="phone-container">
      <div className="feed">
        {shorts.map((s) => (
          <Short key={s.id} data={s} />
        ))}
      </div>
    </div>
  );
}

function Short({ data }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!ref.current) return;
        if (entry.isIntersecting) {
          ref.current.play();
          setActive(true);
        } else {
          ref.current.pause();
          setActive(false);
        }
      },
      { threshold: 0.7 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Берём значения из API или дефолтные
  const likes = data.likes || '0';
  const comments = data.comments || '0';

  return (
    <div className={`short ${active ? 'active' : ''}`}>
      <video ref={ref} src={data.url} loop muted playsInline />

      <div className="info">
        <div className="author">
          <b>@{data.author}</b>
          <button className="subscribe">Подписаться</button>
        </div>
        <p>{data.title}</p>
      </div>

      <div className="actions">
        <button>👍 {likes}</button>
        <button>💬 {comments}</button>
        <button>🔗</button>
        <button>🔄</button>
      </div>
    </div>
  );
}
