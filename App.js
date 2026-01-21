import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/convert", formData, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("Conversion failed. Please check your server or LibreOffice setup.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      fontFamily: '"Poppins", Arial, sans-serif',
      background: "linear-gradient(135deg, #89f7fe, #66a6ff)",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: 0,
    },
    card: {
      background: "#fff",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      textAlign: "center",
    },
    title: {
      color: "#333",
      marginBottom: "20px",
    },
    input: {
      margin: "10px 0",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      width: "250px",
      fontSize: "14px",
    },
    button: {
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Word to PDF Converter</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Converting..." : "Convert"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
