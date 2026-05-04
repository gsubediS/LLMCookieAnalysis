const getcookieBtn = document.getElementById("getCookies");

getcookieBtn.addEventListener("click", getCookies);

function getCookies() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];

    chrome.cookies.getAll({ url: tab.url }, async function (cookies) {
      document.getElementById("cookieDisplay").textContent =
        "Analyzing cookies...";

      const response = await fetch("http://localhost:3000/analyze-cookies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          website: tab.url,
          cookies: cookies
        })
      });

      const data = await response.json();

      document.getElementById("cookieDisplay").textContent = data.explanation;
    });
  });
}