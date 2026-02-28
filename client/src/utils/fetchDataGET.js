export default function fetchDataGET(url) {
  return fetch(url, {
    method: 'GET',
    credentials: 'include'
  })
    .then((res) => {
      if(res.status === 401){
        alert("Session expired, please log in again");
        throw new Error("unauthorized");
      }
      if(!res.ok){
        throw new Error("HTTP error" + res.status);
      }
      return res.json();
    })
}