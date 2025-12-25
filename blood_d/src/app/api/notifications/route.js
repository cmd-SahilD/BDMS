import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Request from "@/models/Request";
import Camp from "@/models/Camp";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const notifications = [];

        // Fetch recent blood requests for this user (pending ones)
        const recentRequests = await Request.find({
            $or: [
                { requesterId: user.userId },
                { providerId: user.userId }
            ],
            status: { $in: ["Pending", "Accepted", "Rejected"] }
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('requesterId', 'facilityName name')
        .populate('providerId', 'facilityName name');

        recentRequests.forEach(req => {
            const isRequester = req.requesterId?._id.toString() === user.userId;
            let message = '';
            let type = 'request';
            
            if (isRequester) {
                if (req.status === "Pending") {
                    message = `Your request for ${req.units} units of ${req.bloodType} is pending`;
                } else if (req.status === "Accepted") {
                    message = `Request for ${req.units} units of ${req.bloodType} was accepted`;
                    type = 'success';
                } else if (req.status === "Rejected") {
                    message = `Request for ${req.units} units of ${req.bloodType} was rejected`;
                    type = 'error';
                }
            } else {
                message = `New request for ${req.units} units of ${req.bloodType} from ${req.requesterId?.facilityName || req.requesterId?.name || 'Hospital'}`;
            }

            notifications.push({
                id: req._id,
                type,
                message,
                time: req.createdAt,
                read: false
            });
        });

        // Fetch upcoming camps
        const upcomingCamps = await Camp.find({
            date: { $gte: new Date() },
            status: { $in: ["Upcoming", "Ongoing"] }
        })
        .sort({ date: 1 })
        .limit(3)
        .populate('organizerId', 'facilityName name');

        upcomingCamps.forEach(camp => {
            const campDate = new Date(camp.date);
            const today = new Date();
            const daysUntil = Math.ceil((campDate - today) / (1000 * 60 * 60 * 24));
            
            let message = '';
            if (daysUntil === 0) {
                message = `Blood camp "${camp.name}" is happening today at ${camp.location}`;
            } else if (daysUntil === 1) {
                message = `Blood camp "${camp.name}" is tomorrow at ${camp.location}`;
            } else {
                message = `Upcoming camp "${camp.name}" in ${daysUntil} days at ${camp.location}`;
            }

            notifications.push({
                id: camp._id,
                type: 'camp',
                message,
                time: camp.createdAt,
                campDate: camp.date,
                read: false
            });
        });

        // Sort by time (most recent first)
        notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

        return NextResponse.json({ 
            notifications: notifications.slice(0, 10),
            unreadCount: notifications.length 
        });
    } catch (error) {
        console.error("Notifications fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}
