import React from "react";

const styles: { LoginFrame: React.CSSProperties; LoginPanel: React.CSSProperties; LoginTitle: React.CSSProperties; LoginInput: React.CSSProperties; LoginButton: React.CSSProperties } = {
  // @ts-ignore
  LoginFrame: { width: '100vw', height: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', backgroundImage: 'url("background1.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backdropFilter: 'blur(10px)', zIndex: '-1' },
  LoginPanel: {
    justifySelf: 'center', width: '30%', height: '40%', borderRadius: '15px', backdropFilter: 'blur(10.4px)', backgroundColor: 'rgba(255, 255, 255, 0.35)', boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', zIndex: '1'
  },
  LoginTitle: { color: 'black', fontWeight: 'bold', fontSize: '36px', marginBottom: '20px', textAlign: 'center', },
  LoginInput: {
    boxSizing: 'border-box',
    padding: '10px',
    marginBottom: '10px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  LoginButton: {
    padding: '10px 20px',
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    width: '100%',
  }
}
function LibrarianLogin() {
  return (
    <div id='LibrarianLoginFrame' style={styles.LoginFrame}>
      <div id='LibrarianLoginPanel' style={styles.LoginPanel}>
        <h2 id='LibrarianLoginTitle' style={styles.LoginTitle}>Librarian Login</h2>
        <input id='LibrarianLoginUsername' style={styles.LoginInput}></input>
        <input id='LibrarianLoginPassword' style={styles.LoginInput}></input>
        <select id='LibrarianLoginSelectLibrary' style={styles.LoginInput}>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </select>
        <button style={styles.LoginButton}>Login</button>
      </div>
    </div>)
}

export default LibrarianLogin;