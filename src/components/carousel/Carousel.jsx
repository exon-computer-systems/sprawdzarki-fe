import React, { useEffect, useRef, useState } from "react";
import { axiosSlider } from "../../api/axios";
import styles from "./Carousel.module.css";
import ProductPreview from "../productPreview/ProductPreview";

const Carousel = ({ posts, playlistId, productData }) => {
    const MEDIA_URL = "http://192.168.68.247:1338";

    const [playlistData, setPlaylistData] = useState("");
    const [slide, setSlide] = useState(0);
    const [delay, setDelay] = useState(0);
    const [playStartTime, setPlayStartTime] = useState(Date.now());

    const videoRef = useRef([]);
    const timeoutRef = useRef(0);

    useEffect(() => {
        if (!playlistData) return;

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
    }, [slide, playlistData]);

    useEffect(() => {
        if (posts) {
            setPlaylistData(posts);
        }
    }, [posts]);

    const increaseStats = async (materialId, postId, updatedData) => {
        try {
            const materialResponse = await axiosSlider.get(
                `/api/materials/${materialId}?populate=posts`
            );

            const materialData = materialResponse.data.data.attributes;

            const updatedPosts = materialData.posts.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        playsCount:
                            post.playsCount +
                            parseInt(updatedData.playsCount || 0),
                        playsTime:
                            post.playsTime +
                            parseInt(updatedData.playsTime || 0),
                        fullPlaysCount:
                            post.fullPlaysCount +
                            parseInt(updatedData.fullPlaysCount || 0),
                    };
                }
                return post;
            });

            const res = await axiosSlider.put(`/api/materials/${materialId}`, {
                data: {
                    posts: updatedPosts,
                },
            });
        } catch (err) {
            console.warn(err);
        }
    };

    const getSpentTime = async () => {
        const currentTime = Date.now();
        const timeSpent = currentTime - playStartTime;

        let i = slide - 1 === -1 ? playlistData.length - 1 : slide - 1;

        if (timeSpent >= 1000) {
            const objData = {
                playsCount: 1,
                playsTime: (timeSpent / 1000 - (delay > 0 ? delay : 0)).toFixed(
                    1
                ),
                fullPlaysCount:
                    playlistData[i].duration * 0.9 * 1000 > timeSpent ? 0 : 1,
            };
            console.log(playlistId, playlistData[i].id, objData);
            increaseStats(playlistId, playlistData[i].id, objData);
            setDelay(0);
        }

        setPlayStartTime(currentTime);
    };

    const handleEnd = () => {
        console.log("test");
        clearTimeout(timeoutRef.current);
        setSlide(slide === playlistData.length - 1 ? 0 : slide + 1);
    };

    useEffect(() => {
        if (productData) {
            handleEnd();
        }
    }, [productData]);

    useEffect(() => {
        window.handleData = () => {
            clearTimeout(timeoutRef.current);
            setDelay(5);
            setTimeout(
                () =>
                    setSlide(slide === playlistData.length - 1 ? 0 : slide + 1),
                5000
            );
        };
    });

    return (
        <>
            {/* {productData && <ProductPreview data={productData} />} */}

            <section className={styles.carousel}>
                {playlistData ? (
                    playlistData.map((el, idx) => {
                        return !el.isVideo ? (
                            <img
                                key={el.id}
                                src={MEDIA_URL + el.media.data.attributes.url}
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
                                // autoPlay
                                ref={(el) => (videoRef.current[idx] = el)}
                            >
                                <source
                                    src={
                                        MEDIA_URL + el.media.data.attributes.url
                                    }
                                    type="video/mp4"
                                />
                            </video>
                        );
                    })
                ) : (
                    <p>Ładowanie materiałów</p>
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
            </section>
        </>
    );
};

export default Carousel;
