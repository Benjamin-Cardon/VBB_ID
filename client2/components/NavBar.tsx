import React from "react";

const styles: { NavContainer: React.CSSProperties, NavLogo: React.CSSProperties, BooksImage: React.CSSProperties, NavText: React.CSSProperties } = {
  NavContainer: {
    position: 'absolute', top: '20px', left: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'flex-start', width: '45vw', height: '72px'
  },
  NavLogo: { backgroundImage: 'url("VbbLogo.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', width: '70px', height: '70px', marginLeft: '60px' },
  BooksImage: {
    backgroundImage: 'url("books.png")',
    backgroundSize: 'cover',
    width: '80px',
    height: '110px',
    position: 'fixed',
    top: '-5px',
    left: '0px',
    zIndex: 2
  },
  NavText: { fontSize: '18px', marginLeft: '15px', marginRight: '15px' }
};

function NavBar() {
  return (
    <div id='NavContainer' style={styles.NavContainer}>
      <div id='BooksImage' style={styles.BooksImage}></div>
      <div id='NavLogo' style={styles.NavLogo} />
      <div style={styles.NavText}>Attendance</div>
      <div style={styles.NavText}>Register</div>
      <div style={styles.NavText}>Patrons</div>
    </div>)
}
export default NavBar