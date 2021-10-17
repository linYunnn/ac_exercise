// 初始變數
const list = document.querySelector("#my-todo");
const addBtn = document.querySelector("#add-btn");
const input = document.querySelector("#new-todo");
const doneThings = document.querySelector('#done-todo')

// 資料
let todos = [
  "Hit the gym",
  "Read a book",
  "Buy eggs",
  "Organize office",
  "Pay bills"
];

for (let todo of todos) {
  addItem(todo);
}

// 函式
function addItem (text) {
  let newItem = document.createElement("li");
  newItem.innerHTML = `
    <label for="todo">${text}</label>
    <i class="delete fa fa-trash"></i>
  `
  list.appendChild(newItem)
}

function addValueItem (){
  const inputValue = input.value
  
  if (inputValue.length > 0 && inputValue.trim() !== "") {
    addItem(inputValue)
    input.classList.remove("is-invalid")
  } else {
    input.classList.add("is-invalid");
  }
  input.value = ""
}

// Create
addBtn.addEventListener("click", addValueItem)

input.addEventListener('keypress', function(event){
  if (event.key === 'Enter'){
    addValueItem()
  }
})

// Delete and check

//從todo到done
list.addEventListener("click", function (event) {
  const target = event.target
  let parentElement = target.parentElement

  if (target.classList.contains("delete")) {
    parentElement.remove()
  } else if (target.tagName === "LABEL") {
    target.classList.toggle("checked")
    doneThings.appendChild(parentElement)
  }
})

//從done回去todo
doneThings.addEventListener('click' , function(event){
  const target = event.target
  let parentElement = target.parentElement

  if (target.classList.contains("delete")) {
    parentElement.remove()
  } else if (target.tagName === "LABEL") {
    target.classList.toggle("checked")
    list.appendChild(parentElement)
  }
})

