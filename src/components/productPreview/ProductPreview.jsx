import React from "react";
import styles from "./ProductPreview.module.css";

const ProductPreview = ({ data }) => {
    return (
        <section className={styles.pp}>
            <section className={styles.pp_content}>
                <h1 className={styles.pp_content_title}>{data.plu}</h1>
                <h2 className={styles.pp_content_price}>
                    {parseFloat(data.vk).toFixed(2) + " zł"}
                </h2>
                <h3 className={styles.pp_content_discount}>
                    {data.rabatt !== 0 && data.rabatt}
                </h3>
            </section>
        </section>
    );
};

export default ProductPreview;
