const axios = require('axios');

async function testRegister() {
    try {
        const payload = {
            name: "Test Lab",
            email: "testlab_" + Date.now() + "@example.com",
            password: "password123",
            confirmPassword: "password123",
            role: "lab",
            facilityName: "Test Blood Bank",
            licenseNumber: "LIC12345",
            address: "123 Test St",
            phone: "1234567890",
            agreeToTerms: true
        };
        
        console.log("Sending payload:", payload);

        const response = await axios.post('http://localhost:3000/api/register', payload);
        console.log("Success:", response.status, response.data);
    } catch (error) {
        if (error.response) {
            console.log("Error Status:", error.response.status);
            console.log("Error Data:", error.response.data);
        } else {
            console.log("Error:", error.message);
        }
    }
}

testRegister();
