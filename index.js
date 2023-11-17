const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bodyParser = require("body-parser");
const { request } = require("express");

//middleware
//app.use(cors());
// var cors = require("cors");
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

const PORT = process.env.PORT || 5500;
app.use(express.json()); //req.body
//app.use(express.text());

//ROUTES//
app.use(
  cors({
    // origin: "http://localhost:3000",
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = await pool.query(
      "SELECT * FROM users WHERE username = $1 and password =$2",
      [username, password]
    );

    if (users.rows.length === 1) {
      // Compare the hashed password with the provided password
      const hashedPassword = users.rows[0].password; // Assuming 'password' is the column name in the database
      // res.json(users.rows[0]);
      // You should use a library like bcrypt to compare the hashed password

      if (password === hashedPassword) {
        // Successful login
        res.status(200).json({ message: "Login successful" });
        // res.json(users.rows[0]);
      } else {
        // Incorrect password
        res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      // User not found
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// app.post("/users/register", async (req, res) => {
//   res.header("Access-Control-Allow-Credentials", true);
//   let { usernamename, email, password } = req.body;

//   let errors = [];

//   console.log({
//     username,
//     email,
//     password,
//   });

//   if (!username || !email || !password || !password) {
//     errors.push({ message: "Please enter all fields" });
//   }

//   if (password.length < 6) {
//     errors.push({ message: "Password must be a least 6 characters long" });
//   }

//   if (password !== password) {
//     errors.push({ message: "Passwords do not match" });
//   }

//   if (errors.length > 0) {
//     res.render("register", { errors, username, email, password });
//   } else {
//     hashedPassword = await bcrypt.hash(password, 10);
//     console.log(hashedPassword);
//     // Validation passed
//     pool.query(
//       `SELECT * FROM users
//         WHERE email = $1`,
//       [email],
//       (err, results) => {
//         if (err) {
//           console.log(err);
//         }
//         console.log(results.rows);

//         if (results.rows.length > 0) {
//           return res.render("register", {
//             message: "Email already registered",
//           });
//         } else {
//           pool.query(
//             `INSERT INTO users (name, email, password)
//                 VALUES ($1, $2, $3)
//                 RETURNING id, password`,
//             [username, email, hashedPassword]
//           );
//         }
//       }
//     );
//   }
// });

//
app.post("/staff", async (req, res) => {
  try {
    const { firstname, lastname } = req.body;
    const newstaff = await pool.query(
      "INSERT INTO staff (firstname,lastname) VALUES ($1,$2) RETURNING *",
      [firstname, lastname]
    );

    res.json(newstaff.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/phone", async (req, res) => {
  try {
    const { id, extension } = req.body;
    const newphone = await pool.query(
      "INSERT INTO phone (id, extension) VALUES ($1, $2) RETURNING *",
      [id, extension]
    );

    res.json(newphone.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/NewDept", async (req, res) => {
  try {
    const { id, ext } = req.body;
    const newdept = await pool.query(
      "INSERT INTO phone_mpt (id, ext) VALUES ($1, $2) RETURNING *",
      [id, ext]
    );

    res.json(newdept.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/getall", async (req, res) => {
  try {
    const getall = await pool.query(
      "select st.id,lastname, firstname, ph.extension from staff as st inner join phone as ph on st.id = ph.id order by lastname asc"
    );
    res.json(getall.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/dept", async (req, res) => {
  try {
    const alldepts = await pool.query(
      "select pm.id, pm.type, pm.description, pm.ext from phone_mpt as pm group by pm.type, pm.description, pm.ext, pm.id order by pm.type"
    );
    res.json(alldepts.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//not used

app.get("/selectbyfirstname/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const selectbyfirstname = await pool.query(
      "SELECT * FROM staff WHERE firstname = $1",
      [id]
    );

    res.json(selectbyfirstname.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/staffupdateext/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { extension } = req.body;
    const extensionupdate = await pool.query(
      "UPDATE phone SET  extension = $1 WHERE id = $2",
      [extension, id]
    );

    res.json("Extension was updated!");
  } catch (err) {
    console.error(err.message);
  }
});
app.put("/staffupdatefirstname/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname } = req.body;
    const extensionupdate = await pool.query(
      "UPDATE staff SET firstname = $1 WHERE id = $2",
      [firstname, id]
    );

    res.json("Extension was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/staffupdateext/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { extension } = req.body;
    const extensionupdate = await pool.query(
      "UPDATE phone SET  extension = $1 WHERE id = $2",
      [extension, id]
    );

    res.json("Extension was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/deptupdateext/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ext } = req.body;
    const extensionupdate = await pool.query(
      "UPDATE phone_mpt SET  ext = $1 WHERE id = $2",
      [ext, id]
    );

    res.json("Extension was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/deletedept/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedept = await pool.query("DELETE FROM phone_mpt WHERE id = $1", [
      id,
    ]);
    res.json("dept was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

app.delete("/deletestaff/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletestaff = await pool.query("DELETE FROM staff WHERE id = $1", [
      id,
    ]);
    res.json("staff was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(PORT, () => {
  console.log("server has started on port 5500");
});
