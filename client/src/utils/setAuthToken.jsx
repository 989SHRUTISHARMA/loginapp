import axios from 'axios'

// ─── setAuthToken ─────────────────────────────────────────────
// Yeh function JWT token ko Axios ke default headers mein set karta hai.
// Matlab har request ke saath automatically token jaayega.
//
// Jab user LOGIN kare  → setAuthToken(token)  → token header mein lag jaata hai
// Jab user LOGOUT kare → setAuthToken(null)   → token header se hata diya jaata hai

const setAuthToken = (token) => {
  if (token) {
    // Har Axios request mein Authorization header add ho jaayega
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    // Token hata do — logout ke baad
    delete axios.defaults.headers.common['Authorization']
  }
}

export default setAuthToken