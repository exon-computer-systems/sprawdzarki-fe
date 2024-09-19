import Slider from "./components/slider/Slider";
import "./App.css";
import axios from "axios";
import Carousel from "./components/carousel/Carousel";

import { slides } from "./data/carouselData.json";
import { useEffect, useState } from "react";

const App = () => {
    const [myPlaylist, setMyPlaylist] = useState({});

    const increaseStats = async (materialId, postId, updatedData) => {
        try {
            const materialResponse = await axios.get(
                `http://http://192.168.68.172:8000/api/materials/${materialId}?populate=posts`
            );
            const materialData = materialResponse.data.data.attributes;

            const updatedPosts = materialData.posts.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        playsCount:
                            post.playsCount + (updatedData.playsCount || 0),
                        playsTime:
                            post.playsTime + (updatedData.playsTime || 0),
                        fullPlaysCount:
                            post.fullPlaysCount +
                            (updatedData.fullPlaysCount || 0),
                    };
                }
                return post;
            });

            const res = await axios.put(
                `http://http://192.168.68.172:1337/api/materials/${materialId}`,
                {
                    data: {
                        posts: updatedPosts,
                    },
                }
            );

            console.log(res);
        } catch (err) {
            console.warn(err);
        } finally {
        }
    };

    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await axios.get(
                    "http://192.168.68.172:8000/api/materials?populate=posts.media"
                );

                if (res) {
                    const activeItems = res.data.data.find(
                        (item) => item.attributes.isActive === true
                    );

                    console.log("Active Items:", activeItems);

                    if (activeItems) {
                        setMyPlaylist(activeItems); // Ustawienie stanu
                    }
                }
            } catch (err) {
                console.warn(err);
            }
        };

        getPosts();
    }, []);

    return (
        <div className="app">
            {/* <Slider /> */}
            {myPlaylist?.attributes?.posts ? (
                <Carousel data={slides} posts={myPlaylist.attributes.posts} />
            ) : (
                // <p>lol</p>
                <p>Loading</p>
            )}

            {/* <button
                style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    width: "200px",
                    height: "50px",
                }}
                onClick={() =>
                    increaseStats(1, 10, {
                        playsCount: 1,
                        playsTime: 10,
                        fullPlaysCount: 1,
                    })
                }
            >
                Test
            </button> */}
        </div>
    );
};

export default App;
