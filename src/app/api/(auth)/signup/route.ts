import { NextResponse, NextRequest } from 'next/server';
import bcryptjs from 'bcryptjs';
import { createAdmin } from '../../../models/authAdmin';

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { AdminUserName, FirstName, LastName, Email, Password } = reqBody;

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(Password, salt);

        // Prepare admin data for insertion
        const adminData = {
            AdminUserName,
            FirstName,
            LastName,
            Email,
            Password: hashedPassword,
        };
        // Create a new admin
        await createAdmin(adminData);

        return NextResponse.json(
            { message: 'Admin created successfully' },
            { status: 201 }
        );

    } catch (error: any) {
        console.log('Error creating user:', error);

        if (error.sqlState === '45000') {
            return NextResponse.json({ message: error.message }, { status: 400 });
        } else if (error.sqlState === '45001') {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
