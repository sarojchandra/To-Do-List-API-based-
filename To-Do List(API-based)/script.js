let taskInput = document.querySelector("#taskInput");
let addBtn = document.querySelector(".addBtn");
let todoContainer = document.querySelector(".todoContainer");

let API = "https://6863d88288359a373e968c0d.mockapi.io/api/v1/todos";

addBtn.addEventListener("click", postData);

async function fetchData() {
  let response = await fetch(API);
  let data = await response.json();
  if (data) {
    todoContainer.innerHTML = "";
  }
  data.forEach((obj) => {
    let div = document.createElement("div");
    div.className = "todo";
    div.innerHTML = `
             <p class='paraText'>${obj.text}</p>
             <input id="editInput" type="text" value='${obj.text}' />
             <div>
                <button class=" deleteBtn">Delete</button>
                <button class="editBtn">Edit</button>
                <button class='saveBtn'>save</button>
             </div>`;
    let deleteBtn = div.querySelector(".deleteBtn");
    let editBtn = div.querySelector(".editBtn");
    let saveBtn = div.querySelector(".saveBtn");
    let paraText = div.querySelector(".paraText");
    let editInput = div.querySelector("#editInput");

    deleteBtn.addEventListener("click", function () {
      deleteData(obj.id);
    });

    editBtn.addEventListener("click", function () {
      editBtn.style.display = "none";
      saveBtn.style.display = "inline";
      editInput.style.display = "inline";
      paraText.style.display = "none";
    });
    saveBtn.addEventListener("click", async function () {
      let editValue = editInput.value;
      let response = await updateData(obj.id, editValue);
      if (response.status === 200) {
        fetchData();
        editBtn.style.display = "inline";
        saveBtn.style.display = "none";
        paraText.style.display = "inline";
        editInput.style.display = "none";
        
      }
    });
    todoContainer.prepend(div);
  });
}
async function updateData(id, value) {
  let objData = {
    text: value.trim(),
  };
  let response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(objData),
  });

  return response;
}
async function postData() {

  let value = taskInput.value;
  let objData = {
    text: value.trim(),
  };
  let response = await fetch(API, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(objData),
  });

  if (response.status === 201) {
    fetchData();
    taskInput.value = "";
  }
}
async function deleteData(id) {
  console.log(id);
  let response = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    fetchData();
  }
}

fetchData();
