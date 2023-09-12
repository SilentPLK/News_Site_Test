//make the url to get database data
const baseUrl = `http://localhost:8080`;
//get csrf token for validation
var hiddenInputs = document.querySelectorAll('input[type="hidden"]');
var inputToken = hiddenInputs[0];
var csrf_name = inputToken.name;
var csrf_hash = inputToken.value;


//defining columns
/*var columnDefs = [
  {
    data: "id",
    title: "Id",
    type: "number",
    readonly : true,
  },
  {
    data: "title",
    title: "Title",
    type: "text",
  },
  {
    data: "slug",
    title: "Slug",
    type: "text",
    readonly : true,
  },
  {
    data: "body",
    title: "Body",
    type: "textarea",
  },
];*/

// datatable name
var newsTable;

// creates the datatable
async function createDataTable(){
  newsTable = $('#newsList').DataTable({
    "sPaginationType": "full_numbers",
    data: dataSet,
    columns: columnDefs,
    columnDefs : [
      { targets: [0,1,2,3], searchable: false }
    ],
    dom: 'Bfrtip',  
    responsive: true,
    //altEditor: true,     // Enable altEditor
    buttons: [
    {
      text: 'Add',
      name: 'add',
      action: function(){
        let tempColumnDef = columnDefs.slice()
          
        extraDef.forEach((element) =>{
          tempColumnDef.shift()
        })
        let tempJsonForm = createForm(tempColumnDef)
        tempJsonForm = addSelectFile(tempJsonForm)
        document.getElementById("jsonForm").innerHTML = ""
        $("#jsonForm").jsonForm(
          tempJsonForm
        )
        //change files to multiple
        let fileInput = document.querySelector('input[name="images"]');
        fileInput.setAttribute("multiple", "multiple");
        //adds place for image preview
        let previewElement = document.createElement("ul");
        previewElement.classList.add("file-list")
        
        fileInput.parentNode.insertBefore(previewElement, fileInput.nextElementSibling)

        //insertAfter(fileInput, `<ul id="imageContainer" class="file-list"></ul><br></br>`)
        //add event listener to preview files
        fileInput.addEventListener('change', function (e) {
          handleFileUpload(e, previewElement);
        });

        $('#myModalLabel').text('Create news');
        $('#jsonModal').modal('show');

        createFiltering()
      }
    },
    {
      text: 'Delete',
      name: 'delete',
      action: function(){
        let selectedData = [];

        // Iterate through each checkbox
        $('input[name="delete"]:checked').each(function () {
          let row = $(this).closest('tr');
          let rowData = newsTable.row(row).data();
          selectedData.push(rowData);
        });

        //modify the confirmation box data:
        $('#modalTitle').text('Delete Confirmation');
        $('#modalText').text(`Are you sure you want to delete ${selectedData.length} rows?`);

        //change text if only 1 row is selected
        if(selectedData.length == 1){
          $('#modalText').text(`Are you sure you want to delete ${selectedData.length} row?`)
        }


        // create a confirmation box
        $('#confirmModal').on('click', '#confirmDeleteButton', function() {
          let tempData = {
            rowdata: selectedData
          };

          let queryString = `?${csrf_name}=${csrf_hash}`;
          //add the id of the row for deletion
          tempData.rowdata.forEach(entry =>{
            queryString += `&id[]=${entry.id}`;
          })
          

          $.ajax({
            url: `${baseUrl}/news/deleteNews${queryString}`,
            contentType: 'application/json',
            type: 'GET',
            data: JSON.stringify(tempData),
            success: function(){
              // Refresh the page to regenerate CSRF token
              location.reload();
            },
            error: function(){
              // Refresh the page to regenerate CSRF token
              location.reload();
            },
          });

        // Close the modal after confirmation
        $('#confirmModal').modal('hide');
        });

      // Open the confirmation modal
      $('#confirmModal').modal('show');
      }
    }
    ],
  });
}

