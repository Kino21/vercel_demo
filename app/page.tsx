"use client";

import { useState } from 'react';

export default function Home() {
  const [items, setItems] = useState<string[]>(['항목 1', '항목 2', '항목 3', '항목 4', '항목 5', '항목 6']);
  const [newItem, setNewItem] = useState<string>('');
  const [rotation, setRotation] = useState<number>(0);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const addItem = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (itemToRemove: string) => {
    setItems(items.filter(item => item !== itemToRemove));
  };

  const spin = () => {
    if (spinning || items.length === 0) return;

    setSpinning(true);
    setSelectedItem(null);

    const totalItems = items.length;
    const randomDegree = Math.floor(Math.random() * 360);
    const extraRotations = 360 * 5; // 5바퀴 추가 회전
    const newRotation = rotation + extraRotations + randomDegree;

    setRotation(newRotation);

    setTimeout(() => {
      // 수학적 계산을 통한 정확한 선택 알고리즘
      const finalRotation = newRotation % 360;
      const sliceAngle = 360 / totalItems;

      // 포인터는 12시 방향(0도)에 고정되어 있음
      // 룰렛이 시계방향으로 회전하므로, 포인터 기준에서 역방향으로 계산
      // 첫 번째 항목은 12시~1시 방향에 위치하므로 오프셋 적용
      let pointerAngle = (360 - finalRotation + (sliceAngle / 2)) % 360;

      // 음수 각도를 양수로 변환
      if (pointerAngle < 0) {
        pointerAngle += 360;
      }

      // 선택된 항목의 인덱스 계산
      const selectedIndex = Math.floor(pointerAngle / sliceAngle) % totalItems;

      console.log('Final rotation:', finalRotation);
      console.log('Slice angle:', sliceAngle);
      console.log('Pointer angle:', pointerAngle);
      console.log('Selected index:', selectedIndex);
      console.log('Selected item:', items[selectedIndex]);

      setSelectedItem(items[selectedIndex]);
      setSpinning(false);
    }, 5000); // 5초 동안 회전
  };

  const getSliceColor = (index: number) => {
    // 각 항목별로 구별되는 고유 색상 (RGB 값이 충분히 다른 색상들)
    const colors = [
      '#FF0000', // 빨강
      '#00FF00', // 초록
      '#0000FF', // 파랑
      '#FFFF00', // 노랑
      '#FF00FF', // 마젠타
      '#00FFFF', // 시안
      '#FF8000', // 주황
      '#8000FF', // 보라
      '#FF0080', // 분홍
      '#80FF00', // 라임
      '#0080FF', // 하늘색
      '#FF8080'  // 연빨강
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="container">
      <h1>룰렛 게임</h1>
      <div className="roulette-container">
        <div
          className="roulette"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
          }}
        >
          {items.map((item, index) => {
            const sliceAngle = 360 / items.length;
            const rotateAngle = sliceAngle * index;

            return (
              <div
                key={item}
                className="slice"
                style={{
                  transform: `rotate(${rotateAngle}deg) skewY(${90 - sliceAngle}deg)`,
                  backgroundColor: getSliceColor(index)
                }}
              >
                <span style={{
                  transform: `skewY(${-(90 - sliceAngle)}deg) rotate(${sliceAngle / 2}deg)`,
                  display: 'block'
                }}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>
        <div className="pointer"></div>
      </div>

      {selectedItem && !spinning && (
        <div className="result">
          선택된 항목: <strong>{selectedItem}</strong>
        </div>
      )}

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
              <button onClick={() => removeItem(item)}>삭제</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
