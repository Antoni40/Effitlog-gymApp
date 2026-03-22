export default function isEmailValid(email){
  const passwordRegEx = /^[a-z0-9._]+@[a-z0-9]+\.[a-z]{2,}$/;
  return passwordRegEx.test(email);
}