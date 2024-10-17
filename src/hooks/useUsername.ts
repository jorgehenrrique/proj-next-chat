// import { useState, useEffect } from 'react';

// export function useUsername() {
//   const [username, setUsername] = useState<string | null>(null);

//   useEffect(() => {
//     const storedUsername = localStorage.getItem('chatUsername');
//     if (storedUsername) {
//       setUsername(storedUsername);
//     }
//   }, []);

//   const updateUsername = (newUsername: string) => {
//     setUsername(newUsername);
//     localStorage.setItem('chatUsername', newUsername);
//   };

//   return { username, updateUsername };
// }
