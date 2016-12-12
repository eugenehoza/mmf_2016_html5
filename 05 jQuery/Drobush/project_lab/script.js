document.addEventListener("DOMContentLoaded", (event) => {
    let addButton = document.getElementById("add-comment"),
        commentBox = document.getElementById("comment-box"),
        commentList = document.getElementById("comment-list");

    addButton.onclick = (event) => {
        let comment = document.createElement("div"),
            removeButton = document.createElement("button");

        removeButton.innerHTML = "-";
        removeButton.disabled = true;
        removeButton.onclick = (event) => {
            comment.remove();
        };

        comment.innerHTML = commentBox.value;
        commentBox.value = "";
        comment.appendChild(removeButton);
        commentList.appendChild(comment);
    };

    commentList.onclick = (event) => {
        let selectedItem = event.target,
            items = commentList.getElementsByTagName("div"),
            buttons = selectedItem.getElementsByTagName("button");

        for (var i = 0; i < items.length; i++) {
            items[i].removeAttribute("class");
            items[i].getElementsByTagName("button")[0].disabled = true;
        }
        selectedItem.setAttribute("class", "active-comment");

        if (buttons.length) {
            selectedItem.getElementsByTagName("button")[0].disabled = false;
        }
    };
});