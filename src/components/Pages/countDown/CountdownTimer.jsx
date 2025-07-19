import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AnimatedDigit from "./AnimatedDigit";
const CountdownTimer = ({
  targetDate,
  className = "",
  containerClassName = "",
  titleClassName = "",
  digitClassName = "",
  labelClassName = "",
}) => {
  const { t } = useTranslation(); // Hook for translations

  // Function to calculate the time left
  function calculateTimeLeft() {
    const now = new Date();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24)); // Days
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ); // Hours
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      ); // Minutes

      return { days, hours, minutes };
    } else {
      return { days: 0, hours: 0, minutes: 0 };
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, [targetDate]);

  return (
    <div className={`flex flex-col justify-center items-center p-2 ${className}`}>
      <div className={`rounded-xl p-2 ${containerClassName}`} style={{ backgroundColor: '#F6F4F0' }}>
        <h1
          className={`countdown-title font-playfair text-2xl xs:text-3xl sm:text-4xl font-black m-0 tracking-tighter uppercase mb-4 text-center ${titleClassName}`}
        >
          {t("countdown.title")}
        </h1>
        <div
          className={`mt-4 flex flex-wrap gap-2 text-black font-bold ${digitClassName} justify-center items-center`}
        >
          {/* Days */}
          <div className="flex flex-col items-center w-auto">
            <div className="flex">
              <AnimatedDigit digit={timeLeft.days.toString().padStart(3, "0")[0]} />
              <AnimatedDigit digit={timeLeft.days.toString().padStart(3, "0")[1]} />
              <AnimatedDigit digit={timeLeft.days.toString().padStart(3, "0")[2]} />
            </div>
            <span
              className={`text-xs mt-1 ${labelClassName}`}
              style={{ fontSize: "0.6rem" }}
            >
              {t("countdown.days")}
            </span>
          </div>

          <span className="text-black self-center text-lg">:</span>

          {/* Hours */}
          <div className="flex flex-col items-center w-auto">
            <div className="flex">
              <AnimatedDigit digit={timeLeft.hours.toString().padStart(2, "0")[0]} />
              <AnimatedDigit digit={timeLeft.hours.toString().padStart(2, "0")[1]} />
            </div>
            <span
              className={`text-xs mt-1 ${labelClassName}`}
              style={{ fontSize: "0.6rem" }}
            >
              {t("countdown.hours")}
            </span>
          </div>

          <span className="text-black self-center text-lg">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center w-auto">
            <div className="flex">
              <AnimatedDigit digit={timeLeft.minutes.toString().padStart(2, "0")[0]} />
              <AnimatedDigit digit={timeLeft.minutes.toString().padStart(2, "0")[1]} />
            </div>
            <span
              className={`text-xs mt-1 ${labelClassName}`}
              style={{ fontSize: "0.6rem" }}
            >
              {t("countdown.minutes")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
