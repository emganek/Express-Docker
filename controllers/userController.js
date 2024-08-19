const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ username, password: hashPassword });

    req.session.user = user;

    res.status(201).json({
      status: "success",
      data: {
        username,
        password: hashPassword,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.logIn = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(404).json({
        status: "fail",
        message: "Password incorrect",
      });
    } else {
      req.session.user = user;
      res.status(201).json({
        status: "success",
        data: {
          username,
          password: user.password,
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "fail1",
    });
  }
};
