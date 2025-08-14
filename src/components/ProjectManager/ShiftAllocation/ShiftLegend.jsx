// ShiftLegend.jsx
import { color } from "echarts";
import React from "react";

const shifts = [
  { label: "α", time: "11:30 AM – 8:30 PM", color: "#aee9ff" },
  { label: "β", time: "1:00 PM – 10:00 PM", color: "#c9e384" },
  { label: "γ", time: "2:30 PM – 11:30 PM", color: "#d7c6f1" },
  { label: "δ", time: "6:30 PM – 3:30 AM", color: "#f8e7c6" },
  { label: "WO", time: "Week Off", color: "#ffd966" },
  { label: "Holiday", time: "Holiday", color: "#74c476" },
];

const ShiftLegend = () => {
  return (
    <div style={styles.container}>
      {shifts.map((shift, index) => (
        <div key={index} style={styles.row}>
          <div
            style={{
              ...styles.colorBox,
              backgroundColor: shift.color,
            }}
          >
            {shift.label}
          </div>
          <div style={styles.text}>{shift.time}</div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "transparent",
    padding: "16px",
    borderRadius: "8px",
    width: "fit-content",
    fontFamily: "Arial, sans-serif",
    color: "black",
  },
  row: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  colorBox: {
    minWidth: "50px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "8px",
    borderRadius: "4px",
    fontWeight: "bold",
  },
  text: {
    fontSize: "14px",
    color: "white",
    fontWeight: "normal",
    textTransform: "capitalize",
  },
};

export default ShiftLegend;
