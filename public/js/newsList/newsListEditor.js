//make the url to get database data
const baseUrl = `http://localhost:8080`;
//get csrf token for validation
var hiddenInputs = document.querySelectorAll('input[type="hidden"]');
var inputToken = hiddenInputs[0];
var csrf_name = inputToken.name;
var csrf_hash = inputToken.value;

var data
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

var selectAreas = []

columnDefs.forEach((column) => {
  column['visible'] = (column.show_in_list)
  if(column.type == "select" || column.type == "select-multi"){
    selectAreas[selectAreas.length] = [column.data, (column.type == "select") ? false : true, (column.type == "select") ? true : false]
  }
})
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
          
        tempJsonForm['onSubmit'] = function submitForm(errors, values) {
          // Check if an ID is inputted to determine whether to create a new entry or edit an existing one
          let constructUrl = `${baseUrl}/news/`;
          constructUrl += "createNews"; // Adjust the URL as needed for your use case
        
          // Update the category_sub_id select2 and get the selected values
          let category_sub_id_select = $('select[name="category_sub_id"]').select2('data');
          values.category_sub_id = []
          for (let i in category_sub_id_select){
            values.category_sub_id.push(category_sub_id_select[i]['id'])
          }
                  
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
            success: function () {
              // Refresh the page to regenerate the CSRF token or perform other actions as needed
              //location.reload();
            },
            error: function () {
              //location.reload();
            }
          });
        };
        document.getElementById("jsonForm").innerHTML = ""
        $("#jsonForm").jsonForm(
          tempJsonForm
        )

        createFiltering()

        for(let i = 0; i < selectAreas.length; i++){
          createSelect2Obj(selectAreas[i][0], selectAreas[i][1], selectAreas[i][2])
        }

        $('#myModalLabel').text('Create news');
        $('#jsonModal').modal('show');

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
function createFiltering(initial = false, values=false, disable = false) {
  $.ajax({
    url: `${baseUrl}/news/getSubCategoryData`,
    success: function (response) {
      data = JSON.parse(response);

      // Get the select elements
      let categoryIdSelect = document.querySelector('select[name="category_id"]');
      let categorySubIdSelect = document.querySelector('select[name="category_sub_id"]');

      // Add event listener to detect changes in category_id
      categoryIdSelect.addEventListener('change', function () {
        // Get the selected value from category_id
        let selectedCategoryId = this.value;

        // Disable category_sub_id select if default value is selected, otherwise enable it
        if (selectedCategoryId === 'default') {
          categorySubIdSelect.disabled = true;
        } else {
          categorySubIdSelect.disabled = false;
        }

        // Clear existing options in category_sub_id select
        $(categorySubIdSelect).empty();

        // If a non-default category is selected, filter and populate options in category_sub_id
        if (selectedCategoryId !== 'default') {
          let filteredData = data.filter(item => item.category_id === selectedCategoryId);
          filteredData.forEach(item => {
            let option = new Option(item.sub_category, item.id);
            $(categorySubIdSelect).append(option);
          });
        }

        // Trigger the change event on the category_sub_id select to refresh Select2
        $(categorySubIdSelect).trigger('change');
      });

      // Initialize Select2 for both select fields
      

      // Launch the event listener for initial value
      categoryIdSelect.dispatchEvent(new Event('change'));
      if(values){
        $('select[name="category_sub_id"]').select2().prop("disabled", disable)
        $('select[name="category_sub_id"]').select2().prop("placeholder", "Make a selection")
        $('select[name="category_sub_id"]').select2().val(values).trigger('change');
      }
      
    },
    error: function () {
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
  console.log(tempJsonForm)
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
  addGallery(tempJsonForm, false, true)

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

//adds a gallery to the form
function addGallery(jsonForm, edit = true, disabled = false){
  let id = jsonForm.value.id

  //get images for gallery
  let url = `${baseUrl}/upload/getImages?id=${id}`;

  $.ajax({
    url: url,
    type: 'GET',
    success: function(response){
      
      response = JSON.parse(response)
      if(Array.isArray(response) && response.length === 0){
        jsonForm.onSubmit = function (errors, values){
          let constructUrl1 = `${baseUrl}/news/deleteSubCategoryData?id=${values.id}`

          $.ajax({
            url : constructUrl1,
            type: 'GET',
            success: function(){
              let constructUrl = `${baseUrl}/news/`
              constructUrl += "editNews"

              // Update the category_sub_id select2 and get the selected values
              let category_sub_id_select = $('select[name="category_sub_id"]').select2('data');
              values.category_sub_id = []
              for (let i in category_sub_id_select){
                values.category_sub_id.push(category_sub_id_select[i]['id'])
              }
                      
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
            },
            error: function(){
              location.reload()
            }
          })
          
          
        }

        document.getElementById("jsonForm").innerHTML = ""
        $("#jsonForm").jsonForm(
          jsonForm
        )

      } else {
        if(!disabled){
          jsonForm.form.pop()
        }
        

        // Create an array field for the gallery images with checkboxes
        jsonForm.schema['gallery'] = {
          type: "array",
          title: "Gallery",
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
            let constructUrl1 = `${baseUrl}/news/deleteSubCategoryData?id=${values.id}`

            $.ajax({
              url : constructUrl1,
              type: 'GET',
              success: function(){
                let constructUrl = `${baseUrl}/news/`
                constructUrl += "editNews"

                // Update the category_sub_id select2 and get the selected values
                let category_sub_id_select = $('select[name="category_sub_id"]').select2('data');
                values.category_sub_id = []
                for (let i in category_sub_id_select){
                  values.category_sub_id.push(category_sub_id_select[i]['id'])
                }
                        
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
                    location.reload()
                  },
                  error: function(){
                    location.reload()
                  }
                });
              },
              error: function(){
                location.reload()
              }
            })
          }
        }

        document.getElementById("jsonForm").innerHTML = ""
        $("#jsonForm").jsonForm(
        jsonForm
        )
      }
      let values
      for(let i = 0; i < selectAreas.length; i++){
        values = createSelect2Obj(selectAreas[i][0], selectAreas[i][1], selectAreas[i][2], true ,jsonForm.value[selectAreas[i][0]], disabled)
      }

      $('#myModalLabel').text('Edit the news');
      $('#jsonModal').modal('show');

      createFiltering(true, values, disabled)
      
    },
    error: function(){
      console.log('fail')
    },
  })

  
}

