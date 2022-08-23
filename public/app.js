const price = document.querySelectorAll(".price");
const toCurrency = (price) => {
  let dollarUs = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "usd",
  });

  const result = dollarUs.format(price);
  return result;
};

const date = document.querySelectorAll(".date");
// const toDate = (date) => {
//   let formatedDate = Intl.DateTimeFormat("en-US");
//   const readyDate = formatedDate.format(date);
//   return readyDate;
// };

// date.forEach((item) => {
//   item.textContent = toDate(item.textContent);
// });

price.forEach((item) => {
  item.textContent = toCurrency(item.textContent);
});

const $card = document.querySelector(".basket");
try {
  $card.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains("remove")) {
      fetch("/card/remove/" + id, {
        method: "delete",
      })
        .then((res) => res.json())
        .then((card) => {
          if (card.notebooks.length) {
            const dynamicCard = card.notebooks
              .map((item) => {
                return `
                <tr>
                  <td>${item.title}</td>
                  <td>${item.count}</td>
                  <td>${item.price}</td>
                  <td><button class="btn remove" data-id=${item.id}>Delete</button></td>
                </tr>
              `;
              })
              .join("");
            document.querySelector("tbody").innerHTML = dynamicCard;
            document.querySelector(".price").textContent = toCurrency(
              card.price
            );
          } else {
            $card.innerHTML = `
              <h4>Basket</h4>
              <h5>Basket is empty</h5>
            `;
          }
        });
    }
  });
} catch (e) {
  console.log(e);
}

var instance = M.Tabs.init(document.querySelectorAll(".tabs"));

let panel = document.querySelector("#panel");

try {
  panel.classList.add("panel");
} catch (e) {
  console.log(e);
}
