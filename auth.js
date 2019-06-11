/**
 * auth.js
 * Handle authentication to Firebase
 */

// constants
const EXDAYS = 30;

/**
 * signIn
 * Sign a user in to Firebase
 * @param {string} email
 * @param {string} password
 */
function signIn(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(err) {
    console.log("Firebase SignIn Error");
    console.log(err);
  });
}

/**
 * setCookie
 * Helper to set a cookie
 * @param {string} cname cookie key name
 * @param {string} cvalue cookie value
 * @param {number} exdays expiration in days
 */
function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires;
}

/**
 * getCookie
 * Helper to get a cookie value
 * @param {string} cname cookie key name
 * @return {string} value of the cookie or "" if non-exist
 */
function getCookie(cname) {
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  let key = cname + "=";
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1);
    if (c.indexOf(key) == 0) return c.substring(key.length, c.length);
  }
  return "";
}

/**
 * setCookieUser
 * Sets given user as signed-in user in cookie
 * @param {string} uid user ID
 */
function setCookieUser(uid) {
  setCookie("uid", uid, EXDAYS);
}

/**
 * getCookieUser
 * Gets signed-in user in cookie
 * @return {string} user ID or "" if no user is signed in
 */
function getCookieUser() {
  return getCookie("uid");
}

/**
 * eraseCookie
 * Erase stored cookie to ""
 */
function eraseCookie() {
  document.cookie = "";
}
