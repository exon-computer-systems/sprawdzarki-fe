import Slider from "./components/slider/Slider";
import "./App.css";
import axios from "axios";
import Carousel from "./components/carousel/Carousel";

import { slides } from "./data/carouselData.json";
import { useEffect, useState } from "react";
import PricePreview from "./components/pricePreview/PricePreview";
// import PricePreview from "./components/pricePreview/PricePreview";

const App = () => {
    const [myPlaylist, setMyPlaylist] = useState({});
    const [paused, setPaused] = useState(false); // New state to handle pause

    // Intercept the scanner API call
    // function triggerScanner() {
    //     fetch(
    //         `http://swpl0003001.store.obi.net:8080/Kis/priceCheck.do?eaninput=${3399318}&mode=pricecheck`,
    //         { method: "POST" }
    //     )
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (data.success) {
    //                 onScan(); // Trigger the scan event
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Scanner API call failed", error);
    //         });
    // }

    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await axios.get(
                    // "http://192.168.68.172:8000/api/materials?populate=posts.media"
                    "http://localhost:1338/api/materials?populate=posts.media"
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
            {myPlaylist?.attributes?.posts ? (
                <Carousel
                    paused={paused}
                    setPaused={setPaused}
                    data={slides}
                    posts={myPlaylist.attributes.posts}
                    playlistId={myPlaylist.id}
                />
            ) : (
                <p>Loading</p>
            )}
        </div>
    );
};

export default App;
