import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword ,signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"

import { getDatabase, set, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"

// Initialize Firebase
const auth = getAuth()

const dataBase = getDatabase()


const signUp = () => {

    let firstName = document.getElementById("firstName").value
    let lastName = document.getElementById("lastName").value
    let email = document.getElementById("signUp-email").value
    let password = document.getElementById("signUp-password").value
    let repeatPassword = document.getElementById("signUp-repeat-password").value

    createUserWithEmailAndPassword(auth, email, password)

        .then((resol) => {

            alert("signup successfully")

            let userId = auth.currentUser.uid

            console.log(userId);

            let usersReference = ref(dataBase, "users/" + "(" + firstName + ")" + userId)

            let usersObj = {
                firstName: firstName,
                lastName : lastName ,
                email: email,
                password: password,
                repeatPassword : repeatPassword
            }

            set(usersReference, usersObj)

                .then((resol) => {
                    alert("Your information have saved")

                    window.location.href = "./signIn.html"
                })

                .catch((reject) => {

                    alert("rejected")
                })



            // window.location.href = './signIn.html'  // workable
            // window.location = "./signIn.html"





        })

        .catch((rej) => {

            alert("signup failed!", rej)

        })


}

const login = () => {

    let loginEmail = document.getElementById("login-email")

    let loginPassword = document.getElementById("login-password")

    signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)

        .then((resol) => {

            alert("Successfully login")

            let userId = auth.currentUser.uid

            console.log(userId);



            // let usernameRef = ref(dataBase, "users/" + userId)
            let userReference = ref(dataBase, "users/", userId)

            onValue(userReference, (snapshort) => {

                let a = snapshort.val(); // theek working

                // let b = a.name

                console.log(a);

                // console.log(b); /// undefine

                // console.log(snapshort.val().name); // undefine

                console.log(snapshort.val().username);

                window.location.href = "./blog.html"

                // console.log('user data: ', snapshort); /// theek work
                // console.log(data.val());/// null
                // console.log(data.value); /// undefine  incorrect in js

                // console.log(data.val().username); // error


                // let userData = data.val().name
                // console.log(userData);
                // console.log(userData)
                // document.getElementById("username").innerHTML = userData
            })



            // window.location.href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox"


        })

        .catch((rej) => {

            alert("try again")

        })


}


let signUpBtn = document.getElementById("signup-button")
let loginBtn = document.getElementById("login-button")

if (signUpBtn) {
    signUpBtn.addEventListener("click", signUp)
}
if (loginBtn) {
    loginBtn.addEventListener("click", login)
}

// Blog Post

// Function to create a new blog post
const createBlogPost = () => {
    // debugger
    // Get the user ID of the currently logged-in user
    const userId = auth.currentUser.uid;

    // Get the values from the title and content input fields
    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;

    // Create a reference for the new blog post
    const newBlogPostRef = push(ref(dataBase, `blogPosts/${userId}`));

    // Create an object for the blog post
    const newBlogPost = {
        title: title,
        content: content,
    };

    // Set the new blog post data in the database
    set(newBlogPostRef, newBlogPost)
        .then(() => {
            alert("Do you want to publish your blogs ?");
            // Clear the input fields after creating the blog post
            document.getElementById("post-title").value = "";
            document.getElementById("post-content").value = "";
            displayBlogPosts();
        })
        .catch((error) => {
            alert("Error creating blog post: " + error.message);
        });
};

// Attach a click event listener to the "Create Post" button
const createPostButton = document.getElementById("create-post-button");
if (createPostButton) {
    createPostButton.addEventListener("click", createBlogPost);
}

// ** Blog Listing
// ... Your Firebase setup and createBlogPost function ...

// Function to fetch and display existing blog posts
const displayBlogPosts = () => {
    // debugger
    const userId = auth.currentUser?.uid;
    if (userId) {
        // 
        const blogPostList = document.getElementById("blog-post-list");

        // Reference to the user's blog posts in Firebase
        const userBlogPostsRef = ref(dataBase, `blogPosts/${userId}`);

        // Listen for changes to the user's blog posts
        onValue(userBlogPostsRef, (snapshot) => {
            blogPostList.innerHTML = ""; // Clear the existing list

            // Loop through the blog posts and add them to the list
            for (const postId in snapshot.val()) {
                const post = snapshot.val()[postId];
                const listItem = document.createElement("li");
                listItem.innerHTML = `<strong>${post.title}:</strong> ${post.content}`;
                blogPostList.appendChild(listItem);
            }
        });
    }
};

// Call the displayBlogPosts function to initially populate the list
displayBlogPosts();






    



/////// log out //////
function logOut() {
    signOut(auth)
        .then(() => {
            alert("You loged out !")

            window.location.href = "./index.html"
            
        })

        .catch((error) => {
            alert("Error logging out: " + error.message);
})
}

let logOutBtn = document.getElementById("logOut")
if (logOutBtn) {
    logOutBtn.addEventListener("click", logOut)
}
