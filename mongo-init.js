db.createUser({
  user: "eusoff",
  pwd: "smallcoock",
  roles: [
    {
      role: "readWrite",
      db: "db",
    },
  ],
});
