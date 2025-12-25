import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import BloodBankShell from "@/components/blood-bank/BloodBankShell";

export default async function BloodBankLayout({ children }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let user = null;

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change");
            const { payload } = await jwtVerify(token, secret);

            await connectToDatabase();
            const dbUser = await User.findById(payload.userId).select("name role email facilityName phone");

            if (dbUser) {
                user = {
                    name: dbUser.name,
                    role: dbUser.role,
                    email: dbUser.email,
                    facilityName: dbUser.facilityName,
                    phone: dbUser.phone
                };
            }
        } catch (error) {
            console.error("Layout Auth Error:", error.message);
        }
    }

    if (!user) {
        redirect("/login");
    }

    return (
        <BloodBankShell user={user}>
            {children}
        </BloodBankShell>
    );
}
