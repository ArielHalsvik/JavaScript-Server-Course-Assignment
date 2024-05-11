$(document).ready(function () {
  $.ajax({
    url: '/memes/coloredMemes',
    method: 'GET',
    dataType: 'json',
    success: function (coloredMemes) {

      coloredMemes.forEach((coloredMeme) => {
        const tableRowId = $(`.tableRow[data-id="${coloredMeme.id}"]`);
        
        if (tableRowId.length > 0) {
          tableRowId.addClass("coloredRow");
        } else {
          console.log("Table row not found for MEME ID:", coloredMeme.id);
        }
      });
    },
    error: function (error) {
      console.error('Error fetching colored memes:', error);
    }
  });
});

$(document).on("click", "#memeDetailsBtn", function() {
  var id = $(this).data('id');
  var button = $(this);

  function colorChange(button, id) {
    const memeId = parseInt(id);
  
    const tableRow = $(button).closest('.tableRow');
  
    if (!tableRow.hasClass("coloredRow")) {
      tableRow.addClass("coloredRow");
  
      $.ajax({
        type: 'POST',
        url: '/memes/coloredMemes',
        data: { memeId: memeId },
        success: function (response) {
          console.log('Success:', response);
        },
        error: function (error) {
          console.error('Error:', error);
        }
      });
    }
  }

  colorChange(button, id);
});