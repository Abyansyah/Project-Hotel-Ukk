const express = require(`express`);
const app = express();
const PORT = 8000;
const cors = require(`cors`);
app.use(cors());

const userRoute = require(`./routes/user_route`);
const tipeRoute = require(`./routes/tipe_kamar_routes`);
const kamarRoute = require(`./routes/kamar_route`);
const pemesananRoute = require(`./routes/pemesanan_route`)

app.use(`/user`, userRoute);
app.use(`/tipe`, tipeRoute);
app.use(`/kamar`, kamarRoute)
app.use(`/pemesanan`, pemesananRoute)
app.use(express.static(__dirname))


app.listen(PORT, () => {
  console.log(`Server of School's Library runs on port
    ${PORT}`);
});


