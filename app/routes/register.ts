// app/routes/register.ts
import { ActionFunction, createCookie, data , json} from "@remix-run/node";
import { registerUser } from "~/controller/userController";
import { connectDB } from "~/utils/db.server"; // Ensure DB connection

const authToken = createCookie("auth_token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false, // Use secure cookies in production (HTTPS)
  maxAge: 60 * 60 * 2, // Set expiration to 1 week
  sameSite: "lax", // Lax or Strict depending on your needs
});
const refressToken = createCookie("ref_token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false, // Use secure cookies in production (HTTPS)
  maxAge: 60 * 60 * 24 * 7, // Set expiration to 1 week
  sameSite: "lax", // Lax or Strict depending on your needs
});

export const action: ActionFunction = async ({ request }) => {
  await connectDB(); // Make sure your DB is connected

  try {
    const res = await request.formData();

    const firstName = res.get("firstName") as string;
    const lastName = res.get("lastName") as string;
    const email = res.get("email") as string;
    const password = res.get("password") as string;

    console.log(firstName, lastName, email, password);

    const result = await registerUser({ firstName, lastName, email, password });
    console.log(result);

      const accessTokenHeader = await authToken.serialize(result.accessToken);
      const refreshTokenHeader = await refressToken.serialize(result.refreshToken);

    return json(
      { success: true, data: result },
      {
        status: 200,
        headers: {
          "Set-Cookie": `${accessTokenHeader}, ${refreshTokenHeader}`,
        },
      }
    );
  } catch (error: any) {
    return data({ success: false, message: error.message } , {status: 400 });
  }
};
