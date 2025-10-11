const routes = {
  "/dashboard": "<h1>Welcome to Home</h1><p>This is the homepage.</p>",
  "/transactions": "<h1>Transactions page</h1><p>Manage your transactions</p>",
  "/add-transaction": "<h1>Add transactions page</h1><p>Keep a record of a transactions</p>",
  "/settings": "<h1>Settings page</h1><p>Manage your settings</p>",
  "/about": "<h1>About page</h1><p>About the app</p>",
};

function router() {
  const hash = window.location.hash.replace("#", "") || "/";
  document.getElementById("app").innerHTML =
    routes[hash] || "<h1>404 Page Not Found</h1>";
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
