import "./App.css";
import axios from "axios";
import { axiosSlider, axiosProduct } from "./api/axios";
import Carousel from "./components/carousel/Carousel";

import { useEffect, useRef, useState } from "react";
import Statistics from "./components/dashboard/Dashboard";
// import PricePreview from "./components/pricePreview/PricePreview";

const App = () => {
    const [myPlaylist, setMyPlaylist] = useState({});
    const [productEan, setProductEan] = useState("");

    // const [productData, setProductData] = useState({
    //     plu: "Piec Stalowy",
    //     vk: 5499.0,
    //     ean: 3399318,
    //     rabatt: 0,
    //     errorcode: 0,
    //     errordesc: "Success.",
    // });

    const [currentPostIndex, setCurrentPostIndex] = useState(0);
    // const inputRef = useRef(0);

    const fetchPlaylist = async () => {
        try {
            const res = await axiosSlider.get(
                "/api/materials?populate=posts.media"
            );

            if (res) {
                const activeItems = res.data.data.find(
                    (item) => item.attributes.isActive === true
                );

                // console.log("Active Items:", activeItems);

                if (activeItems) {
                    setMyPlaylist(activeItems);
                    setCurrentPostIndex(0);
                }
            }
        } catch (err) {
            console.warn(err);
        }
    };

    useEffect(() => {
        fetchPlaylist();
    }, []);

    useEffect(() => {
        if (
            myPlaylist?.attributes?.posts &&
            currentPostIndex >= myPlaylist.attributes.posts.length
        ) {
            // If we reached the last post, fetch the playlist again
            fetchPlaylist();
        }
    }, [currentPostIndex, myPlaylist]);

    const handlePostChange = (index) => {
        // Call this when post changes in your carousel
        setCurrentPostIndex(index);
    };

    return (
        <div className="app">
            {/* <Statistics /> */}

            {myPlaylist?.attributes?.posts ? (
                <Carousel
                    posts={myPlaylist.attributes.posts}
                    playlistId={myPlaylist.id}
                    // productData={productData}
                    handlePostChange={handlePostChange}
                    fetchPlaylist={fetchPlaylist}
                />
            ) : (
                <p>Ładowanie materiałów...</p>
            )}
        </div>
    );
};

export default App;
