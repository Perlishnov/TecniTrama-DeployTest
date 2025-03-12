const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("./routes/auth");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la sesión
app.use(
  session({
    secret: "supersecreto",
    resave: false,
    saveUninitialized: true,
  })
);

// Inicializar Passport y la sesión de Passport
app.use(passport.initialize());
app.use(passport.session());

// Conexión a MongoDB (ajusta la cadena de conexión según tu entorno)
mongoose
  .connect("mongodb://localhost:27017/tecnitrama", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ----- Definición de Modelos con Mongoose ----- //

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});
const Project = mongoose.model("Project", projectSchema);

const applicationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  applicantEmail: String,
  appliedAt: { type: Date, default: Date.now },
});
const Application = mongoose.model("Application", applicationSchema);

const messageSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  from: String,
  message: String,
  sentAt: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

// Sembrar proyectos de ejemplo si la colección está vacía
Project.countDocuments({}, (err, count) => {
  if (count === 0) {
    const sampleProjects = [
      { title: "Short Film Project A", description: "A creative short film about life." },
      { title: "Documentary Project B", description: "A documentary exploring modern challenges." },
      { title: "Music Video Project C", description: "A dynamic music video production." },
    ];
    Project.insertMany(sampleProjects)
      .then(() => console.log("Sample projects inserted"))
      .catch((err) => console.error("Error seeding projects:", err));
  }
});

// ----- Middleware para Proteger Rutas ----- //
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

// ----- Rutas de Autenticación ----- //

// Inicia el flujo de autenticación con Microsoft
app.get("/auth/login", passport.authenticate("microsoft"));

// Callback de autenticación
app.get(
  "/auth/callback",
  passport.authenticate("microsoft", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    // Redirige a la página principal o a donde desees luego de autenticarse
    res.redirect("/");
  }
);

// Ruta de logout
app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// Ruta en caso de fallo en la autenticación
app.get("/auth/failure", (req, res) => {
  res.status(401).send("Authentication Failed");
});

// ----- Rutas de API (Proyectos, Aplicaciones y Mensajería) ----- //

// Obtener lista de proyectos (esta ruta puede estar pública)
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Error fetching projects" });
  }
});

// Aplicar a un proyecto (protegido)
app.post("/api/apply", ensureAuthenticated, async (req, res) => {
  const { projectId } = req.body;
  // Se usa el correo del usuario autenticado
  const applicantEmail = req.user._json.mail || req.user._json.userPrincipalName;
  if (!projectId) {
    return res.status(400).json({ error: "Missing projectId" });
  }
  try {
    const application = new Application({ projectId, applicantEmail });
    await application.save();
    res.json({ message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error submitting application" });
  }
});

// Obtener mensajes para un proyecto (protegido)
app.get("/api/messages/:projectId", ensureAuthenticated, async (req, res) => {
  const { projectId } = req.params;
  try {
    const messages = await Message.find({ projectId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

// Enviar un mensaje para un proyecto (protegido)
app.post("/api/messages", ensureAuthenticated, async (req, res) => {
  const { projectId, message } = req.body;
  // Se usa el correo del usuario autenticado
  const from = req.user._json.mail || req.user._json.userPrincipalName;
  if (!projectId || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    const newMessage = new Message({ projectId, from, message });
    await newMessage.save();
    res.json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
