$(document).on("click", "#memeDetailsBtn", function() {
  var id = $(this).data('id');

  function memeDetails(id) {
    const memeId = parseInt(id);
  
    $.ajax({
      type: "POST",
      url: "/meme",
      contentType: "application/json",
      data: JSON.stringify({ memeId: memeId }),
      success: function (response) {
        console.log("Success:", response);
        window.location.href = "/meme/" + memeId;
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  }
  memeDetails(id);
});