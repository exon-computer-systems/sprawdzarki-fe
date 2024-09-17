import { useRef, useEffect } from "react";
import styles from "./Slider.module.css";

const Slider = () => {
  const data = [
    {
      name: "makita",
      image: "https://i.ytimg.com/vi/OM_2fAM2_1Q/maxresdefault.jpg",
    },
    {
      name: "Bosch",
      image:
        "https://newspaperads.ads2publish.com/wp-content/uploads/2017/12/bosch-our-love-for-appliances-shows-in-our-service-ad-oheraldo-goa-16-12-2017.jpg",
    },
    {
      name: "bosch",
      image:
        "https://www.bosch-homecomfort.com/us/media/country_pool/images/bhcp_header_with_badge_1600x640original.jpg",
    },
  ];

  const ref = useRef(null);
  const intervalRef = useRef(null);

  const slider = () => {
    intervalRef.current = setInterval(() => {
      if (ref.current) {
        const sectionWidth = ref.current.clientWidth;

        ref.current.scrollLeft += sectionWidth;

        if (ref.current.scrollLeft >= ref.current.scrollWidth - sectionWidth) {
          ref.current.scrollLeft = 0;
        }
      }
    }, 3000);
  };

  useEffect(() => {
    slider();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <section ref={ref} className={styles.container}>
      {data.map((el, i) => (
        <section className={styles.wrapper} key={i}>
          <img className={styles.img} src={el.image} alt={el.name} />
        </section>
      ))}
    </section>
  );
};

export default Slider;
