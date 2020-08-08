const form = document.querySelector("form");
const loadingElement = document.querySelector(".loading");
const mewsElement = document.querySelector(".mews");
const deleteBtn = document.querySelector(".fa-trash-alt");
const API_URL = "http://localhost:5000/mews";

loadingElement.style.display = "";

listAllTweets();

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name");
    const content = formData.get("content");

    const mew = {
        name: name,
        content: content
    }

    form.style.display = "none";
    loadingElement.style.display = "";

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(mew),
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
    .then(createdMew => {
        console.log(createdMew);
        form.style.display = "";
        form.reset();
        listAllTweets();
    })
});

mewsElement.addEventListener("click", (e) => {
    if(e.target.className.includes("fa-trash-alt")){
        const tweetDiv = e.target.parentElement.parentElement.parentElement;
        const tweetDivId = tweetDiv.getAttribute("data-bd-id");
        const API_URL_DELETE = `http://localhost:5000/mews/${tweetDivId}`;
        
        fetch(API_URL_DELETE, {
            method: "DELETE"
        })
        .then((response) => response.json())
        .then((data) => window.location.href = data.redirect)
        .catch(err => console.log("err"));

    };
})

function listAllTweets() {
    mewsElement.innerHTML = "";
    fetch(API_URL)
        .then(res => res.json())
        .then(mews => {
            console.log(mews);
            mews.reverse();
            mews.forEach(mew => {
                const dateString = new Date(mew.created).toString();
                const shortData = dateString.substring(0, 24);
            
                const div = 
                    `<div data-bd-id="${mew._id}">
                        <div class="flex">
                            <h4>${mew.name}</h4>
                            <div>
                                <i class="fas fa-edit"></i>
                                <i class="fas fa-trash-alt"></i>
                            </div>
                        </div>
                        <p>${mew.content}</p>
                        <small>${shortData}</small>
                    </div>`;

                mewsElement.innerHTML += div;
            });
            setTimeout(() => {
                loadingElement.style.display = "none";
            }, 375);  
        });
}