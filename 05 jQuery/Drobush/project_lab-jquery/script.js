$(function() {
  var addButton = $("#add-comment"),
      commentBox = $("#comment-box"),
      commentList = $("#comment-list");
  addButton.on('click', function(){
    var comment = $("<div></div>"),
        removeButton = $("<button>-</button>");

    removeButton.prop( "disabled", true );

    removeButton.on('click', function(){
      comment.remove();
    });

    comment.html(commentBox.val());
    commentBox.val('');
    comment.append(removeButton);
    commentList.append(comment);
  });

  commentList.on('click', function(e){
    var selectedItem = $(e.target),
        items = commentList.find("div"),
        buttons = selectedItem.find("button");
    items.each(function(){
        $(this).removeAttr("class");
        $(this).find("button").prop( "disabled", true );
    });
    selectedItem.addClass('active-comment');
    if (buttons.length) {
        selectedItem.find("button").prop( "disabled", false );
    }
  });
});