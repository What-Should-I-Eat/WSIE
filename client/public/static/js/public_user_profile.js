document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("/api/v1/check-auth", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    const profilePageContainer = document.querySelector(".profile-container");
    const publicProfileNavItem = document.getElementById(
      "publicProfileNavItem"
    );

    if (!data.isLoggedIn) {
      if (profilePageContainer) {
        profilePageContainer.style.display = "none";
      }
      if (publicProfileNavItem) {
        publicProfileNavItem.style.display = "none";
      }
      return;
    } else {
      if (profilePageContainer) {
        profilePageContainer.style.display = "block";
      }
      if (publicProfileNavItem) {
        publicProfileNavItem.style.display = "block";
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");

    if (!username) {
      document.getElementById("username").innerText = "Username not found";
      document.getElementById("fullName").innerText = "";
      return;
    }

    console.log(`Fetching user data for: ${username}`);
    const userResponse = await fetch(
      `/api/v1/users/findUserData?username=${username}`
    );

    if (!userResponse.ok) throw new Error("User not found");

    const userData = await userResponse.json();
    document.getElementById("username").innerText =
      userData.username || "Unknown User";
    document.getElementById("fullName").innerText =
      userData.fullName || "No Name Provided";

    if (userData.profileImage) {
      document.getElementById("selectedProfileImage").src =
        userData.profileImage;
    }
    const visibilityToggle = document.getElementById("visibilityToggle");
    const visibilityStatus = document.getElementById("visibilityStatus");

    if (userData.isPublic) {
      visibilityToggle.checked = true;
      visibilityStatus.innerText = "Public";
    } else {
      visibilityToggle.checked = false;
      visibilityStatus.innerText = "Private";
    }

    visibilityToggle.addEventListener("change", async () => {
      const newVisibility = visibilityToggle.checked;
      visibilityStatus.innerText = newVisibility ? "Public" : "Private";

      try {
        await fetch("/api/v1/users/updateVisibility", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, isPublic: newVisibility }),
        });
      } catch (error) {
        console.error("Error updating profile visibility:", error);
        alert("Failed to update visibility. Try again later.");
      }
    });
    setupModal(userData.profileImage);
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
          body: JSON.stringify({ username, bio }),
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

function setupModal(selectedImageFromDB) {
  const modal = document.getElementById("stockImageModal");
  const closeButton = document.querySelector(".close");
  const stockImageContainer = document.getElementById("stockImageContainer");
  const changeImageButton = document.getElementById("changeImageBtn");

  changeImageButton.addEventListener("click", () => {
    modal.style.display = "flex";
    loadStockImages(selectedImageFromDB);
  });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

function loadStockImages(selectedImageFromDB) {
  const stockImageContainer = document.getElementById("stockImageContainer");
  stockImageContainer.innerHTML = "";

  const stockImages = [
    "/static/img/stock/stock1.jpg",
    "/static/img/stock/stock2.jpg",
    "/static/img/stock/stock3.jpg",
    "/static/img/stock/stock4.jpg",
    "/static/img/stock/stock5.jpg",
  ];

  stockImages.forEach((imageSrc) => {
    const imgElement = document.createElement("img");
    imgElement.src = imageSrc;
    imgElement.classList.add("stock-image");

    imgElement.style.maxWidth = "120px";
    imgElement.style.maxHeight = "120px";

    if (selectedImageFromDB === imageSrc) {
      imgElement.classList.add("selected");
    }

    imgElement.addEventListener("click", async () => {
      document
        .querySelectorAll(".stock-image")
        .forEach((img) => img.classList.remove("selected"));
      imgElement.classList.add("selected");

      await updateProfileImage(imageSrc);
      document.getElementById("selectedProfileImage").src = imageSrc;
      document.getElementById("stockImageModal").style.display = "none";
    });

    stockImageContainer.appendChild(imgElement);
  });
}

async function updateProfileImage(newImageUrl) {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");

  await fetch("/api/v1/users/updateProfileImage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, profileImage: newImageUrl }),
  });
}
