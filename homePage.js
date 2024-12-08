document.getElementById("sigup-btn").addEventListener("click", async () => {
  const SignupNameInput = document.getElementById("sigup-name");
  const SignupEmailInput = document.getElementById("sigup-email");
  const SignupPasswordInput = document.getElementById("sigup-password");

  const SignupName = SignupNameInput.value;
  const SignupEmail = SignupEmailInput.value;
  const SignupPassword = SignupPasswordInput.value;

  // Email validation: check if it contains 'example.com'
  const emailRegex = /@example\.com$/;
  if (!emailRegex.test(SignupEmail)) {
    document.getElementById("signup-errMess").innerHTML =
      "Email must contain 'example.com'";
    return; // Stop the function if the email is invalid
  }

  try {
    const response = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: SignupName,
        email: SignupEmail,
        password: SignupPassword,
      }),
    });

    const data = await response.json();
    console.log("Response from server:", data);

    // Display server message
    document.getElementById("signup-errMess").innerHTML = data.message;

    // Clear input fields
    SignupNameInput.value = "";
    SignupEmailInput.value = "";
    SignupPasswordInput.value = "";

    // Navigate to addpost.html
    if (data.message === "Signup successful!") {
      window.location.href = "./addpost.html";
    }
  } catch (error) {
    console.error(error);
  }
});

// end --------------------------------------------------------------------------------------------------------------------------------------

document.getElementById("login-btn").addEventListener("click", async () => {
  const loginEmailInput = document.getElementById("login-email");
  const loginPasswordInput = document.getElementById("login-password");

  const loginEmail = loginEmailInput.value;
  const loginPassword = loginPasswordInput.value;

  console.log(loginEmail, loginPassword);
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    const data = await response.json();
    console.log("Response from server:", data);

    // Display server message
    document.getElementById("login-errMess").innerHTML = data.message;

    // Clear input fields

    loginEmailInput.value = "";
    loginPasswordInput.value = "";

    // Navigate to addpost.html
    if (data.message === "Login successful!") {
      window.location.href = "./addpost.html";
    }
  } catch (error) {
    console.error(error);
  }
});

//end --------------------------------------------------------------------------------------------------------------------------------------------
async function renderPosts() {
  const main = document.getElementById("renderPost");
  try {
    const response = await fetch("http://localhost:3000/post");
    const data = await response.json();

    // Generate HTML content for posts
    const postsHtml = data
      .map((post) => {
        // Truncate content to show only part of it
        const truncatedContent =
          post.content.length > 200
            ? post.content.slice(0, 200) + "..."
            : post.content;

        return `
        <div id="homePageContent">
            <h4 class="mt-3">${post.title}</h4>
            <p>${truncatedContent}</p>
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-secondary px-4 my-2" data-bs-toggle="modal"
                data-bs-target="#modal-${post._id}">
                Read More
            </button>

            <!-- Modal -->
            <div class="modal fade" id="modal-${post._id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="modalLabel-${post._id}" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="modalLabel-${post._id}">${post.title}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>${post.content}</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
          `;
      })
      .join("");

    // Set the generated HTML to main
    main.innerHTML = postsHtml;
  } catch (error) {
    main.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Call the function when DOM is loaded
document.addEventListener("DOMContentLoaded", renderPosts);
