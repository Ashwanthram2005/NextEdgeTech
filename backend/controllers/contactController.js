import Contact from "../models/contact.js";
import nodemailer from "nodemailer";

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, address, pincode, service } = req.body;

    // Validate fields
    if (!name || !email || !phone || !address || !pincode || !service) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Save to DB
    const newContact = new Contact({
      name,
      email,
      phone,
      address,
      pincode,
      service,
    });

    await newContact.save();

    // =====================================
    // NODEMAILER EMAIL SETUP
    // =====================================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    // =====================================
    // ADMIN EMAIL TEMPLATE (YOU RECEIVE THIS)
    // =====================================

    const adminHtml = `
      <div style="background:#0a0a0a;padding:30px;font-family:Poppins;color:#fff;">
        <div style="max-width:600px;margin:auto;background:#111;border:1px solid #00ffc6;border-radius:10px;padding:25px;">
          
          <h2 style="color:#00ffc6;margin-bottom:10px;">📩 New Appointment Request</h2>
          <p style="margin:0 0 20px;color:#ccc;">A new service appointment inquiry has been submitted.</p>

          <div style="margin-bottom:10px;">
            <strong style="color:#00ffc6;">Name:</strong>
            <span style="color:#fff;">${name}</span>
          </div>

          <div style="margin-bottom:10px;">
            <strong style="color:#00ffc6;">Email:</strong>
            <span style="color:#fff;">${email}</span>
          </div>

          <div style="margin-bottom:10px;">
            <strong style="color:#00ffc6;">Phone:</strong>
            <span style="color:#fff;">${phone}</span>
          </div>

          <div style="margin-bottom:10px;">
            <strong style="color:#00ffc6;">Address:</strong>
            <span style="color:#fff;">${address}</span>
          </div>

          <div style="margin-bottom:10px;">
            <strong style="color:#00ffc6;">Pincode:</strong>
            <span style="color:#fff;">${pincode}</span>
          </div>

          <div style="margin-bottom:10px;margin-top:20px;">
            <strong style="color:#00ffc6;">Selected Service:</strong>
            <div style="background:#1a1a1a;padding:12px;border-radius:8px;margin-top:5px;color:#ccc;line-height:1.5;">
              ${service}
            </div>
          </div>

          <p style="margin-top:25px;color:#777;font-size:12px;text-align:center;">
            NxtEdge Technologies – Automated Notification
          </p>

        </div>
      </div>
    `;

    const adminMailOptions = {
      from: `"NxtEdge Website" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Appointment Request — ${name}`,
      html: adminHtml,
    };

    await transporter.sendMail(adminMailOptions);

    // =====================================
    // CLIENT AUTO REPLY TEMPLATE
    // =====================================

    const clientHtml = `
      <div style="background:#0a0a0a;padding:30px;font-family:Poppins;color:#fff;">
        <div style="max-width:600px;margin:auto;background:#111;border:1px solid #00ffc6;border-radius:10px;padding:25px;">
          
          <h2 style="color:#00ffc6;text-align:center;margin-bottom:15px;">
            Thank You for Reaching Out to NxtEdge
          </h2>

          <p style="color:#ccc;line-height:1.6;font-size:15px;">
            Hi <strong style="color:#fff;">${name}</strong>,<br><br>
            Your appointment request has been received successfully. 
            Our team will contact you soon with further details.
          </p>

          <h3 style="color:#00ffc6;margin-top:25px;">📝 Your Submitted Details:</h3>
          <div style="background:#1a1a1a;padding:15px;border-radius:8px;color:#ccc;line-height:1.6;">
            <p><strong style="color:#00ffc6;">Service:</strong> ${service}</p>
            <p><strong style="color:#00ffc6;">Phone:</strong> ${phone}</p>
            <p><strong style="color:#00ffc6;">Address:</strong> ${address}</p>
            <p><strong style="color:#00ffc6;">Pincode:</strong> ${pincode}</p>
          </div>

          <p style="margin-top:25px;color:#777;font-size:12px;text-align:center;">
            © ${new Date().getFullYear()} NxtEdge Technologies. All Rights Reserved.
          </p>

        </div>
      </div>
    `;

    const clientMailOptions = {
      from: `"NxtEdge Technologies" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: "Your Appointment Request Has Been Received",
      html: clientHtml,
    };

    await transporter.sendMail(clientMailOptions);

    // Server Response
    res.status(201).json({ message: "Appointment request received." });

  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
