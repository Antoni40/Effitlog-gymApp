export default async function fetchHelper(url, options) {
    let res = await fetch(url, {
      credentials: 'include',
      ...options
    });

    if(res.status === 401){
      let refreshRes = await fetch('http://localhost:8080/auth/refreshToken', {
        method: 'GET',
        credentials: 'include'
      })

      refreshRes = await refreshRes.json();
      const isTokenRefreshed = refreshRes.success;

      if(!isTokenRefreshed) {
        throw new Error("unauthorized");
      } else {
        res = await fetch(url, {
          credentials: 'include',
          ...options
        });
      }
    }

    if(!res.ok){
      throw new Error("HTTP error" + res.status);
    }
    
    return res.json();
}