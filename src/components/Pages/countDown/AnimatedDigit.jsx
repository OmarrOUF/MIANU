import React, { useState, useEffect } from 'react';

const AnimatedDigit = ({ digit }) => {
  const [prevDigit, setPrevDigit] = useState(digit);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (digit !== prevDigit) {
      setPrevDigit(digit);
      setKey(k => k + 1); // Force re-render on digit change
    }
  }, [digit]);

  return (
    <div className="relative h-16 w-9 overflow-hidden bg-[#f6f4f0]">
      {/* Previous digit, animating sliding down */}
      <div
        key={`prev-${key}`}
        className="absolute inset-0 flex items-center justify-center text-3xl text-black animate-slide-down"
      >
        {prevDigit}
      </div>
      {/* Current digit, animating sliding up */}
      <div
        key={`current-${key}`}
        className="absolute inset-0 flex items-center justify-center text-3xl text-black animate-slide-up"
      >
        {digit}
      </div>
    </div>
  );
};

export default AnimatedDigit;
