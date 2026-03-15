export default function isPasswordValid(password){
  const passwordRegEx = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?=.*[a-z]).{8,100}$/;
  return passwordRegEx.test(password);
}
