import { useState, useRef, useEffect } from "react";
import "./CircularSwipeCounter.css";

export default function CircularSwipeCounter({ label, value, onChange, min = 0, max = 10 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const circleRef = useRef(null);

  const radius = 45;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const percent = ((value - min) / (max - min)) * 100;
  const offset = circumference - (percent / 100) * circumference;

  const inputRef = useRef(null);

  // Update local input value when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = circleRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = (angle + 360 + 90) % 360; // Start at top
    const newValue = Math.round((angle / 360) * (max - min) + min);
    onChange(Math.min(max, Math.max(min, newValue)));
  };

  const handleKeyDown = (e) => {
    const step = e.shiftKey ? 5 : 1;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      onChange(Math.min(max, value + step));
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      onChange(Math.max(min, value - step));
    }
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      setInputValue(val);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    if (inputValue !== value) {
      onChange(Math.min(max, Math.max(min, inputValue)));
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const rect = circleRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = (angle + 360 + 90) % 360;
    const newValue = Math.round((angle / 360) * (max - min) + min);
    onChange(Math.min(max, Math.max(min, newValue)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleInputFocus = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };
  

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    }
  
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
    
  

  return (
    <div className="circular-counter" tabIndex={0} onKeyDown={handleKeyDown}>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        ref={circleRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#000000"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#661069"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />

        {isEditing ? (
          <foreignObject x="35" y="38" width="50" height="30">
            <input
              ref={inputRef}
              className="circle-input"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
              min={min}
              max={max}
            />
          </foreignObject>
        ) : (
          <text
            x="60"
            y="65"
            textAnchor="middle"
            fontSize="20"
            fill="#333"
            onClick={() => setIsEditing(true)}
            style={{ cursor: "pointer" }}
          >
            {value}
          </text>
        )}
      </svg>
      <label className="circular-label">{label}</label>
    </div>
  );
}
