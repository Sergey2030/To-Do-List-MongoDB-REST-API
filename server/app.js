const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const List = require("./models/list")
const User = require("./models/user")
const Current = require("./models/currentUser")


const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(cors())




app.get('/get/list/:id', async (req, res) => {
    const currentId = req.params.id

    try{
        const list = await List.find({ id: currentId })


        res.json(list)
        console.log(list, "fdfewfwef"); 

         

        
    }catch(error){
        console.error(error);
        res.status(500).send("Ошибка при получении задач");
    }

})


app.post("/add/new/list", async (req, res) => {
    const {title, text, date, successList, userCurrent} = req.body

    console.log(title);
    console.log(text);
    console.log(date);
    console.log(successList);
    console.log(userCurrent);
    

    const newList = new List({
        title: title,
        text: text,
        date: date,
        successList: successList,
        id: userCurrent
    });

    try {
        const savedList = await newList.save()
        console.log(`Задача ${title} добавлена.`);

        if(savedList){
            const updatedList = await List.find({ id: userCurrent })
            res.json(updatedList);
        }
        
        
    } catch (error) {
        console.error(error);
        res.status(500).sendStatus("Ошибка")
    }
})


app.post("/del/list/:id", async (req, res) => {
    const {id} = req.params
    const {current} = req.body
    console.log(id);
    
    try {
        const delList = await List.findByIdAndDelete(id)
        console.log(`Удален!`);

        if(delList){
            const updatedList = await List.find({ id: current })
            res.json(updatedList);
            console.log(updatedList);
            
        }
        
      } catch (error) {
        console.error(error);
      }
})


app.post("/update/list", async (req, res) => {
    const {id, text, current} = req.body

    try {
        const updatedListUser = await List.findByIdAndUpdate(
            id,
            {text},
            {new: true, runValidators: true}
        )

        if(!updatedListUser){
            res.status(404).send("List not found")
        }else{
            const updatedList = await List.find({ id: current })
            res.json(updatedList);
            console.log("Нормуль!");
            
        }
    } catch (error) {
        res.status(500).sendStatus("Ошибка")
    }
})



app.post("/update/success", async (req, res) => {
    const {successUpdate, id, current} = req.body

    try {
        const updatedLSuccess = await List.findByIdAndUpdate(
            id,
            {successList: successUpdate },
            {new: true, runValidators: true}
        )

        if(!updatedLSuccess){
            res.status(404).send("List not found")
        }else{
            const updatedList = await List.find({ id: current })
            console.log(current);
            
            res.json(updatedList);
            console.log("Нормуль бодрый!");
            
        }
    } catch (error) {
        res.status(500).sendStatus("Ошибка")
    }
})




app.get("/get/last/id", async (req, res) => {
    try{
        const maxId = await User.findOne().sort({ id:  -1}).select('id').lean()
        const nextId = maxId ? maxId.id : 1;
        res.json(nextId)
        console.log(nextId);
        
    }catch(error){
        console.error(error)
        return error
    }
})



app.post('/add/new/user', async (req, res) => {
    const {newUser} = req.body

    console.log(newUser);

    const addNewUser = new User({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        pass: newUser.pass,
    });

    try {
        const savedUser = await addNewUser.save()
        console.log(`новый пользователь ${newUser.name} добавлен.`);
        res.json(savedUser)
        
    } catch (error) {
        console.error(error);
        res.status(500).sendStatus("Ошибка")
    }
})



app.post("/login/user", async (req, res) => {
    const {emailLoginUser, passLoginUser} = req.body

    try{
        const user = await User.findOne({email: emailLoginUser})

        if(!user){
            console.log("нету");
        }

        if(user.pass !== passLoginUser){
            console.log("пароль не тот");
            
        }

       res.json(user.id)
       console.log("Еще сюда!");
       
    } catch (error) {
        console.error(error);
    }

})


app.post('/current', async (req, res) => {
    const {currentUserSave} = req.body

    console.log(currentUserSave);

    const addCurrent = new Current({
        currentUser: currentUserSave
    });

    try {
        const savedCurrent = await addCurrent.save()
        console.log(`${savedCurrent} в системе`);
        res.json(savedCurrent)
    } catch (error) {
        console.error(error);
        res.status(500).sendStatus("Ошибка")
    }
})



app.get('/get/current', async (req, res) => {
    try{

        const result = await Current.findOne({}, 'currentUser').lean();
        
        if(result){
            const currentUser = result.currentUser
            res.json(currentUser)
            console.log(currentUser);  
        }
    }catch(error){
        console.error(error);
    }
})


app.delete("/exit/acc", async (req, res) => {
    try {
        const result = await Current.deleteMany({})
        res.json(result)
    } catch (error) {
        console.error(error);
    }
})


mongoose.connect(process.env.MONGO)
    .then(() => console.log("Success"))
    .catch((error) => console.error(error))


app.listen(PORT, () => {
    console.log(`На http://localhost:${PORT}`);
})