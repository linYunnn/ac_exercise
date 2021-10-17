const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
const PEOPLE_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

const peopleInfo = []
let filterPeopleInfo = []

axios.get(INDEX_URL).then((response) => {
  peopleInfo.push(...response.data.results)
  renderPeopleInfo(getPeopleByPage(1))
  renderPaginator(peopleInfo.length)
})

dataPanel.addEventListener('click', function (event) {
  console.log('click')
  if (event.target.matches('.btn-read-more')) {
    showPersonModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-friend')){
    addToFrined(Number(event.target.dataset.id))
    alert('加入好友清單')
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted (event){
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filterPeopleInfo = peopleInfo.filter((person) => 
    person.name.toLowerCase().includes(keyword) || person.surname.toLowerCase().includes(keyword)
  )

  if (filterPeopleInfo.length === 0){
    return alert(`您輸入的關鍵字 : ${keyword} ，沒有符合的結果`)
  }

  renderPeopleInfo(getPeopleByPage(1))
  renderPaginator(filterPeopleInfo.length)
})

paginator.addEventListener('click', function onPaginatorClicked(event){
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderPeopleInfo(getPeopleByPage(page))
})

function renderPeopleInfo(data) {
  let rawHTML = ''
  
  //渲染user
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
      <div class="m-3">
        <div class="card">
          <div class="d-flex p-2 justify-content-center">
            <img src="${item.avatar}"  class="card-img-top btn-person-avatar" alt="personAvatar">
          </div>
          <div class="card-body d-flex pb-3 justify-content-around">
            <h6 class="card-text" id="personName">${item.name}\t${item.surname}</h6>
          </div>
          <div class="card-footer text-muted d-flex flex-column p-2 justify-content-center">
            <button type="button" class="btn btn-light btn-sm btn-read-more" data-toggle="modal" data-target="#person-modal" data-id="${item.id}">READ MORE</button>
            <button type="button" class="btn btn-outline-success btn-sm btn-add-friend" data-id="${item.id}">ADD FRIEND</button>
          </div>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML
}


function showPersonModal(id) {
  const personModalAvatar = document.querySelector('#person-modal-avatar')
  const personModalName = document.querySelector('#person-modal-name')
  const personModalGender = document.querySelector('#person-modal-gender')
  const personModalAge = document.querySelector('#person-modal-age')
  const personModalEmail = document.querySelector('#person-modal-email')
  const personModalBirthday = document.querySelector('#person-modal-birthday')

  axios.get(INDEX_URL + '/' + id).then((response) => {
    const data = response.data
    console.log(INDEX_URL + '/' + id)
    console.log(data)
    personModalName.innerText = `${data.name}\t${data.surname}`
    personModalGender.innerText = `Gender : ${data.gender}`
    personModalAge.innerText = `Age : ${data.age}`
    personModalEmail.innerText = `Email : ${data.email}`
    personModalAvatar.innerHTML = `<img src="${data.avatar}" alt="Avatar" id="person-modal-avatar">`
    personModalBirthday.innerText = `Birthday : ${data.birthday}`
  })
}

function addToFrined (id){
  const list = JSON.parse(localStorage.getItem('friendList')) || []
  const friends = peopleInfo.find(friend => friend.id === id)
  console.log(id)
  list.push(friends)
 
  localStorage.setItem('friendList', JSON.stringify(list))
}

function getPeopleByPage (page){
  //filteredPeopleInfo是空陣列嗎? 如果不是空陣列，data就為filteredPeopleInfo, 如果是空陣列, data 就為peopleInfo
  const data = filterPeopleInfo.length ? filterPeopleInfo : peopleInfo
  const startIndex = (page - 1) * PEOPLE_PER_PAGE

  return data.slice(startIndex, startIndex + PEOPLE_PER_PAGE)
}

function renderPaginator (amount){
  //Math.ceil無條件進位
  const numberOfPages = Math.ceil(amount / PEOPLE_PER_PAGE)
  let rawHTML = ''

  for (let page = 0; page < numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page + 1}">${page + 1}</a></li>`
  }

  paginator.innerHTML = rawHTML
}