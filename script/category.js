const href = window.location.href;
const root = document.getElementById("root");
const array = href.split("/");

const url = array[array.length - 1].split(".")[0];
console.log(url);

//homework try/catch
async function getCategory(url) {
  const res = await fetch(`http://localhost:3000/${url}`);
  const data = await res.json();
  renderCategory(data);
}
getCategory(url);

function renderCategory(data) {
  root.insertAdjacentHTML(
    "beforeend",
    `<ul>
  ${data
    .map((item) => `<li><a href=${item.link}>${item.title}</a></li>`)
    .join("")}</ul>`
  );
}
