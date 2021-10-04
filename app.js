require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db.config")();

const app = express();

app.use(express.json());
// --------------------------------------------------- Não esquecer de criar variável de ambiente com o endereço do seu app React (local ou deployado no Netlify)
app.use(cors({ origin: process.env.REACT_APP_URL }));

// Redirecting everything to its propers routes
const userRouter = require("./routes/user.routes");
app.use("/api", userRouter);

const exerciseRouter = require("./routes/exercise.routes");
app.use("/api", exerciseRouter);

const workoutRouter = require("./routes/workout.routes");
app.use("/api", workoutRouter);

const postingRouter = require("./routes/posting.routes");
app.use("/api", postingRouter);

// Generic route to treat errors
app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    return res.status(err.status || 500).json({
      msg: "Internal error in the So Fit server.",
      err: err, // -------------------------------------- DEBUGGER
    });
  }
  return next();
});

app.listen(Number(process.env.PORT), () =>
  console.log(`Server up and running at port ${process.env.PORT}`)
);
