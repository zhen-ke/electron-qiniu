const TokenKey = "token";

export function getToken() {
  return JSON.parse(localStorage[TokenKey] || "{}");
}

export function setToken(token) {
  return (localStorage[TokenKey] = JSON.stringify(token));
}

export function removeToken() {
  return localStorage.removeItem(TokenKey);
}

export function timetrans(oldDate) {
  var date = new Date(oldDate); //如果date为13位不需要乘1000
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}
