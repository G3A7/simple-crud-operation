const name = document.getElementById("productName");
const price = document.getElementById("productPrice");
const desc = document.getElementById("productDescription");
const cat = document.getElementById("productCategory");
const image = document.getElementById("productImage");
const searchHighlight = document.getElementById("searchHighlight");
const btnUpdate = document.getElementById("btn-update");
const btnCreate = document.getElementById("btn-create");
let flag = -1;
let idxGlobalForUpdate = -1;
let arrayOfData =
  localStorage.getItem("products") === null ? [] : JSON.parse(localStorage.getItem("products"));
if (localStorage.getItem("products")) {
  display();
}
function addProduct() {
  if (
    validation(name) &&
    validation(price) &&
    validation(desc) &&
    validation(cat) &&
    validation(image)
  ) {
    console.log(image.value);
    const objData = {
      id: Date.now(),
      name: name.value,
      price: price.value,
      desc: desc.value,
      cat: cat.value,
      image: image.files[0]?.name
        ? "./img/" + image.files[0]?.name
        : "https://placehold.co/600x400",
    };
    console.log(objData);
    arrayOfData.push(objData);
    localStorage.setItem("products", JSON.stringify(arrayOfData));
    display();
    clearForms();
  }
}

function display(list = arrayOfData) {
  // let regex = new RegExp(searchHighlight.value, "ig");
  // .replace(regex, (match) => `<span class='bg-info'>${match}</span>`)
  const containerData = document.getElementById("container-data");
  let card = "";
  for (let i = 0; i < list.length; i++) {
    card += `
     <div class="col-md-3">
     <div class="card text-center">
     <img src="${list[i].image}" class="d-block w-100" alt="" />
     <h3>name: ${list[i].title ? list[i].title : list[i].name}</h3>
     <p>prise: ${list[i].price}$</p>
     <p>cat: ${list[i].cat}</p>
     <p>desc: ${list[i].desc}...</p>
     <div class="btns mb-2">
                <button onclick="deleteProduct(${
                  list[i].id
                })" class="btn btn-outline-danger">delete</button>
                <button onclick="updateProduct(${
                  list[i].id
                })" class="btn btn-outline-warning">update</button>
              </div>
            </div>
        </div>
    `;
  }
  containerData.innerHTML = card;
}

function search(e) {
  const regex = new RegExp(e, "ig");
  const filterData = arrayOfData.filter((el) => {
    el.title = el.name.replaceAll(regex, `<span class='bg-danger'>${e}</span>`);
    return el.name.toLowerCase().includes(e.toLowerCase());
  });
  display(filterData);
}

function deleteProduct(id) {
  arrayOfData = arrayOfData.filter((e) => {
    return e.id != id;
  });
  localStorage.setItem("products", JSON.stringify(arrayOfData));
  display();
}
// بكره هنعمل دي ان نشاء الله
function updateProduct(id) {
  const prod = arrayOfData.filter((e) => {
    return e.id == id;
  });
  name.value = prod[0].name;
  price.value = prod[0].price;
  desc.value = prod[0].desc;
  cat.value = prod[0].cat;

  idxGlobalForUpdate = prod[0].id;
  btnUpdate.classList.remove("d-none");
  btnCreate.classList.add("d-none");
}
function clearForms() {
  name.value = "";
  price.value = "";
  desc.value = "";
  cat.value = "";
  image.value = "";
  name.classList.remove("is-valid");
  price.classList.remove("is-valid");
  desc.classList.remove("is-valid");
  cat.classList.remove("is-valid");
  image.classList.remove("is-valid");
}

function updateProd() {
  const objData = {
    id: Date.now(),
    name: name.value,
    price: price.value,
    desc: desc.value,
    cat: cat.value,
    image: image.files[0]?.name ? "./img/" + image.files[0]?.name : "https://placehold.co/600x400",
  };

  const idx = returnIdx(arrayOfData, idxGlobalForUpdate).filter((e) => {
    return e != null;
  });
  console.log(idx);
  arrayOfData.splice(idx, 1, objData);
  localStorage.setItem("products", JSON.stringify(arrayOfData));
  btnUpdate.classList.add("d-none");
  btnCreate.classList.remove("d-none");
  display();
  idxGlobalForUpdate = -1;
  clearForms();
}

function returnIdx(arr, id) {
  console.log(arr, id);
  const ans = arr.map((e, idx) => {
    return e.id == id ? idx : null;
  });
  console.log(ans);
  return ans;
}

function validation(ele) {
  // productImage;
  // productDescription;
  // productCategory;
  // productPrice;
  // productName;

  let regexObj = {
    productName: /^[A-Z][a-z]{3,25}$/,
    productDescription: /^.{3,}$/m,
    productCategory: /^(electronics|screens|mobile|tv)$/i,
    productPrice: /^[1-9][1-9][1-9]\.[1-9][1-9]$/,
    productImage: /^.{1,}\.(png|jpeg|jpg|avif|svg)$/,
  };
  if (regexObj[ele.id].test(ele.value)) {
    ele.classList.add("is-valid");
    ele.classList.remove("is-invalid");
    ele.nextElementSibling.classList.replace("d-block", "d-none");
    return true;
  } else {
    ele.classList.add("is-invalid");
    ele.classList.remove("is-valid");
    ele.nextElementSibling.classList.replace("d-none", "d-block");
    return false;
  }
}