//adds extra collumns to the datatable
var extraDef = [
  {
    data: null,
    title : "View",
    render: function (data, type, row, meta) {
      return '<button class="btn btn-primary fa fa-eye" id="viewbutton" title="View"></button>';
    },
  },
  {
    data: null,
    title : "Edit",
    render: function (data, type, row, meta) {
      return '<button class="btn btn-primary fa fa-pencil" id="editbutton" title="Edit"></button>';
    },
  },
  {
    data: null,
    title : "Del",
    render: function (data, type, row, meta) {
      return '<a class="delbutton fa fa-minus-square btn btn-danger" id="deletebutton"></a>';
    },
  },
  {
    data: null,
    title : "",
    multiple: true,
    render: function (data, type, row, meta) {
      return '<input type="checkbox" id="deleteCheck" name="delete"/>';
    },
  },
]

extraDef.forEach((element) =>{
  columnDefs.unshift(element)
})

createDataTable()



//select filtering function
function createFiltering(initial = false) {
  let data;

  $.ajax({
      url: `${baseUrl}/news/getSubCategoryData`,
      success: function(response) {
          data = JSON.parse(response)
          // Get the select elements
          let categoryIdSelect = document.querySelector('select[name="category_id"]');
          let categorySubIdSelect = document.querySelector('select[name="category_sub_id"]');

          //if initial value is specified it is used:
          let initialSubCategoryValue;
          let change = false
          if(initial){
            initialSubCategoryValue = categorySubIdSelect.value;
          }
          // Add event listener to detect changes in category_id
          categoryIdSelect.addEventListener('change', function() {
              // Get the selected value from category_id
              let selectedCategoryId = this.value;
              console.log(this.value)
              // Disable category_sub_id select if default value is selected, otherwise enable it
              if (selectedCategoryId === 'default') {
                  categorySubIdSelect.disabled = true;
              } else {
                  categorySubIdSelect.disabled = false;
              }

              // Clear existing options in category_sub_id select
              categorySubIdSelect.innerHTML = '';


              // If a non-default category is selected, filter and populate options in category_sub_id
              if (selectedCategoryId !== 'default') {
                  let filteredData = data.filter(item => item.category_id === selectedCategoryId);
                  filteredData.forEach(item => {
                      let option = document.createElement('option');
                      option.value = item.id;
                      option.textContent = item.sub_category;
                      categorySubIdSelect.appendChild(option);
                  });
              }
              if(initial && !change){
                categorySubIdSelect.value = initialSubCategoryValue;
                change = true
              }
          });

          //launch the event listener for initial value
          categoryIdSelect.dispatchEvent(new Event('change'));

      },
      error: function() {
          location.reload();
      },
  });

}

//adding functionality to inline buttons:
//edit
$(document).on('click', "[id^='newsList'] #editbutton", 'tr', function (x) {
  // Gets the data from the row the button was clicked
  let tableID = $(this).closest('table').attr('id');
  let dataTable = $('#' + tableID).DataTable();
  let selectedData = []
  // Gets the clicked rows data
  let row = dataTable.row($(this).closest('tr'));
  let rowData = row.data();

  let tempColumnDef = columnDefs.slice();

  extraDef.forEach((element) =>{
    tempColumnDef.shift()
  })
  selectedData[0] = rowData

  let tempJsonForm = createForm(tempColumnDef, selectedData)
  tempJsonForm = addSelectFile(tempJsonForm)
  addGallery(tempJsonForm)
});

//view
$(document).on('click', "[id^='newsList'] #viewbutton", 'tr', function (x) {
  // Gets the data from the row the button was clicked
  let tableID = $(this).closest('table').attr('id');
  let dataTable = $('#' + tableID).DataTable();
  let selectedData = []

  // Gets the clicked rows data
  let row = dataTable.row($(this).closest('tr'));
  let rowData = row.data();

  let tempColumnDef = columnDefs.slice();
  console.log(tempColumnDef)
  extraDef.forEach((element) =>{
    tempColumnDef.shift()
  })

  selectedData[0] = rowData

  let tempJsonForm = createForm(tempColumnDef, selectedData, true)
  addGallery(tempJsonForm, false)

  $('#myModalLabel').text('Article');
  $('#jsonModal').modal('show');
});

