async function renderPosts() {
  const main = document.getElementById("main-postContent");
  try {
    const response = await fetch("http://localhost:3000/post");
    const data = await response.json();

    // Generate HTML content for posts
    const postsHtml = data
      .map(
        (post) => `
            <div class="add-post-content mt-4" id="addPostContent">
              <h4 class="mt-3">${post.title}</h4>
              <p>${post.content}</p>
              
              <!-- Button trigger modal -->
              <button type="button" class="btn btn-secondary px-4" data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop" onclick="editPost('${post._id}','${post.title}','${post.content}')">
                  Edit
              </button>
    
              <!-- Modal -->
              <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div class="modal-dialog">
                      <div class="modal-content">
                          <div class="modal-header">
                              <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit Post</h1>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                              <div class="mb-3">
                                  <label for="exampleFormControlInput1" class="form-label">Title:</label>
                                  <input type="text" class="form-control" id="exampleFormControlInput1">
                              </div>
                              <div class="mb-3">
                                  <label for="exampleFormControlTextarea1" class="form-label">Content:</label>
                                  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                              </div>
                          </div>
                          <div class="modal-footer">
                              <button type="button" class="btn btn-success w-100" id="edit-post-btn" data-bs-dismiss="modal">Submit</button>
                          </div>
                      </div>
                  </div>
              </div>
              <button class="btn btn-danger" onclick="deletePost('${post._id}')">Delete</button>
            </div>
          `
      )
      .join("");

    // Set the generated HTML to main
    main.innerHTML = postsHtml;
  } catch (error) {
    main.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Call the function when DOM is loaded
document.addEventListener("DOMContentLoaded", renderPosts);

//end---------------------------------------------------------------------------------------------------------------------------------------------------

document.getElementById("addPost-btn").addEventListener("click", async () => {
  const addPostTitle = document.getElementById("addPost-title");
  const addPostContent = document.getElementById("addPost-content");

  const inputTitle = addPostTitle.value;
  const inputContent = addPostContent.value;

  try {
    const response = await fetch("http://localhost:3000/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: inputTitle,
        content: inputContent,
      }),
    });
    const data = await response.json();
    document.getElementById("addPost-errMess").innerHTML = data.message;
    renderPosts();
    addPostTitle.value = "";
    addPostContent.value = "";
  } catch (error) {
    console.log(error);
  }
});

//end------------------------------------------------------------------------------------------------------------------------------------------------------

const deletePost = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/post/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    alert(`${data.title} is successfully deleted`);
    renderPosts();
  } catch (error) {
    alert(error);
  }
};

//end------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const editPost = async (id, title, content) => {
  const titleField = document.getElementById("exampleFormControlInput1");
  const contentField = document.getElementById("exampleFormControlTextarea1");
  const editButton = document.getElementById("edit-post-btn");

  titleField.value = title;
  contentField.value = content;

  editButton.onclick = () => handleEditPost(id);
};

const handleEditPost = async (id) => {
  try {
    const titleField = document.getElementById(
      "exampleFormControlInput1"
    ).value;
    const contentField = document.getElementById(
      "exampleFormControlTextarea1"
    ).value;

    const response = await fetch(`http://localhost:3000/post/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: titleField,
        content: contentField,
      }),
    });
    const data = await response.json();
    alert(`${data.title} is Successfully updated`);
    renderPosts();
  } catch (error) {
    console.error(error);
  }
};
