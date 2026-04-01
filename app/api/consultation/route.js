import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import { sendConsultationEmails } from "@/lib/resend";

export async function POST(request) {
  try {
    const body = await request.json();

    const requiredFields = [
      "fullName",
      "phoneNumber",
      "email",
      "topic",
      "preferredDate",
      "preferredTime",
    ];

    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { success: false, message: `${field} is required.` },
          { status: 400 }
        );
      }
    }

    const sql = await connectDB();

    const fullName = String(body.fullName).trim();
    const phoneNumber = String(body.phoneNumber).trim();
    const email = String(body.email).trim().toLowerCase();
    const cityArea = String(body.cityArea || "").trim();
    const topic = String(body.topic).trim();
    const cropType = String(body.cropType || "").trim();
    const preferredDate = String(body.preferredDate).trim();
    const preferredTime = String(body.preferredTime).trim();
    const requirement = String(body.requirement || "").trim();

    const [consultation] = await sql`
      INSERT INTO consultations (
        full_name,
        phone_number,
        email,
        city_area,
        topic,
        crop_type,
        preferred_date,
        preferred_time,
        requirement
      )
      VALUES (
        ${fullName},
        ${phoneNumber},
        ${email},
        ${cityArea},
        ${topic},
        ${cropType},
        ${preferredDate},
        ${preferredTime},
        ${requirement}
      )
      RETURNING id
    `;

    try {
      await sendConsultationEmails({
        id: consultation.id,
        fullName,
        phoneNumber,
        email,
        cityArea,
        topic,
        cropType,
        preferredDate,
        preferredTime,
        requirement,
      });
    } catch {
      // Booking is persisted; email failures should not block API success.
    }

    return NextResponse.json({
      success: true,
      message: "Consultation booked successfully.",
      id: String(consultation.id),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