//delete
$(document).on('click', "[id^='newsList'] #deletebutton", 'tr', function (x) {
  let tableID = $(this).closest('table').attr('id');
  let dataTable = $('#' + tableID).DataTable();
  let selectedData = []
  // Gets the clicked rows data
  let row = dataTable.row($(this).closest('tr'));
  let rowData = row.data();

  selectedData[0] = rowData

  //modify the confirmation box data:
  $('#modalTitle').text('Delete Confirmation');
  $('#modalText').text(`Are you sure you want to delete this row?`);


  // create a confirmation box
  $('#confirmModal').on('click', '#confirmDeleteButton', function() {
    let tempData = {
      rowdata: selectedData
    };

    let queryString = `?${csrf_name}=${csrf_hash}`;
    //add the id of the row for deletion
    queryString += `&id[]=${tempData.rowdata[0].id}`;

    $.ajax({
      url: `${baseUrl}/news/deleteNews${queryString}`,
      contentType: 'application/json',
      type: 'GET',
      data: JSON.stringify(tempData),
      success: function(){
        // Refresh the page to regenerate CSRF token
        location.reload();
      },
      error: function(){
        // Refresh the page to regenerate CSRF token
        location.reload();
      },
    });

    // Close the modal after confirmation
    $('#confirmModal').modal('hide');
  });

  // Open the confirmation modal
  $('#confirmModal').modal('show');
});

//adds the ability to select files to the form
function addSelectFile(jsonForm){
  //remove submit button before adding files field
  jsonForm.form.pop()

  jsonForm.schema['images'] = {
    title : "Upload Files",
    type: 'file',
  }

  let submit = {
    title: "Submit",
    type: "submit",
  }

  jsonForm.onSubmit = function (errors, values){
      //check if id is inputted to determine wether to create a new entry or edit a existing one
      
      let constructUrl = `${baseUrl}/news/`
      constructUrl += "createNews"
      // Create a FormData object
      let formData = new FormData();

      // Append regular values
      formData.append(csrf_name, csrf_hash);
      formData.append('rowdata', JSON.stringify(values));

      // Append files
      let fileInput = document.querySelector('input[name="images"]');
      for (let i = 0; i < fileInput.files.length; i++) {
        formData.append('images[]', fileInput.files[i]);
      }

      $.ajax({
        url: constructUrl,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(){
          //refresh the page to regenerate csrf token
          location.reload()
        },
        error: function(){
          location.reload()
        }
      });
      
    }
    console.log(jsonForm)
  jsonForm.form.push('images')
  jsonForm.form.push(submit)
  return jsonForm
}

