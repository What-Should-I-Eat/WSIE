document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username"); 

    if (!username) {
        document.getElementById("username").innerText = "Username not found";
        document.getElementById("fullName").innerText = "";
        return;
    }

    try {
        const response = await fetch(`/api/v1/users/findUserData?username=${username}`);
        if (!response.ok) {
            throw new Error("User not found");
        }

        const userData = await response.json();
        const usernameElement = document.getElementById("username");
        const fullNameElement = document.getElementById("fullName");

        if (!usernameElement || !fullNameElement) {
            throw new Error("Required elements #username or #fullName are missing from DOM!");
        }

        // Update UI
        usernameElement.innerText = userData.username || "Unknown User";
        fullNameElement.innerText = userData.fullName || "No Name Provided";

    } catch (error) {
        console.error("Error fetching user data:", error);
        document.getElementById("username").innerText = "Error loading profile";
        document.getElementById("fullName").innerText = "";
    }
});
