import app from "./app.js";

const PORT = 5000

app.get('/', (req, res) => {
    res.send(`Server berjalan pada port ${PORT}`)
})

app.listen(PORT, () => {
    console.log(`Server berjalan pada ${PORT}`)
})