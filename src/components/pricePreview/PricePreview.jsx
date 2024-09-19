import styles from "./PricePreview.module.css";
const PricePreview = ({ handleEnd }) => {
  const api = `http://swpl0003001.store.obi.net:8080/Kis/priceCheck.do?eaninput=${3399318}&mode=pricecheck`;
  const [barcodeData, setBarcodeData] = useState(""); // Stan do przechowywania danych skanera

  useEffect(() => {
    let scannedValue = "";
    const handleKeyDown = event => {
      // Zakończenie skanowania: DataWedge zwykle wysyła 'Enter' po zeskanowaniu
      if (event.key === "Enter") {
        handleEnd(scannedValue); // Wywołaj funkcję przekazaną do komponentu
        setBarcodeData(scannedValue); // Ustaw dane skanera w stanie
        scannedValue = ""; // Zresetuj tymczasowy bufor
      } else {
        scannedValue += event.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleEnd]);

  return (
    <section className={styles.container}>
      <section className={styles.wrapper}>
        <h2>Wiertarka Makita</h2>
        <span>250.00zł</span>
      </section>
    </section>
  );
};

export default PricePreview;

import React, { useEffect, useState } from "react";
