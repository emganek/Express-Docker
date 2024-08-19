const express = require("express");
const app = express();
const cors = require("cors")

// MONGO -------------------------------------------------
const mongoose = require("mongoose");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_PORT,
  REDIS_HOST,
} = require("./config/config");

initConnection()
  .catch((err) => console.log(err))
  .then(() => console.log("connect to db successfully"));

async function initConnection() {
  await mongoose.connect(
    `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
  );
}
// End -------------------------------------------------

// Redis -------------------------------------------------
const session = require("express-session");
const { createClient } = require("redis");
let RedisStore = require("connect-redis").default;
let redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`
})

// redisClient.connect().catch(console.error)
redisClient
  .connect()
  .catch((error) => console.log("Redis Error:::::::::::::::::: /n", error))
  .then(() => console.log("connected to Redis"));
// End -------------------------------------------------

// Middleware
app.use(cors({}));
app.use(express.json());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
);
// End -------------------------------------------------

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

app.get("/api/v1", (req, res) => {
  res.send("<h1>Hello world hiep123123123</h1>");
  console.log("yeah it run2");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.CONTAINER_PORT || 3000;

app.listen(port, () => console.log(`app running on port ${port}`));
