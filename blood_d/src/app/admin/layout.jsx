import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let user = null;

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change");
            const { payload } = await jwtVerify(token, secret);

            await connectToDatabase();
            const dbUser = await User.findById(payload.userId).select("name role email");

            if (dbUser) {
                user = {
                    name: dbUser.name,
                    role: dbUser.role,
                    email: dbUser.email
                };
            }
        } catch (error) {
            console.error("Layout Auth Error:", error.message);
            // Token invalid, clear it? Or just let redirect happen below?
            // For layout, if we want to enforce auth:
            // redirect("/login"); 
            // But maybe we render layout anyway and let page protect? 
            // Admin layout usually implies protected.
        }
    }

    if (!user) {
        redirect("/login");
    }

    return (
        <AdminShell user={user}>
            {children}
        </AdminShell>
    );
}