function createSelect2Obj(selectName, multiple = false, event = false, edit = false, values, disabled = false) {
  let selectElement = document.querySelector(`select[name="${selectName}"]`);
  let selectJSON = {
    placeholder: "Make a selection",
    disabled: disabled
  };

  if (multiple) {
    selectElement.setAttribute('multiple', 'multiple');
  }

  let $selectElement = $(selectElement).select2(selectJSON);

  $selectElement.select2(selectJSON);

  if (event) {
    // Attach event handler for select2:select event
    $selectElement.on("select2:select", function (e) {
      // Handle the select2:select event
      let selectedValue = e.params.data.id;

      // Filter and update the options in the category_sub_id select2
      let categorySubIdSelect = document.querySelector('select[name="category_sub_id"]');
      let $categorySubIdSelect = $(categorySubIdSelect);

      // Clear existing options
      $categorySubIdSelect.empty();

      // If a non-default category is selected, filter and populate options in category_sub_id
      if (selectedValue !== 'default') {
        let filteredData = data.filter(item => item.category_id === selectedValue);
        filteredData.forEach(item => {
          let option = new Option(item.sub_category, item.id);
          $categorySubIdSelect.append(option);
        });
      }

      // Trigger the change event to refresh Select2
      $categorySubIdSelect.trigger('change');
    });
  }

  if (edit && values && multiple) {
    // Split the values string into an array
    values = values.split(", ");
  
    // Map values to their corresponding IDs using references
    values = values.map(value => {
      let entry = references.category_sub_id.find(entry => entry.sub_category === value);
      return entry ? entry.id : value;
    });
    return values
  }

}
