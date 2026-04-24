const getcookieBtn = document.getElementById('getCookies')

getcookieBtn.addEventListener("click",getCookies);

function getCookies(){

chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
var tab = tabs[0];

chrome.cookies.getAll({url : tab.url}, function(cookies){
document.getElementById("cookieDisplay").innerHTML = JSON.stringify(cookies)

});
});
}