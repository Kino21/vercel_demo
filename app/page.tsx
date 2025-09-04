"use client";

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [items, setItems] = useState<string[]>(['떡볶이', '돈가스', '초밥', '피자', '냉면', '치킨', '족발', '삼겹살']);
  const [newItem, setNewItem] = useState<string>('');
  const [spinning, setSpinning] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);

  const colors = [
    "#dc0936",
    "#e6471d",
    "#f7a416",
    "#efe61f",
    "#60b236",
    "#209b6c",
    "#169ed8",
    "#0d66e4",
    "#87207b",
    "#be107f",
    "#e7167b"
  ];

  const drawRoulette = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 반응형 캔버스 크기 설정
    const containerWidth = Math.min(350, window.innerWidth - 80); // 모바일 고려
    canvas.width = containerWidth;
    canvas.height = containerWidth;

    const [cw, ch] = [canvas.width / 2, canvas.height / 2];
    const arc = (2 * Math.PI) / items.length;

    // 배경 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 룰렛 조각들 그리기
    for (let i = 0; i < items.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(cw, ch);
      ctx.arc(cw, ch, cw - 2, arc * i - Math.PI / 2, arc * (i + 1) - Math.PI / 2);
      ctx.fill();
      ctx.closePath();
    }

    // 텍스트 그리기 (크기 조정)
    ctx.fillStyle = "#fff";
    const fontSize = Math.max(12, containerWidth / 25); // 반응형 폰트 크기
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";

    for (let i = 0; i < items.length; i++) {
      const angle = arc * i + arc / 2 - Math.PI / 2;

      ctx.save();

      ctx.translate(
        cw + Math.cos(angle) * (cw - 50),
        ch + Math.sin(angle) * (ch - 50)
      );

      ctx.rotate(angle + Math.PI / 2);

      // 텍스트를 여러 줄로 나누어 그리기
      items[i].split(" ").forEach((text, j) => {
        ctx.fillText(text, 0, fontSize * 1.5 * j);
      });

      ctx.restore();
    }

    // 중앙 원 그리기
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(cw, ch);
    ctx.arc(cw, ch, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  };

  const addItem = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (itemToRemove: string) => {
    if (items.length > 2) {
      setItems(items.filter(item => item !== itemToRemove));
    }
  };

  const spin = () => {
    if (spinning || items.length === 0) return;

    setSpinning(true);
    setSelectedItem(null);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 초기 상태로 리셋
    canvas.style.transform = 'initial';
    canvas.style.transition = 'initial';

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * items.length);
      const arc = 360 / items.length;

      // 선택된 항목이 12시 방향(포인터)에 오도록 계산
      const targetRotation = (360 - arc * (randomIndex + 1) + 3600) + (arc / 3);

      setRotation(targetRotation);

      canvas.style.transform = `rotate(${targetRotation}deg)`;
      canvas.style.transition = '3s cubic-bezier(0.25, 0.1, 0.25, 1)';

      setTimeout(() => {
        setSelectedItem(items[randomIndex]);
        setSpinning(false);
      }, 3000);
    }, 1);
  };

  useEffect(() => {
    drawRoulette();
  }, [items]);

  useEffect(() => {
    const handleResize = () => {
      drawRoulette();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items]);

  return (
    <div className="container">
      <h1>룰렛 게임</h1>

      <div className="roulette-container">
        <canvas
          ref={canvasRef}
          className="roulette-canvas"
        />
        <div className="pointer"></div>
      </div>

      <div className="result">
        선택된 항목: <strong>{selectedItem || '아직 선택되지 않음'}</strong>
      </div>

      <button onClick={spin} disabled={spinning || items.length < 2}>
        {spinning ? '돌아가는 중...' : '룰렛 돌리기'}
      </button>

      <div className="item-management">
        <h2>항목 관리</h2>
        <div className="add-item">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="새 항목 추가"
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          <button onClick={addItem}>추가</button>
        </div>
        <ul>
          {items.map(item => (
            <li key={item}>
              {item}
              {items.length > 2 && (
                <button onClick={() => removeItem(item)}>삭제</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}