



document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = "http://localhost:3000"

  
  let currentUser
  localStorage.clear()
  async function getCurrent() {
    
    fetch(`${apiUrl}/get/current`)
    .then(response => response.json())
    .then(data => {currentUser = data, console.log(currentUser), goToMain(currentUser)
    })
  }

  getCurrent()

  function goToMain(currentUser){
    console.log(currentUser);
    if(currentUser){
      window.location.href = 'main.html';
    }
  }
  

  const loginEmail = document.getElementById('loginEmail')
  const loginPass = document.getElementById("loginPass")
  const loginBtn = document.getElementById('loginBtn')


  const signName = document.getElementById("signName")
  const signEmail = document.getElementById("signEmail")
  const signPass = document.getElementById("signPass")
  const signBtn = document.getElementById('signBtn')


  const signupButton = document.getElementById('signup-button'),
  loginButton = document.getElementById('login-button'),
  userForms = document.getElementById('user_options-forms')


  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  

  /**
  * Add event listener to the "Sign Up" button
  */
  signupButton.addEventListener('click', () => {
    userForms.classList.remove('bounceRight')
    userForms.classList.add('bounceLeft')
  }, false)

  /**
  * Add event listener to the "Login" button
  */
  loginButton.addEventListener('click', () => {
    userForms.classList.remove('bounceLeft')
    userForms.classList.add('bounceRight')
  }, false)


  let userId

  fetch(`${apiUrl}/get/last/id`)
    .then(response => response.json())
    .then(data =>{userId = data, console.log(userId)
    })


  
  

  let nameValSign = false
  let emailValSign = false
  let passValSign = false

  signBtn.addEventListener('click', (e) => {
    console.log(userId);
    
    let nameUser = signName.value 
    let emailUser = signEmail.value
    let passUser = signPass.value

    if(nameUser.length > 2 && nameUser.length < 15){
      nameValSign = true
    }else{
      alert("Имя не. 2 > должно быть < 15 ")
    }

    if(emailPattern.test(emailUser)){
      emailValSign = true
    }else{
      alert("email не")
    }

    if(passUser.length > 8 && passUser.length < 15){
      passValSign = true
    }else{
      alert("Пароль не. 8 > должен быть < 15 ")
    }


    if(nameValSign == true && emailValSign == true && passValSign == true){
      userId++
      console.log(userId);
      
      let newUser = {
        id: userId,
        name: nameUser,
        email: emailUser,
        pass: passUser,
      }
      addNewUser(newUser)
    }else{

    }

    e.preventDefault()
    
  })


  async function addNewUser(newUser) {
    try {
      const response = await fetch(`${apiUrl}/add/new/user`, {
      method: "POST",
      headers: {'Content-Type': "application/json"},
      body: JSON.stringify({newUser})
    })

    if(response.ok){
      getCurrentUser(newUser.id)
      console.log("Сюда!");
      
    }

    } catch (error) {
      console.error(error);
    }
  }

  

   async function getCurrentUser(userId){
    let currentUserSave = userId
    console.log(currentUserSave);

    
      
    try {
      const response = await fetch(`${apiUrl}/current`, {
      method: "POST",
      headers: {'Content-Type': "application/json"},
      body: JSON.stringify({currentUserSave})
    })

    if(response.ok){
      console.log("Есть!!");
      window.location.href = 'main.html';
    }

    } catch (error) {
      console.error(error);
    }
   }




   loginBtn.addEventListener("click", (e) => {
    e.preventDefault()

    let emailLoginUser = loginEmail.value 
    let passLoginUser = loginPass.value

    loginUser(emailLoginUser, passLoginUser)
   })

   async function loginUser(emailLoginUser, passLoginUser) {
    try {
      const response = await fetch(`${apiUrl}/login/user`, {
      method: "POST",
      headers: {'Content-Type': "application/json"},
      body: JSON.stringify({emailLoginUser, passLoginUser})
    })

    if(response.ok){
      const idUser = await response.json()
      getCurrentUser(idUser)
      console.log(idUser);
      
      console.log("Сюда!");
      
    }

    } catch (error) {
      alert("Нету!")
    }
   }

})




