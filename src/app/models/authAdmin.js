import pool from "../lib/dbConfig"; // Import the connection pool

export const fetchAdminByEmail = async (email) => {
  try {
      const query = 'CALL getAdminByEmail(?)';
      const [rows] = await pool.execute(query, [email]);
      return rows[0][0];  // first[0] is the result of the procedure, second [0] is the first row of the result
  } catch (error) {
      throw error;
  }
};


export const createAdmin = async (admin) => {
  try {
    const { AdminUserName, FirstName, LastName, Password, Email } = admin;
    const query = 'CALL CreateAdmin(?, ?, ?, ?, ?)'; // assuming your procedure requires all five fields
    const [rows] = await pool.execute(query, [AdminUserName, FirstName, LastName, Password, Email]);
    
    return rows[0]; // Adjust according to your procedure's return structure
  } catch (error) {
    throw error;
  }
};
