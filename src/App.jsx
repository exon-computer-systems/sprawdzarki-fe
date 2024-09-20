import Slider from "./components/slider/Slider";
import "./App.css";
import axios from "axios";
import Carousel from "./components/carousel/Carousel";

import { slides } from "./data/carouselData.json";
import { useEffect, useState } from "react";
import PricePreview from "./components/pricePreview/PricePreview";
import Statistics from "./components/statistics/Statistics";
// import PricePreview from "./components/pricePreview/PricePreview";

const App = () => {
  const [myPlaylist, setMyPlaylist] = useState({});
  const [paused, setPaused] = useState(false); // New state to handle pause

  // Intercept the scanner API call
  function triggerScanner() {
    fetch(
      `http://swpl0003001.store.obi.net:8080/Kis/priceCheck.do?eaninput=${3399318}&mode=pricecheck`,
      { method: "POST" }
    )
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          onScan(); // Trigger the scan event
        }
      })
      .catch(error => {
        console.error("Scanner API call failed", error);
      });
  }

  const increaseStats = async (materialId, postId, updatedData) => {
    try {
      const materialResponse = await axios.get(
        `http://localhost:1338/api/materials/${materialId}?populate=posts`
        // `http://http://192.168.68.172:8000/api/materials/${materialId}?populate=posts`
      );
      const materialData = materialResponse.data.data.attributes;

      const updatedPosts = materialData.posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            playsCount: post.playsCount + (updatedData.playsCount || 0),
            playsTime: post.playsTime + (updatedData.playsTime || 0),
            fullPlaysCount:
              post.fullPlaysCount + (updatedData.fullPlaysCount || 0),
          };
        }
        return post;
      });

      const res = await axios.put(
        `http://localhost:1338/api/materials/${materialId}`,
        // `http://http://192.168.68.172:8000/api/materials/${materialId}`,
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
          "http://localhost:1338/api/materials?populate=posts.media"
          // "http://192.168.68.172:8000/api/materials?populate=posts.media"
        );

        if (res) {
          const activeItems = res.data.data.find(
            item => item.attributes.isActive === true
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
      <Statistics />
      {/* <Slider /> */}
      {/* <PricePreview /> */}

      {/* {myPlaylist?.attributes?.posts ? (
        <Carousel
          paused={paused}
          setPaused={setPaused}
          data={slides}
          posts={myPlaylist.attributes.posts}
        />
      ) : (
        <p>Loading</p>
      )} */}

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
