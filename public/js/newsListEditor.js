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
      { targets: 0, searchable: false }
    ],
    dom: 'Bfrtip',  
    select: 'single',
    responsive: true,
    //altEditor: true,     // Enable altEditor
    buttons: [
    {
      text: 'Add',
      name: 'add',
      action: function(){
        createForm(columnDefs, "jsonForm")
        $('#myModalLabel').text('Create news');
        $('#jsonModal').modal('show');
      }
    },
    {
      extend: 'selected', // Bind to Selected row
      text: 'Edit',
      name: 'edit',
      action: function (e, dt, button, config) {
        let selectedData = dt.rows({ selected: true }).data();
        
        // Check if any rows are selected
        if (selectedData.length > 0) {
          createForm(columnDefs, "jsonForm", selectedData)
          $('#myModalLabel').text('Edit the news');
          $('#jsonModal').modal('show');
        }
      }
    },
    {
      extend: 'selected', // Bind to Selected row
      text: 'Delete',
      name: 'delete'      // do not change name
    }
    ],
    /*onAddRow: function(datatable, rowdata, success, error) {
      console.log(rowdata)
      let tempData = {}
      tempData[csrf_name] = csrf_hash
      tempData['rowdata'] = rowdata
      $.ajax({
        url: `${baseUrl}/news/createNews`,
        type: 'POST',
        data: tempData,
        success: function(){
          //refresh the page to regenerate csrf token
          location.reload()
        },
        error: error
      });
    },
    onEditRow: function(datatable, rowdata, success, error) {
      console.log(rowdata)
      let tempData = {}
      tempData[csrf_name] = csrf_hash
      tempData['rowdata'] = rowdata
      $.ajax({
        url: `${baseUrl}/news/editNews`,
        type: 'POST',
        data: tempData,
        success: function(){
          //refresh the page to regenerate csrf token
          location.reload()
        },
        error: error
      });
    },
    onDeleteRow: function(datatable, rowdata, success, error) {
      console.log(rowdata)
      let tempData = {}
      tempData[csrf_name] = csrf_hash
      tempData['rowdata'] = rowdata
      $.ajax({
        url: `${baseUrl}/news/deleteNews/${tempData.rowdata.id}`,
        type: 'DELETE',
        data: tempData,
        success: function(){
          //refresh the page to regenerate csrf token
          location.reload()
        },
        error: error
      });
    }*/
  });
}

createDataTable()