const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conexion exitosa a MongoDB Atlas"))
  .catch((err) => console.error("Error de conexion:", err.message));

const ProductoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    precio: { type: Number, required: true, min: 0 },
    existencia: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

const Producto = mongoose.model("Producto", ProductoSchema);

app.get("/", (req, res) => {
  res.json({ mensaje: "API de inventario activa" });
});

app.get("/productos", async (req, res) => {
  const q = (req.query.q || "").trim();
  const filtro = q ? { nombre: { $regex: q, $options: "i" } } : {};
  const productos = await Producto.find(filtro).sort({ createdAt: -1 });
  res.json(productos);
});

app.get("/productos/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: "ID invalido" });
  }
});

app.post("/productos", async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json({ mensaje: "Producto registrado", nuevoProducto });
  } catch (error) {
    res.status(400).json({ mensaje: "Datos invalidos", detalle: error.message });
  }
});

app.put("/productos/:id", async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json({ mensaje: "Producto actualizado", producto });
  } catch (error) {
    res.status(400).json({ mensaje: "No se pudo actualizar", detalle: error.message });
  }
});

app.delete("/productos/:id", async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    res.status(400).json({ mensaje: "No se pudo eliminar" });
  }
});

app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
