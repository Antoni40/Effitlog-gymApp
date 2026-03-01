export default async function fetchHelper(url, options) {
  const res = await fetch(url, {
    credentials: 'include',
    ...options
  });

  if(res.status === 401){
    alert("Session expired, please log in again");
    throw new Error("unauthorized");
  }

  if(!res.ok){
    throw new Error("HTTP error" + res.status);
  }

  return res.json();
}