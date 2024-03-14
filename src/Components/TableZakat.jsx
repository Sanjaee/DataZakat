import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Utils/Api";
import "../Styles/TableZakat.css";

const TableZakat = () => {
  const [zakat, setZakat] = useState([]);
  const [totalBerasCount, setTotalBerasCount] = useState(0);
  const [totalUangCount, setTotalUangCount] = useState(0);
  const [totalPriaCount, setTotalPriaCount] = useState(0);
  const [totalWanitaCount, setTotalWanitaCount] = useState(0);
  const [totalAllData, setTotalAllData] = useState(0);
  const [jakartaTime, setJakartaTime] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0); // Indeks tabel saat ini
  const [maxIndex, setMaxIndex] = useState(0); // Indeks maksimum tabel
  const [searchTerm, setSearchTerm] = useState("");

  // Define handleSearch outside of useEffect
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const zakatCollection = collection(db, "datazakat");
      const zakatSnapshot = await getDocs(zakatCollection);
      const zakatData = zakatSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate total counts for "beras", "uang", "pria", and "wanita"
      const berasCount = zakatData.reduce((total, data) => {
        return data.item === "beras" ? total + parseFloat(data.count) : total;
      }, 0);

      const uangCount = zakatData.reduce((total, data) => {
        return data.item === "uang" ? total + parseFloat(data.count) : total;
      }, 0);

      const priaCount = zakatData.filter(
        (data) => data.gender === "pria"
      ).length;
      const wanitaCount = zakatData.filter(
        (data) => data.gender === "wanita"
      ).length;

      // Calculate total count for all items
      const allDataCount = zakatData.length; // Use length property

      setTotalBerasCount(berasCount);
      setTotalUangCount(uangCount);
      setTotalPriaCount(priaCount);
      setTotalWanitaCount(wanitaCount);
      setTotalAllData(allDataCount);
      setZakat(zakatData);

      // Menghitung indeks maksimum tabel
      setMaxIndex(Math.ceil(zakatData.length / 10) - 1);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setJakartaTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatTime = (time) => {
    const options = {
      timeZone: "Asia/Jakarta",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    const formattedTime = time.toLocaleString("id-ID", options);
    const hours = time.getHours();

    let period;
    if (hours >= 5 && hours < 11) {
      period = "Selamat Pagi";
    } else if (hours >= 11 && hours < 15) {
      period = "Selamat Siang";
    } else if (hours >= 15 && hours < 18) {
      period = "Selamat Sore";
    } else {
      period = "Selamat Malam";
    }

    return `${formattedTime} ${period}`;
  };

  const goToNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-title">
        <div className="jam_container">
          <p className="jam">{formatTime(jakartaTime)}</p>
        </div>
        <h1>List Daftar Zakat</h1>
        <p>
          Total Jumblah Beras: <b>{totalBerasCount} Liter</b>
        </p>
        <p>
          Total Jumblah Uang: <b>{formatRupiah(totalUangCount)}</b>
        </p>
        <p>
          Total Jumblah Pria: <b>{totalPriaCount}</b>
        </p>
        <p>
          Total Jumblah Wanita: <b>{totalWanitaCount}</b>
        </p>
        <p>
          Total Semua Data: <b>{totalAllData}</b>{" "}
        </p>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Item</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {zakat
            .filter((data) =>
              data.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(currentIndex * 10, (currentIndex + 1) * 10)
            .map((data, index) => (
              <tr key={data.id}>
                <td>{currentIndex * 10 + index + 1}</td>
                <td>{data.name}</td>
                <td>{data.gender}</td>
                <td>{data.item}</td>
                <td>{formatRupiah(data.count)}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* Navigasi panah kiri dan kanan */}
      <div className="navigation">
        <button onClick={goToPrev} disabled={currentIndex === 0}>
          &#8678; Prev
        </button>
        <button onClick={goToNext} disabled={currentIndex === maxIndex}>
          Next &#8680;
        </button>
      </div>
      <footer>
        <p>&copy; 2024 - zakatdasbord By EZ4</p>
      </footer>
    </div>
  );
};

export default TableZakat;
