exports.signup = async (req, res) => {

 const { login_id, name, email, password, role } = req.body;

 if (!login_id || !email || !password) {
  return res.status(400).json({
   message: "Required fields missing"
  });
 }

 if (login_id.length < 6 || login_id.length > 12) {
  return res.status(400).json({
   message: "Login ID must be 6–12 characters"
  });
 }

 const passwordRegex =
 /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

 if (!passwordRegex.test(password)) {
  return res.status(400).json({
   message:
    "Password must contain uppercase, lowercase, special character and minimum 8 characters"
  });
 }

 db.query(
  "SELECT * FROM users WHERE login_id=? OR email=?",
  [login_id, email],
  async (err, results) => {

   if (err) return res.status(500).json(err);

   if (results.length > 0) {
    return res.status(400).json({
     message: "Login ID or Email already exists"
    });
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   const sql =
   "INSERT INTO users (login_id,name,email,password,role) VALUES (?,?,?,?,?)";

   db.query(
    sql,
    [login_id, name, email, hashedPassword, role],
    (err, result) => {

     if (err) return res.status(500).json(err);

     res.json({
      message: "User created successfully"
     });

    }
   );

  }
 );

};
exports.login = (req, res) => {

 const { login_id, password } = req.body;

 const sql = "SELECT * FROM users WHERE login_id = ?";

 db.query(sql, [login_id], async (err, results) => {

  if (err) return res.status(500).json(err);

  if (results.length === 0) {
   return res.status(400).json({
    message: "Invalid Login Id or Password"
   });
  }

  const user = results[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
   return res.status(400).json({
    message: "Invalid Login Id or Password"
   });
  }

  const token = jwt.sign(
   { id: user.id, role: user.role },
   process.env.JWT_SECRET,
   { expiresIn: "1d" }
  );

  res.json({
   message: "Login successful",
   token
  });

 });

};