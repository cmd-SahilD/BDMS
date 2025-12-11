const BASE_URL = "http://localhost:3000/api";

async function runTest() {
    console.log("Starting Backend Verification (Step 1)...");

    // 1. Register
    const labUser = {
        name: "Test Lab",
        email: `testlab_${Date.now()}@example.com`,
        password: "password123",
        role: "lab",
        facilityName: "Test Facility",
        licenseNumber: "LIC12345",
        phone: "1234567890",
        address: { street: "123 Test St", city: "Test City", state: "TS", zip: "12345" }
    };

    console.log("\n1. Testing Registration...");
    let res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(labUser)
    });

    if (res.status === 201) {
        console.log("✅ Registration Successful");
    } else {
        console.error("❌ Registration Failed:", res.status);
        const txt = await res.text();
        console.error(txt);
        return;
    }

    // 2. Login
    console.log("\n2. Testing Login...");
    res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: labUser.email, password: labUser.password })
    });

    if (res.status !== 200) {
        console.error("❌ Login Failed:", res.status);
        console.error(await res.text());
        return;
    }

    const loginData = await res.json();
    console.log("✅ Login Successful");

    const setCookie = res.headers.get("set-cookie");
    let token = "";
    if (setCookie) {
        // Simple extraction
        const parts = setCookie.split(';');
        for (const part of parts) {
            if (part.trim().startsWith('token=')) {
                token = part.trim().substring(6);
                break;
            }
        }
    }

    if (token) {
        console.log("✅ Token received");
    } else {
        console.log("ℹ️ Token not found in Set-Cookie (Using cookies jar in browser would work)");
    }

    const headers = {
        "Content-Type": "application/json",
        "Cookie": `token=${token}`
    };

    const userId = loginData.user._id;
    console.log("User ID:", userId);

    // 3. Inventory
    console.log("\n3. Testing Inventory...");
    res = await fetch(`${BASE_URL}/inventory`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            facilityId: userId,
            bloodType: "O-",
            units: 10,
            status: "Adequate"
        })
    });

    let invId;
    if (res.status === 201) {
        const data = await res.json();
        invId = data.item._id;
        console.log("✅ Inventory Created:", invId);
    } else {
        console.error("❌ Inventory Create Failed:", await res.text());
    }

    if (invId) {
        // Update
        res = await fetch(`${BASE_URL}/inventory`, {
            method: "PUT",
            headers,
            body: JSON.stringify({
                id: invId,
                units: 20,
                status: "Adequate"
            })
        });
        if (res.status === 200) console.log("✅ Inventory Updated");
        else console.error("❌ Inventory Update Failed");

        // Delete
        res = await fetch(`${BASE_URL}/inventory?id=${invId}`, {
            method: "DELETE",
            headers
        });
        if (res.status === 200) console.log("✅ Inventory Deleted");
        else console.error("❌ Inventory Delete Failed");
    }
}

runTest().catch(e => console.error(e));
