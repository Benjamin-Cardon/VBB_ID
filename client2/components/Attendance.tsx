import React from "react";
const styles: {
  AttendanceFrame: React.CSSProperties, AttendanceLogin: React.CSSProperties, AttendanceTitle: React.CSSProperties, AttendanceInput: React.CSSProperties; AttendanceButton: React.CSSProperties
} = {
  AttendanceFrame: { width: '100vw', height: '100vh', backgroundImage: 'url("background2.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  AttendanceLogin: { width: '25%', height: '30%', borderRadius: '15px', backdropFilter: 'blur(10.4px)', backgroundColor: 'rgba(255, 255, 255, 0.35)', boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', zIndex: '1' },
  AttendanceTitle: { color: 'black', fontWeight: 'bold', fontSize: '36px', marginBottom: '20px', textAlign: 'center', },
  AttendanceInput: {
    boxSizing: 'border-box',
    padding: '10px',
    marginBottom: '10px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  AttendanceButton: {
    padding: '10px 20px',
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    width: '100%',
  }
};

function Attendance() {
  return (
    <div id='AttendanceFrame' style={styles.AttendanceFrame}>
      <div id='AttendanceLogin' style={styles.AttendanceLogin}>
        <h2 id='AttendanceTitle' style={styles.AttendanceTitle}> Attendance
        </h2>
        <input id='PatronCode' style={styles.AttendanceInput}></input>
        <button id='AttendanceButton' style={styles.AttendanceButton}>I am Here!</button>
      </div>
    </div >)
}

export default Attendance