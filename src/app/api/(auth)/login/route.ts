import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { fetchAdminByEmail } from "../../../models/authAdmin";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    //check if the user already exists
    const existingAdmin = await fetchAdminByEmail(email);
    console.log("🚀 ~ POST ~ existingUser:", existingAdmin)
    if (!existingAdmin) {
      return NextResponse.json(
        { message: "Email or Password is incorrect" },
        { status: 409 }
      );
    }

    // check if the password is correct
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      existingAdmin.Password
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    //create token data
    const tokenData = {
      id: existingAdmin.AdminID,
      adminUserName: existingAdmin.AdminUserName,
      email: existingAdmin.Email,
    };

    //create a token
    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "3d",
    });

    const response = NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );

    response.cookies.set("admin", token, {
      httpOnly: true,
      secure: true,
    });
    //store token in the local storage
    return response;
  } catch (error: any) {
    console.log("🚀 ~ POST ~ error:", error);
    if (error.sqlState === "45000") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Database error occurred" },
      { status: 500 }
    );
  }
}
