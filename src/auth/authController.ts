import { Context } from "hono";
import "dotenv/config";
import { createAuthUserService, logInAuthService } from "./authService";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import { sendWelcomeEmail } from "../services/emails";

export const registerUser = async (c: Context) => {
  try {
    // Await user data from request
    const user = await c.req.json();
    console.log("AuthController:", user);

    // Get and hash the user password
    // const hashedPassword = await bcrypt.hash(user.password, 10);
    // user.password = hashedPassword;

    const createdUser = await createAuthUserService(user);
    if (!createdUser) return c.text("User not created", 404);

    // Send welcome email after successful user creation
    const subject = "Welcome to Our Car Rental Website";
    const html = `
    <html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }
        .header {
            background-image: url('https://images.unsplash.com/photo-1603808033191-6f60b3d04021?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
            background-size: cover;
            background-position: center;
            text-align: center;
            padding: 50px 20px;
            color: black;
        }
        .header h1 {
            font-size: 24px;
            margin: 0;
            font-weight: normal;
            color: white;
        }
        .header p {
            font-size: 16px;
            color: white;
        }
        .btn-container {
            margin-top: 20px;
        }
        .btn {
            background-color: #fcb514;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
        }
        .content {
            background-color: #333333;
            color: white;
            text-align: center;
            padding: 30px 20px;
        }
        .content h2 {
            font-size: 25px;
            margin: 0;
            font-weight: normal;
        }
        .content p {
            font-size: 18px;
        }
        .footer {
            background-color: #333333;
            color: white;
            text-align: center;
            padding: 10px 20px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to Our Car Rental Website</h1>
            <p>Dear ${user.fullName}, thank you for registering with us.</p>
            <div class="btn-container">
                <a href="https://yourcarentalwebsite.com" class="btn">Start Renting Your Vehicle Now</a>
            </div>
        </div>
        <div class="content">
            <h2>Welcome To Our Car Rental Service, ${user.fullName}</h2>
            <p>
                Our platform provides comprehensive features to manage your vehicle rentals, reservations, and much more.
                Easily find and rent modern cars including Tesla models with our user-friendly interface.
            </p>
        </div>
        <div class="footer">
            © 2024 CarRentalWebsite. All rights reserved.
        </div>
    </div>
</body>
</html>
  `;

    // Send welcome email after successful user creation
    await sendWelcomeEmail(user.email, subject, html);

    return c.json({ msg: "User created successfully" }, 201);
  } catch (error: any) {
    if (error.message === "User with this email already exists") {
      return c.json({ error: "User with this email already exists" }, 400);
    }
    return c.json({ error: error?.message }, 500);
  }
};

export const loginUser = async (c: Context) => {
  try {
    // Await the user data from request and convert to JSON
    const user = await c.req.json();
    console.log("LoginUserController:", user);

    // Check if the required fields are present
    if (!user.email || !user.password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Check if user exists
    const foundUser = await logInAuthService(user);
    console.log(foundUser);
    if (!foundUser) return c.json({ error: "User not found" }, 404);

    // Validate user password
    const isValid = await bcrypt.compare(
      user.password,
      foundUser?.password as string
    );
    if (!isValid) {
      return c.json({ error: "Incorrect password" }, 401); // Unauthorized
    } else {
      // Create a payload
      let payload = {
        sub: foundUser?.email,
        role: foundUser?.role,
        // Session to expire after 3 hours
        exp: Math.floor(Date.now() / 1000) + 60 * 180,
      };

      // Secret key from environment variables
      let secret = process.env.JWT_SECRET as string;
      const token = await sign(payload, secret); // Create a JWT token

      return c.json(
        {
          token,
          user: {
            id: foundUser.userId,
            image: foundUser.image_url,
            fullName: foundUser.fullName,
            email: foundUser.email,
            role: foundUser.role,
          },
        },
        200
      ); // Return token and user details
    }
  } catch (error: any) {
    console.error("Error logging in:", error);
    return c.json({ error: error?.message }, 400);
  }
};
