

document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:3000"


  let currentUser
  let userId
  let copiedUserId = userId;

  async function getCurrent(currentUser) {
    fetch(`${apiUrl}/get/current`)
    .then(response => response.json())
    .then(data => {currentUser = data, userId = data, console.log(currentUser), goToReg(currentUser), getList(currentUser),
      localStorage.setItem("userId", data)
    })

  }


  getCurrent(currentUser)

  function goToReg(currentUser){
    if(!currentUser){
      window.location.href = 'index.html';
      console.log(currentUser);
      
    }
  }


  function currentUserId(){
    const num = localStorage.getItem("userId")
    return num
  }


  const titleUser = document.getElementById("titleUser")
  const textListUser = document.getElementById("textListUser")
  const sendListBtn = document.getElementById("sendListBtn")

  const cartCont = document.getElementById("cartCont")

  const redactForm = document.getElementById("redactForm")
  const updatetext = document.getElementById("updatetext")
  const redactBtn = document.getElementById("redactBtn")

  const exitAccBtn = document.getElementById("exitAccBtn")

  exitAccBtn.addEventListener("click", () => {
    console.log(3434);
    localStorage.clear()
    exitAcc()
  })

  async function exitAcc() {
    try {
      const response = await fetch(`${apiUrl}/exit/acc`, {
      method: "DELETE",
      headers: {'Content-Type': "application/json"},
    })

    if(response.ok){
      localStorage.clear()
      window.location.href = 'index.html';
    }

    } catch (error) {
      console.error(error);
    }
  }


  async function getList(currentUser) {
    let current = currentUser
    fetch(`${apiUrl}/get/list/${currentUser}`)
    .then(response => response.json())
    .then(data => renderList(data, current)
    )
  }
  



  sendListBtn.addEventListener("click", (e) => {
    e.preventDefault()

    
    let userCurrent = currentUserId()

    let userTitleList = titleUser.value 

    let userTextList = textListUser.value 

    let date = new Date 

    let dateList = `добавленно ${date.getDate()}/${date.getMonth()} в ${date.getHours()}.${date.getMinutes()}`
    
    let successList = false

    addList(userTitleList, userTextList, dateList, successList, userCurrent,)
  })



  

  async function addList(title, text, date, successList, userCurrent){
    console.log(userCurrent);
    
    try {
      const response = await fetch(`${apiUrl}/add/new/list`, {
      method: "POST",
      headers: {'Content-Type': "application/json"},
      body: JSON.stringify({title, text, date, successList, userCurrent})
    })

    if(response.ok){
      const updateList = await response.json()
      renderList(updateList)
    }

    } catch (error) {
      console.error(error);
    }
  }

  function renderList(data){
    const current = currentUserId()
    
    console.log(111);
    cartCont.innerHTML = ""
    data.forEach(list => {

      
      let listCont = document.createElement('div')
      listCont.classList.add('card')


      let successCont = document.createElement("div")
      successCont.classList.add("successCont")

      let successText = document.createElement('p')
      let successBtn = document.createElement("button")
      successBtn.dataset.id = list._id

      if(list.successList == false){
        successText.textContent = `Задача не выполнена!`
        successBtn.textContent = `-`
        successBtn.style.background = "red"
      }else{
        successText.textContent = `Задача выполнена!`
        successBtn.textContent = `+`
        successBtn.style.background = "green"
      }

      successBtn.addEventListener("click", () => {
        let id = successBtn.dataset.id
        if(list.successList == false){
          successText.textContent = `Задача выполнена!`
          successBtn.textContent = `+`
          successBtn.style.background = "green"
          list.successList = true
        }else{
          successText.textContent = `Задача не выполнена!`
          successBtn.textContent = `-`
          successBtn.style.background = "red"
          list.successList = false
        }

        updateSuccess(list.successList, id, current)
      })

      
      
      let titleList = document.createElement("h4")
      titleList.textContent = list.title.length > 15 ? list.title.slice(0, 15) + '...' : list.title


      let modalBtn = document.createElement("button")
      modalBtn.dataset.id = list._id
      modalBtn.textContent = "Описание"
      modalBtn.classList.add("modalBtn")

      let dateList = document.createElement('span')
      dateList.textContent = list.date

      let btnCont = document.createElement('div')
      btnCont.classList.add("btnCont")

      let delBtn = document.createElement('button')
      delBtn.textContent = `Удалить`
      delBtn.dataset.id = list._id

      let redatcBtn = document.createElement("button")
      redatcBtn.textContent = `редактировать`
      redatcBtn.dataset.id = list._id


      successCont.appendChild(successText)
      successCont.appendChild(successBtn)


      btnCont.appendChild(delBtn)
      btnCont.appendChild(redatcBtn)

      listCont.appendChild(titleList)
      listCont.appendChild(modalBtn)
      listCont.appendChild(dateList)
      listCont.appendChild(btnCont)
      listCont.appendChild(successCont)

      cartCont.appendChild(listCont)







      delBtn.addEventListener('click', () => {
        let id = delBtn.dataset.id
        delList(id, current)
        redactForm.style.display = "none"
      })
      redatcBtn.addEventListener('click', () => {
        let id = redatcBtn.dataset.id
        let text = list.text
        redactFormListUser(id, text, current)
      })

      modalBtn.addEventListener("click", () => {
        let title = list.title
        let text = list.text
        let id = modalBtn.dataset.id
        modalWindow(id, title, text)
      })
    });
  }


  async function delList(id, current){
    console.log(id);
    
    try {
    const response = await fetch(`${apiUrl}/del/list/${id}`, {
      method: "POST",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify({current})
    })

    if(response.ok){
      const updateList = await response.json()
      renderList(updateList)
    }
    } catch (error) {
      console.error(error);
    }
  }


  function redactFormListUser(id, text, current) {
    updatetext.textContent = ""
    redactForm.style.display = "flex"
    updatetext.textContent = text


    redactBtn.addEventListener("click", (e) => {
      e.preventDefault()
      let updateFormText = updatetext.value
      updateList(id, updateFormText, current)
      redactForm.style.display = "none"
    })
  }


  async function updateList(id, text, current) {
    try {
      const response = await fetch(`${apiUrl}/update/list`, {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({id, text, current})
      })
  
      if(response.ok){
        const updateList = await response.json()
        renderList(updateList)
      }
    } catch (error) {
      
    }
  }


  const textModalCont = document.getElementById("textModalCont")
  const exitBtn = document.getElementById("exitBtn")

  const titleCont = document.getElementById("titleCont")
  const textContModal = document.getElementById("textContModal")

  async function updateSuccess(successUpdate, id, current) {
    console.log(current, "fswfdsfsdf");
    
    try {
      const response = await fetch(`${apiUrl}/update/success`, {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({successUpdate, id, current})
      })
  
      if(response.ok){
        const updateList = await response.json()
        renderList(updateList)
      }
    } catch (error) {
      
    }
  }


  function modalWindow(id, title, text){
    textModalCont.style.display = "flex"

    titleCont.textContent = title
    textContModal.textContent = text
  }

  exitBtn.addEventListener("click", () => {
    textModalCont.style.display = "none"
  })
})