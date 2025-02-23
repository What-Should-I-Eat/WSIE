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
        if (!response.ok) throw new Error("User not found");

        const userData = await response.json();
        document.getElementById("username").innerText = userData.username || "Unknown User";
        document.getElementById("fullName").innerText = userData.fullName || "No Name Provided";
        document.getElementById("profileImage").src = userData.profileImage || "/static/images/default-avatar.png";

        const bioInput = document.getElementById("bioInput");
        const savedBio = document.getElementById("savedBio");
        const saveBioBtn = document.getElementById("saveBioBtn");
        const editBioBtn = document.getElementById("editBioBtn");

        if (userData.bio) {
            bioInput.style.display = "none";
            savedBio.innerText = userData.bio;
            savedBio.style.display = "block";
            editBioBtn.style.display = "block"; 
            saveBioBtn.style.display = "none";  
        } else {
            savedBio.style.display = "none";
            saveBioBtn.style.display = "block"; 
        }

        bioInput.addEventListener("input", () => {
            saveBioBtn.style.display = "block"; 
        });

        saveBioBtn.addEventListener("click", async () => {
            const bio = bioInput.value.trim();

            if (bio.length > 500) {
                alert("Bio must be under 500 characters.");
                return;
            }

            try {
                const saveResponse = await fetch("/api/v1/users/updateBio", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, bio })
                });

                const saveData = await saveResponse.json();
                if (saveData.success) {
                    savedBio.innerText = bio;
                    bioInput.style.display = "none";
                    savedBio.style.display = "block";
                    saveBioBtn.style.display = "none"; 
                    editBioBtn.style.display = "block"; 
                } else {
                    alert("Error saving bio: " + saveData.error);
                }
            } catch (error) {
                console.error("Error updating bio:", error);
            }
        });

        editBioBtn.addEventListener("click", () => {
            bioInput.style.display = "block";
            saveBioBtn.style.display = "block";
            editBioBtn.style.display = "none";
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
    }
});
