const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;


app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended : true }))


const Document = require('./models/Document')

const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/nitro", {
    useUnifiedTopology : true,
    useNewUrlParser : true, 
})

app.get("/", (req, res) => {
  const code = `Hoşgeldiniz. 
Kodunu veya içeriğini oluştur ve diğer insanlarla paylaşabilirsiniz.`;

  res.render("code-display", { code, language : 'plaintext' });
});

app.get("/new", (req, res) => { 
    res.render("new")
});

app.post('/save', async (req,res) => {
    const value = req.body.value

    try {
        const document = await Document.create({ value })
        res.redirect(`/${document.id}`)
    } catch (error) {
        alert(error)
        res.render("new", { value })
    }

    console.log("Yeni kayıt geldi!", value)

})

app.get('/:id/duplicate', async (req,res) => {
    const id = req.params.id
    try {
        const document = await Document.findById(id)
        res.render('new', { value : document.value })
    } catch (error) {
        res.redirect(`/${id}`)
    }
})

app.get('/:id', async (req,res) => {
    const id = req.params.id
    try {
        const document = await Document.findById(id)
        res.render('code-display', { code : document.value, id })
    } catch (error) {
        res.redirect('/')
    }
})

app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});