//adds a gallery to the form
function addGallery(jsonForm, edit = true){
  let id = jsonForm.value.id

  //get images for gallery
  let url = `${baseUrl}/upload/getImages?id=${id}`;

  $.ajax({
    url: url,
    type: 'GET',
    success: function(response){
      
      response = JSON.parse(response)
      if(Array.isArray(response) && response.length === 0){
        console.log('empty')
        jsonForm.onSubmit = function (errors, values){
          //check if id is inputted to determine wether to create a new entry or edit a existing one
          
          let constructUrl = `${baseUrl}/news/`
          constructUrl += "editNews"
          // Create a FormData object
          let formData = new FormData();
    
          // Append regular values
          formData.append(csrf_name, csrf_hash);
          formData.append('rowdata', JSON.stringify(values));
    
          // Append files
          let fileInput = document.querySelector('input[name="images"]');
          for (let i = 0; i < fileInput.files.length; i++) {
            formData.append('images[]', fileInput.files[i]);
          }
    
          $.ajax({
            url: constructUrl,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(){
              //refresh the page to regenerate csrf token
              location.reload()
            },
            error: function(){
              location.reload()
            }
          });
        }

        document.getElementById("jsonForm").innerHTML = ""
        $("#jsonForm").jsonForm(
          jsonForm
        )

        if(edit){
          
          //change files to multiple
          let fileInput = document.querySelector('input[name="images"]');
          fileInput.setAttribute("multiple", "multiple");
          //adds place for image preview
          let previewElement = document.createElement("ul");
          previewElement.classList.add("file-list")
        
          fileInput.parentNode.insertBefore(previewElement, fileInput.nextElementSibling)

          //insertAfter(fileInput, `<ul id="imageContainer" class="file-list"></ul><br></br>`)
          //add event listener to preview files
          fileInput.addEventListener('change', function (e) {
            handleFileUpload(e, previewElement);
          });
        }
      } else {
        jsonForm.form.pop()

        // Create an array field for the gallery images with checkboxes
        jsonForm.schema['gallery'] = {
          type: "array",
          title: "Options",
          items: {
            type: "string",
            title: "Option",
            enum: []
          }
        };
        
        galleryForm = {
          key: "gallery",
          type: "checkboxes",
          titleMap: {}
        }

        if(!edit){
          galleryForm['disabled'] = true
        }

        response.forEach(image=>{
          jsonForm.schema.gallery.items.enum.push(image.id)
          console.log(image.type)
          if(image.type != 'image'){
            galleryForm.titleMap[image.id] = `<i class="fa fa-file"></i> <a href="${baseUrl}/news/file/${image.id}" target="_blank">${image.name}</a>`
            return
          }
          galleryForm.titleMap[image.id] = `<i class="fa fa-image"></i> ${image.name}<br><img class="uploaded-image" src="${image.url}"></img>`
        })


        jsonForm.form.push(galleryForm);

        let submit = {
          title: 'Submit',
          type: 'submit',
        };

        if (edit){
          jsonForm.form.push(submit);
        }
        

        //change the submit function to commmodate the added forms:
        if(edit){
          jsonForm.onSubmit = function (errors, values){
            //check if id is inputted to determine wether to create a new entry or edit a existing one
            
            let constructUrl = `${baseUrl}/news/`
            constructUrl += "editNews"
            // Create a FormData object
            let formData = new FormData();
      
            // Append regular values
            formData.append(csrf_name, csrf_hash);
            formData.append('rowdata', JSON.stringify(values));
      
            // Append files
            let fileInput = document.querySelector('input[name="images"]');
            for (let i = 0; i < fileInput.files.length; i++) {
              formData.append('images[]', fileInput.files[i]);
            }
            

            $.ajax({
              url: `${baseUrl}/upload/deleteImages?ids=${JSON.stringify(values.gallery)}`,
              contentType: 'application/json',
              type: 'GET',
              success: function(){},
              error: function(){}
            });

            $.ajax({
              url: constructUrl,
              type: 'POST',
              data: formData,
              processData: false,
              contentType: false,
              success: function(){
                //refresh the page to regenerate csrf token
                //location.reload()
              },
              error: function(){
                //location.reload()
              }
            });
        }
      }
        document.getElementById("jsonForm").innerHTML = ""
        $("#jsonForm").jsonForm(
        jsonForm
        )
        if(edit){
          //change files to multiple
          let fileInput = document.querySelector('input[name="images"]');
          fileInput.setAttribute("multiple", "multiple");
          //adds place for image preview
          let previewElement = document.createElement("ul");
        
          fileInput.parentNode.insertBefore(previewElement, fileInput.nextElementSibling)

          //insertAfter(fileInput, `<ul id="imageContainer" class="file-list"></ul><br></br>`)
          //add event listener to preview files
          fileInput.addEventListener('change', function (e) {
            handleFileUpload(e, previewElement);
          });
        }
      }
      

      

      $('#myModalLabel').text('Edit the news');
      $('#jsonModal').modal('show');

      createFiltering(true)
    },
    error: function(){
      console.log('fail')
    },
  })

  
}

function handleFileUpload(e, previewElement) {
  let imageContainer = previewElement;
  // Clear out the previous uploaded content
  imageContainer.innerHTML = '<h2>Uploaded Files:</h2>';

  let files = e.target.files;

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    console.log(file);

    let listItem = document.createElement('li');
    let icon = document.createElement('i');
    
    if (file.type.startsWith('image/')) {
      icon.classList.add('fa', 'fa-image');
      listItem.textContent = ' ' + file.name;
    } else {
      icon.classList.add('fa', 'fa-file');
      listItem.textContent = ' ' + file.name;
    }
    
    listItem.insertBefore(icon, listItem.firstChild);
    imageContainer.appendChild(listItem);

    if (file.type.startsWith('image/')) {
      let imgElement = document.createElement('img');
      imgElement.src = URL.createObjectURL(file);
      imgElement.classList.add('uploaded-image');
      imgElement.classList.add('image-spacing');
      imageContainer.appendChild(imgElement);
    }
  }
}