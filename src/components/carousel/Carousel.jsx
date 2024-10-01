import React, { useEffect, useRef, useState } from "react";
import { axiosSlider } from "../../api/axios";
import styles from "./Carousel.module.css";
import ProductPreview from "../productPreview/ProductPreview";

const Carousel = ({
    posts,
    playlistId,
    productData,
    handlePostChange,
    fetchPlaylist,
}) => {
    const [playlistData, setPlaylistData] = useState("");
    const [slide, setSlide] = useState(0);
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
            const nextSlide = slide === playlistData.length - 1 ? 0 : slide + 1;
            setSlide(nextSlide);
            handlePostChange(nextSlide);

            if (nextSlide === 0) {
                fetchPlaylist();
            }
        }, currentSlideDuration);

        return () => clearTimeout(timeoutRef.current);
    }, [slide, playlistData]);

    useEffect(() => {
        // console.log(posts);

        if (posts) {
            setPlaylistData(posts);
        }
    }, [posts]);

    const increaseStats = async (materialId, postId, updatedData) => {
        // console.log(materialId, postId, updatedData);
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

            // console.log(res);
        } catch (err) {
            console.warn(err);
        } finally {
        }
    };

    const getSpentTime = async () => {
        const currentTime = Date.now();
        const timeSpent = currentTime - playStartTime;

        let i = slide - 1 === -1 ? playlistData.length - 1 : slide - 1;

        if (timeSpent >= 1000) {
            const objData = {
                playsCount: 1,
                playsTime: (timeSpent / 1000).toFixed(1),
                fullPlaysCount:
                    playlistData[i].duration * 0.9 * 1000 > timeSpent ? 0 : 1,
            };
            console.log(playlistId, playlistData[i].id, objData);
            increaseStats(playlistId, playlistData[i].id, objData);
        }

        setPlayStartTime(currentTime);
    };

    const handleEnd = () => {
        clearTimeout(timeoutRef.current);
        setSlide(slide === playlistData.length - 1 ? 0 : slide + 1);
    };

    useEffect(() => {
        if (productData) {
            handleEnd();
        }
    }, [productData]);

    return (
        <>
            {productData && <ProductPreview data={productData} />}

            <section className={styles.carousel}>
                {playlistData ? (
                    playlistData.map((el, idx) => {
                        // console.log(el);
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
                                // autoPlay
                                ref={(el) => (videoRef.current[idx] = el)}
                            >
                                <source
                                    src={el.media.data.attributes.url}
                                    type="video/mp4"
                                />
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
            </section>
        </>
    );
};

export default Carousel;
