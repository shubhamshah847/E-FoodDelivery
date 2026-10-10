
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
  }
});




// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"SHUBHAM SHAH" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

  } catch (error) {
   
  console.error("Error sending email:", error);
  throw error;
}
  
};

export async function sendOtp(userEmail, name, otp) {
  const subject = "Your Food Delivery Verification Code 🍔";

  const text = `
Hi ${name},

Welcome to Food Delivery! 🍔

Your OTP for verifying your account is:

${otp}

This OTP is valid for a limited time. Please do not share this code with anyone.

If you did not request this OTP, you can safely ignore this email.

Thanks,
Food Delivery Team
Nepal
`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Food Delivery OTP</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background: #fff7ed;
      font-family: Arial, Helvetica, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 40px 0;
      background: #fff7ed;
    }

    .container {
      width: 90%;
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.10);
    }

    /* HEADER */

    .header {
      background: linear-gradient(135deg, #ff6b35, #ff3d00);
      padding: 35px 25px;
      text-align: center;
      color: white;
    }

    .logo {
      font-size: 42px;
      margin-bottom: 8px;
    }

    .brand {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }

    .tagline {
      margin: 8px 0 0;
      font-size: 14px;
      opacity: 0.9;
    }

    /* CONTENT */

    .content {
      padding: 40px 35px;
      text-align: center;
    }

    .welcome {
      font-size: 24px;
      font-weight: bold;
      color: #222222;
      margin-bottom: 12px;
    }

    .message {
      color: #666666;
      font-size: 15px;
      line-height: 1.7;
      margin-bottom: 25px;
    }

    /* OTP BOX */

    .otp-title {
      font-size: 14px;
      color: #777777;
      margin-bottom: 10px;
    }

    .otp-box {
      display: inline-block;
      background: #fff1eb;
      border: 2px dashed #ff6b35;
      border-radius: 14px;
      padding: 18px 35px;
      margin: 10px 0 20px;
    }

    .otp {
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #ff4d1c;
    }

    .expiry {
      color: #e65100;
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 25px;
    }

    /* SECURITY */

    .security {
      background: #fff8e1;
      border-left: 5px solid #ffb300;
      border-radius: 8px;
      padding: 15px;
      text-align: left;
      margin-top: 25px;
    }

    .security-title {
      color: #e65100;
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 6px;
    }

    .security-text {
      color: #666666;
      font-size: 13px;
      line-height: 1.6;
      margin: 0;
    }

    /* FOOTER */

    .footer {
      background: #fafafa;
      padding: 25px;
      text-align: center;
      border-top: 1px solid #eeeeee;
    }

    .footer-text {
      color: #888888;
      font-size: 12px;
      line-height: 1.6;
      margin: 0;
    }

    .location {
      color: #ff5722;
      font-weight: bold;
    }

    @media only screen and (max-width: 480px) {
      .content {
        padding: 30px 20px;
      }

      .otp {
        font-size: 30px;
        letter-spacing: 5px;
      }

      .otp-box {
        padding: 15px 25px;
      }

      .brand {
        font-size: 24px;
      }
    }
  </style>
</head>

<body>

  <div class="wrapper">

    <div class="container">

      <!-- HEADER -->

      <div class="header">

        <div class="logo">🍔</div>

        <h1 class="brand">
          Food Delivery
        </h1>

        <p class="tagline">
          Delicious food, delivered to your doorstep
        </p>

      </div>


      <!-- CONTENT -->

      <div class="content">

        <div class="welcome">
          Hi ${name}! 👋
        </div>

        <p class="message">
          Welcome to <strong>Food Delivery</strong>!
          We're excited to have you with us.
        </p>

        <p class="message">
          Use the verification code below to complete
          your account verification.
        </p>


        <!-- OTP -->

        <div class="otp-title">
          Your verification code
        </div>

        <div class="otp-box">

          <div class="otp">
            ${otp}
          </div>

        </div>

        <div class="expiry">
          ⏱️ This OTP is valid for a limited time.
        </div>


        <!-- SECURITY -->

        <div class="security">

          <div class="security-title">
            🔐 Keep your OTP safe
          </div>

          <p class="security-text">
            Never share this verification code with anyone,
            including someone claiming to be from Food Delivery.
            Our team will never ask you for your OTP.
          </p>

        </div>


        <p class="message" style="margin-top: 30px;">
          If you didn't request this verification code,
          you can safely ignore this email.
        </p>

        <p class="message">
          Enjoy your meal! 🍕🍔🍜
        </p>

      </div>


      <!-- FOOTER -->

      <div class="footer">

        <p class="footer-text">
          © 2026 Food Delivery
        </p>

        <p class="footer-text">
          Made with ❤️ for food lovers in
          <span class="location">Nepal 🇳🇵</span>
        </p>

        <p class="footer-text">
          This is an automated email. Please do not reply.
        </p>

      </div>

    </div>

  </div>

</body>
</html>
`;

  await sendEmail(userEmail, subject, text, html);
}
export async function regrestationEmail (userEmail,name){
const subject = "Welcome to Food Delivery 🍔 | Registration Successful 🎉"
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
`
const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="
    margin:0;
    padding:0;
    background:#fff7ed;
    font-family:Arial,Helvetica,sans-serif;
">

    <div style="
        max-width:430px;
        margin:35px auto;
        background:#ffffff;
        border-radius:18px;
        overflow:hidden;
        box-shadow:0 8px 25px rgba(249,115,22,0.15);
    ">

        <!-- Header -->
        <div style="
            background:linear-gradient(135deg,#f97316,#ef4444,#ec4899);
            padding:28px 20px;
            text-align:center;
            color:white;
        ">

            <div style="
                font-size:45px;
                margin-bottom:8px;
            ">
                🍔
            </div>

            <h2 style="
                margin:0;
                font-size:22px;
            ">
                Registration Successful!
            </h2>

            <p style="
                margin:8px 0 0;
                font-size:13px;
            ">
                Welcome to Food Delivery 🚴
            </p>

        </div>


        <!-- Content -->
        <div style="
            padding:25px 22px;
            text-align:center;
        ">

            <p style="
                margin:0 0 12px;
                color:#334155;
                font-size:16px;
            ">
                Hi <strong style="color:#f97316;">
                    ${name}
                </strong> 👋
            </p>

            <p style="
                color:#64748b;
                font-size:14px;
                line-height:1.6;
                margin:0;
            ">
                Your account has been successfully created with
                <br>
                <strong style="color:#ef4444;">
                    ${userEmail}
                </strong>
            </p>


            <!-- Food Features -->
            <div style="
                margin-top:20px;
                padding:15px;
                background:#fff7ed;
                border-radius:10px;
                border:1px solid #fed7aa;
                color:#9a3412;
                font-size:14px;
                line-height:1.8;
            ">
                🍕 Delicious Food<br>
                🚴 Fast Delivery<br>
                ❤️ Made for Food Lovers
            </div>


            <p style="
                color:#f97316;
                font-size:14px;
                font-weight:bold;
                margin-top:20px;
            ">
                Your next delicious meal is just a click away! 😋
            </p>

        </div>


        <!-- Footer -->
        <div style="
            background:#fff1f2;
            padding:12px;
            text-align:center;
            font-size:11px;
            color:#9f1239;
        ">
            © Food Delivery Team • Happy Eating! 🍽️
        </div>

    </div>

</body>
</html>
`
sendEmail(userEmail,subject,text,html)
}



