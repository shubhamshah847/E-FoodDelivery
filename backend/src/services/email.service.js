
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESENDEMAIL_API_KEY);

// Registration successful email
export async function regrestationEmail(userEmail, name) {
  const subject =
    "Welcome to Food Delivery 🍔 | Registration Successful 🎉";

  const text = `
Hi ${name},

🎉 Your registration was successful!

Your Food Delivery account has been created with ${userEmail}.

🍕 Order your favorite food
🚴 Get it delivered to your doorstep
❤️ Enjoy every bite!

Welcome to Food Delivery!

Best wishes,
Food Delivery Team
Nepal 🇳🇵
`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Successful</title>
</head>

<body style="margin:0;padding:0;background:#fff7ed;font-family:Arial,Helvetica,sans-serif;">

  <div style="max-width:430px;margin:35px auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 25px rgba(249,115,22,0.15);">

    <div style="background:#f97316;padding:28px 20px;text-align:center;color:white;">
      <div style="font-size:45px;margin-bottom:8px;">🍔</div>
      <h2 style="margin:0;font-size:22px;">Registration Successful!</h2>
      <p style="margin:8px 0 0;font-size:13px;">
        Welcome to Food Delivery 🚴
      </p>
    </div>

    <div style="padding:25px 22px;text-align:center;">

      <p style="margin:0 0 12px;color:#334155;font-size:16px;">
        Hi <strong style="color:#f97316;">${name}</strong> 👋
      </p>

      <p style="color:#64748b;font-size:14px;line-height:1.6;">
        Your account has been successfully created with
        <br>
        <strong style="color:#ef4444;">${userEmail}</strong>
      </p>

      <div style="margin-top:20px;padding:15px;background:#fff7ed;border-radius:10px;border:1px solid #fed7aa;color:#9a3412;font-size:14px;line-height:1.8;">
        🍕 Delicious Food<br>
        🚴 Fast Delivery<br>
        ❤️ Made for Food Lovers
      </div>

      <p style="color:#f97316;font-size:14px;font-weight:bold;margin-top:20px;">
        Your next delicious meal is just a click away! 😋
      </p>

    </div>

    <div style="background:#fff1f2;padding:12px;text-align:center;font-size:11px;color:#9f1239;">
      © 2026 Food Delivery Team • Happy Eating! 🍽️
    </div>

  </div>

</body>
</html>
`;

  try {
    const { data, error } = await resend.emails.send({
      from: `SHUBHAM SHAH <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Registration email error:", error);
      return false;
    }

    console.log("Registration email sent:", data?.id);
    return true;
  } catch (err) {
    console.error("Failed to send registration email:", err);
    return false;
  }
}


// OTP verification email
export async function sendOtp(userEmail, name, otp) {
  const subject = "Your Food Delivery Verification Code 🍔";

  const text = `
Hi ${name},

Welcome to Food Delivery! 🍔

Your OTP for verifying your account is:

${otp}

This OTP is valid for 5 minutes. Please do not share this code with anyone.

If you did not request this OTP, you can safely ignore this email.

Thanks,
Food Delivery Team
Nepal 🇳🇵
`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Food Delivery OTP</title>
</head>

<body style="margin:0;padding:30px 10px;background:#fff7ed;font-family:Arial,Helvetica,sans-serif;">

  <div style="max-width:500px;margin:auto;background:#ffffff;padding:30px 20px;border-radius:15px;text-align:center;">

    <h1 style="color:#ff5722;">🍔 Food Delivery</h1>

    <h2>Hi ${name}! 👋</h2>

    <p>Welcome to Food Delivery!</p>
    <p>Use the verification code below to verify your account.</p>

    <div style="background:#fff1eb;padding:20px;border:2px dashed #ff6b35;border-radius:10px;">
      <h1 style="color:#ff4d1c;letter-spacing:8px;margin:0;">
        ${otp}
      </h1>
    </div>

    <p style="color:#e65100;font-weight:bold;">
      ⏱️ This OTP is valid for 5 minutes.
    </p>

    <p>Never share your OTP with anyone.</p>

    <p>If you did not request this code, ignore this email.</p>

    <hr>

    <p style="color:#888;font-size:12px;">
      © 2026 Food Delivery · Made with ❤️ in Nepal 🇳🇵
    </p>

  </div>

</body>
</html>
`;

  try {
    const { data, error } = await resend.emails.send({
      from: `SHUBHAM SHAH <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("OTP email error:", error);
      return false;
    }

    console.log("OTP email sent:", data?.id);
    return true;
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    return false;
  }
}
