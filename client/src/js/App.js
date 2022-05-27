import React/* , { useEffect } */ from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import '../css/common_style.css';
import Body from './Body.js';
import Footer from './Footer.js';

function App() {
  const logo = 'PHP to JSP Converter';

  /* useEffect(() => {
    console.log("try To start DB Connect");
    conConnect().then(val => console.log("end\n"+val)).catch(err => console.log("error ocurred\n"+err));
    

    return () => {
      
    };
  }, []); */
  

  /* async function conConnect() {
    const result = await fetch('/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const body = await result.text();
  } */


  return (
    <div className='Box'>
      <header>
        <h1>{logo}</h1>
      </header>
      <BrowserRouter>
        <div className='topNav'>
          <Link to='/a' className='nav1'>A</Link>
          <Link to='/b' className='nav2'>B</Link>
          <Link to='/c' className='nav3'>C</Link>
        </div>
        <div className='Content'>
          <Body />
        </div>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
