import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;


// import React from 'react';
// import AppRoutes from './routes/AppRoutes';
// import ThemeProvider from './contexts/ThemeContext';

// function App() {
//   return (
//     <ThemeProvider>
//         <AppRoutes />
//     </ThemeProvider>
//   );
// }

// function App() {
//   return (
//     <div>
//       <AppRoutes />
//     </div>
//   );
// }

// export default App;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// function App() {
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const fetchMessage = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/`); // Proxy will redirect this to the backend
//         setMessage(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchMessage();
//   }, []);

//   return (
//     <div>
//       <h1>{message}</h1>
//     </div>
//   );
// }

// export default App;
