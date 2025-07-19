import React, { useEffect, useState } from "react";

const CoffeeStains = () => {
  const [coffeeStains, setCoffeeStains] = useState([]);

  useEffect(() => {
    generateCoffeeStains();
  }, []);

  const generateCoffeeStains = () => {
    const stains = [];
    const stainImages = [
      "/assets/coffee-stain-1.png",
      "/assets/coffee-stain-2.png",
      "/assets/coffee-stain-3.png",
    ];
    const numStains = Math.floor(Math.random() * 2);
    for (let i = 0; i < numStains; i++) {
      stains.push({
        image: stainImages[Math.floor(Math.random() * stainImages.length)],
        position: {
          top: Math.random() * 80 + 10,
          left: Math.random() * 80 + 10,
        },
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.2 + 0.1,
        scale: Math.random() * 0.4 + 0.4,
        zIndex: Math.floor(Math.random() * 2),
      });
    }
    setCoffeeStains(stains);
  };

  return coffeeStains.map((stain, index) => (
    <div
      key={`stain-${index}`}
      className={`
        absolute pointer-events-none mix-blend-multiply
        ${stain.zIndex === 0 ? "z-0" : "z-10"}
        ${
          stain.opacity <= 0.15
            ? "opacity-10"
            : stain.opacity <= 0.25
            ? "opacity-20"
            : "opacity-30"
        }
      `}
      style={{
        top: `${stain.position.top}%`,
        left: `${stain.position.left}%`,
        transform: `rotate(${stain.rotation}deg) scale(${stain.scale})`,
      }}
    >
      <img
        src={stain.image}
        alt=""
        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
      />
    </div>
  ));
};

export default CoffeeStains;