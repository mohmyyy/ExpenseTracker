const form = document.getElementById("formId");
let userEditId = null;
// create container list
const listItems = document.createElement("ul");
listItems.className = "list-group";
listItems.id = "ul";
let appendInto = document.getElementById("container");
appendInto.appendChild(listItems);

// This will make sure to show the local storage data on screen
window.addEventListener("DOMContentLoaded", letItStay);
async function letItStay() {
  let response = await axios.get("http://localhost:3000/expense/get-expense");
  const data = response.data;
  console.log(data);
  data.forEach((element) => {
    addtoList(element);
  });
}

// This will add form data into local storage
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const obj = {
    expense: document.getElementById("expenseAmt").value,
    description: document.getElementById("desText").value,
    category: document.getElementById("categotyItems").value,
  };
  if (userEditId === null) {
    let promise1 = await axios
      .post("http://localhost:3000/expense/add-expense", obj)
      .then((response) => {
        console.log(response);
        addtoList(response.data);
      })
      .catch((error) => console.log(error));
    // addtoList(promise1.data);
  } else {
    let promise1 = await axios
      .put(`http://localhost:3000/expense/edit-expense/${userEditId}`, obj)
      .then((response) => addtoList(response.data))
      .catch((error) => console.log(error));
    // addtoList({ ...obj, userEditId });
  }
});

// This will add into list
function addtoList(objContains) {
  document.getElementById("expenseAmt").value = "";
  document.getElementById("desText").value = "";
  document.getElementById("categotyItems").value = "";

  const list = `
  <div class="Input-group" id = ${objContains.id}>
    <table class="table">
      <thead>
        <tr>
          <th>Amount</th>
          <th>Description</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-4">${objContains.expenseAmount}</td>
          <td class="col-4">${objContains.description}</td>
          <td class="col-4">${objContains.category}</td>
        </tr>
      </tbody>
    </table>
    <div class="d-flex gap-3">
    <button id='editxdelete' class="btn btn-primary" onclick="editItems('${objContains.expenseAmount}','${objContains.description}','${objContains.category}','${objContains.id}')">Edit Expense</button>
    <button id='editxdelete' class="btn btn-primary" onclick="deleteItem('${objContains.id}')">Delete Expense</button>
    </div>
    </div>`;
  listItems.innerHTML = listItems.innerHTML + list;
}

// This will delete details from local storage as well as from the screen.
function deleteItem(id) {
  axios.delete(`http://localhost:3000/expense/delete-expense/${id}`);
  removeItemFromList(id);
}

// This function will remove item from list.
function removeItemFromList(id) {
  let childNodetobedeleted = document.getElementById(id);
  if (childNodetobedeleted) {
    listItems.removeChild(childNodetobedeleted);
  }
}

// this will edit user details

function editItems(expenseAmt, desText, category, id) {
  document.getElementById("expenseAmt").value = expenseAmt;
  document.getElementById("desText").value = desText;
  document.getElementById("categotyItems").value = category;
  removeItemFromList(id);
  userEditId = id;
  console.log(userEditId);
}
