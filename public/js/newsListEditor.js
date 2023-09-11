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
        document.getElementById("jsonForm").innerHTML = ""
        $("#jsonForm").jsonForm(
          createForm(tempColumnDef)
        )
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

  document.getElementById("jsonForm").innerHTML = ""
  $("#jsonForm").jsonForm(
    createForm(tempColumnDef, selectedData)
  )

  $('#myModalLabel').text('Edit the news');
  $('#jsonModal').modal('show');

    createFiltering(true)
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

  document.getElementById("jsonForm").innerHTML = ""
  $("#jsonForm").jsonForm(
    createForm(tempColumnDef, selectedData, true)
  )

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
