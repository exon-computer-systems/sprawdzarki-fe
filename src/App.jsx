import Slider from "./components/slider/Slider";
import "./App.css";
import axios from "axios";
import { axiosSlider, axiosProduct } from "./api/axios";
import Carousel from "./components/carousel/Carousel";

import { slides } from "./data/carouselData.json";
import { useEffect, useRef, useState } from "react";
import PricePreview from "./components/pricePreview/PricePreview";
import Dashboard from "./components/dashboard/Dashboard";
import Statistics from "./components/dashboard/Dashboard";
// import PricePreview from "./components/pricePreview/PricePreview";

const App = () => {
    const [myPlaylist, setMyPlaylist] = useState({});
    const [paused, setPaused] = useState(false); // New state to handle pause
    const [productEan, setProductEan] = useState("");
    const [productData, setProductData] = useState("");
    const inputRef = useRef(0);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await axiosSlider.get(
                    "/api/materials?populate=posts.media"
                    // "http://192.168.68.172:8000/api/materials?populate=posts.media"
                );

                if (res) {
                    const activeItems = res.data.data.find(
                        (item) => item.attributes.isActive === true
                    );

                    console.log("Active Items:", activeItems);

                    if (activeItems) {
                        setMyPlaylist(activeItems);
                    }
                }
            } catch (err) {
                console.warn(err);
            }
        };

        getPosts();

        inputRef.current.focus();
    }, []);

    // getting data of scanned product
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // zmienic link na srodowisko testowe
            const res = await axios.get(
                "https://thetestrequest.com/authors/1.xml",
                {
                    responseType: "text",
                }
            );
            const parser = new DOMParser();
            const xml = parser.parseFromString(res.data, "application/xml");
            // console.log(xml);
            // console.log(xml.querySelector("name").textContent);

            setProductData({
                plu: "Piec Stalowy",
                vk: 5499.0,
                ean: 3399318,
                rabatt: 0,
                errorcode: 0,
                errordesc: "Success.",

                // plu: xml.querySelector("plu").textContent,
                // vk: xml.querySelector("vk").textContent,
                // ean: xml.querySelector("ean").textContent,
                // rabatt: xml.querySelector("rabatt").textContent,
                // errorcode: xml.querySelector("errorcode").textContent,
                // errordesc: xml.querySelector("errordesc").textContent,
            });

            // setProductData({
            //     plu: xml.querySelector("name").textContent,
            //     vk: xml.querySelector("email").textContent,
            // });

            console.log(productData);
        } catch (err) {
            console.warn(err);
        } finally {
            setProductEan("");
            setTimeout(() => setProductData(""), 5000);
        }
    };

    return (
        <div className="app">
            {/* <Statistics /> */}

            {myPlaylist?.attributes?.posts ? (
                <Carousel
                    paused={paused}
                    setPaused={setPaused}
                    data={slides}
                    posts={myPlaylist.attributes.posts}
                    playlistId={myPlaylist.id}
                    productData={productData}
                />
            ) : (
                <p>Loading</p>
            )}

            <form className="hidden-form" onSubmit={handleSubmit}>
                <input
                    className="hidden-input"
                    value={productEan}
                    onChange={(e) => setProductEan(e.target.value)}
                    type="text"
                    ref={inputRef}
                    // aria-hidden="true"
                />
            </form>
        </div>
    );
};

export default App;
