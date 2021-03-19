const RoomSchema = require("./models/RoomSchema");
const roomServices = require("./services/roomServices");

function setUpRoutes(app, passport, db) {
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  app.get("/faq", function (req, res) {
    res.render("faq.ejs");
  });

  app.get("/about", function (req, res) {
    res.render("about.ejs");
  });

  app.get("/contact", function (req, res) {
    res.render("contact.ejs");
  });

  app.get("/chat", (req, res) => {
    var name = req.query.room;

    db.collection("rooms")
      .find({
        name: name,
      })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("chat.ejs", {
          messages: result[0].message,
          roomId: req.query.room,
        });
      });
  });

  app.get("/profile", isLoggedIn, function (req, res) {
    res.render("profile.ejs", {
      user: req.user,
    });
  });

  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/login", function (req, res) {
    res.render("login.ejs", {
      message: req.flash("loginMessage"),
    });
  });

  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

  app.get("/signup", function (req, res) {
    res.render("signup.ejs", {
      message: req.flash("signupMessage"),
    });
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile",
      failureRedirect: "/signup",
      failureFlash: true,
    })
  );

  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}

module.exports = {
  setUpRoutes,
  isLoggedIn,
};
