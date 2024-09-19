import React, { useEffect, useRef, useState } from "react";
import styles from "./Carousel.module.css";
import PricePreview from "../pricePreview/PricePreview";

const Carousel = ({ paused, setPaused, data, posts }) => {
  const [playlistData, setPlaylistData] = useState("");
  const [slide, setSlide] = useState(0);
  const [playStartTime, setPlayStartTime] = useState(Date.now());

  const videoRef = useRef([]);
  const timeoutRef = useRef(0);

  useEffect(() => {
    if (!playlistData || paused) return; // Skip if paused

    if (playlistData.length) {
      getSpentTime();
    }

    const currentSlideDuration = playlistData[slide]?.duration * 1000;

    if (playlistData[slide]?.isVideo && videoRef.current[slide]) {
      videoRef.current[slide].currentTime = 0;
      videoRef.current[slide].play();
    }

    timeoutRef.current = setTimeout(() => {
      setSlide(slide === playlistData.length - 1 ? 0 : slide + 1);
    }, currentSlideDuration);

    return () => clearTimeout(timeoutRef.current);
  }, [slide, playlistData, paused]); // Added `paused` to dependencies

  useEffect(() => {
    if (posts) {
      setPlaylistData(posts);
    }
  }, [posts]);

  const getSpentTime = async () => {
    const currentTime = Date.now();
    const timeSpent = currentTime - playStartTime;

    let i = slide - 1 === -1 ? playlistData.length - 1 : slide - 1;

    if (timeSpent >= 1000) {
      console.log({
        playCount: 1,
        playTime: (timeSpent / 1000).toFixed(1),
        fullPlayCount:
          playlistData[i].duration * 0.9 * 1000 > timeSpent ? 0 : 1,
      });
    }

    setPlayStartTime(currentTime);
  };

  const handleEnd = () => {
    setPaused(true);
    setInterval(() => {
      setPaused(false);
    }, 5000);
    clearTimeout(timeoutRef.current);
    setSlide(slide === playlistData.length - 1 ? 0 : slide + 1);
  };

  return (
    <>
      {paused ? (
        <PricePreview handleEnd={handleEnd} />
      ) : (
        <section className={styles.carousel}>
          {playlistData ? (
            playlistData.map((el, idx) => {
              return !el.isVideo ? (
                <img
                  key={el.id}
                  src={el.media.data.attributes.url}
                  alt={el.title}
                  className={
                    slide === idx
                      ? styles.slide
                      : `${styles.slide} ${styles.slide_hidden}`
                  }
                />
              ) : (
                <video
                  key={el.id}
                  className={
                    slide === idx
                      ? styles.slide
                      : `${styles.slide} ${styles.slide_hidden}`
                  }
                  muted
                  ref={el => (videoRef.current[idx] = el)}
                >
                  <source src={el.media.data.attributes.url} type="video/mp4" />
                </video>
              );
            })
          ) : (
            <p>loading...</p>
          )}

          <span className={styles.indicators}>
            {playlistData &&
              playlistData.map((_, idx) => {
                return (
                  <button
                    key={idx}
                    className={
                      slide === idx
                        ? styles.indicator
                        : `${styles.indicator} ${styles.indicator_inactive}`
                    }
                    onClick={() => {
                      setSlide(idx);
                    }}
                  ></button>
                );
              })}
          </span>

          {/* Button to simulate scanner event for demo purposes */}
          <button onClick={handleEnd}>Pause</button>
        </section>
      )}
    </>
  );
};

export default Carousel;
