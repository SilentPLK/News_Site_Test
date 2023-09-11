
//add previews for uploaded files
document.getElementById('files').addEventListener('change', function(e) {
  let imageContainer = document.getElementById('imageContainer');
  //clear out the previous uploaded images
  imageContainer.innerHTML = '<h2>Uploaded Images:</h2>';
  
  let files = e.target.files;
  
  for (let i = 0; i < files.length; i++) {
      let file = files[i];
      
      // Check if the file is an image
      if (file.type.startsWith('image/')) {
          //create element to show filename
          let listItem = document.createElement('li');
          listItem.textContent = file.name;
          imageContainer.appendChild(listItem);
          
          //create element to preview the image
          let imgElement = document.createElement('img');
          imgElement.src = URL.createObjectURL(file);
          imgElement.classList.add('uploaded-image');
          imgElement.classList.add('image-spacing');
          imageContainer.appendChild(imgElement);

      }
  }
});

//switching tabs
document.addEventListener("DOMContentLoaded", function () {
  // Get tab buttons and tab content elements
  let uploadTabButton = document.getElementById("upload-tab");
  let editTabButton = document.getElementById("edit-tab");
  let uploadTabContent = document.getElementById("upload-tab-content");
  let editTabContent = document.getElementById("edit-tab-content");

  // Add click event listeners to tab buttons
  uploadTabButton.addEventListener("click", function () {
      uploadTabButton.classList.add("active");
      editTabButton.classList.remove("active");
      uploadTabContent.style.display = "block";
      editTabContent.style.display = "none";
  });

  editTabButton.addEventListener("click", function () {
      editTabButton.classList.add("active");
      uploadTabButton.classList.remove("active");
      editTabContent.style.display = "block";
      uploadTabContent.style.display = "none";
  });
});


//------------------edit-form-block---------------------------

function deleteImages(){
  let ids = []
  //gets the id of checked checkboxes
  $('input[type="checkbox"]:checked').each(function() {
    ids.push($(this).attr('id'));
  });
  console.log(ids)
    //add the id of the row for deletion
    let queryString = `?ids=${JSON.stringify(ids)}`;

    $.ajax({
      url: `${baseUrl}/upload/deleteImages${queryString}`,
      contentType: 'application/json',
      type: 'GET',
      success: function(){
        location.reload();
      },
      error: function(){
        location.reload();
      },
    });
}

function getImages(){
  let contentId = $("#edit-tab-content")
  let data
  $.ajax({
    url: `${baseUrl}upload/getImages`,
    method: "GET",
    success: function(response) {
      data = JSON.parse(response)
      if(data == ""){
        contentId.html("No images uploaded")
        return
      }
      data.forEach(image => {
        //create the container for the image
        let container = $("<div>");
           
        // add file name and checkbox for deleting
        let imageName = $("<p>").html(`<input type='checkbox' id='${image.id}'> <b>▼ ${image.name}</b>`);
        imageName.on('click', function (event) {

          //checks if the checkbox was clicked and returns to not toggle the image
          if ($(event.target).is('input[type="checkbox"]')) {
            return; 
          }

          let img = $(this).next('img'); 
          img.toggle();

          let fileName = $(this).find('b');
          let currentText = fileName.html();
          if (currentText.includes("▼")) {
            fileName.html(currentText.replace("▼", "▶"));
          } else {
            fileName.html(currentText.replace("▶", "▼"));
          }
        });
        container.append(imageName);
        
        // add image
        let img = $("<img>").attr("src", image.url);
        img.addClass('uploaded-image');
        img.addClass('image-spacing');
        container.append(img);
        
        contentId.append(container);
      });

      let saveButton = $("<button>").text("Save Changes");
      saveButton.addClass('btn');
      saveButton.addClass('btn-primary');
      saveButton.on('click', function(){deleteImages()})
      contentId.append(saveButton);
    },
    error: function(){
      data = "Couldn't retrieve data, try again later."
      $("#edit-tab-content").html(data)
    }
  })
  
}



getImages()