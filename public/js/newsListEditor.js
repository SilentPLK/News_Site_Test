//make the url to get database data
const baseUrl = `http://localhost:8080`;
var tempData;
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
        let tempColumnDef = columnDefs
          tempColumnDef.shift()
          console.log(tempColumnDef)
        createForm(tempColumnDef, "jsonForm")
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
          let tempColumnDef = columnDefs
          tempColumnDef.shift()
          console.log(tempColumnDef)
          createForm(tempColumnDef, "jsonForm", selectedData)
          $('#myModalLabel').text('Edit the news');
          $('#jsonModal').modal('show');
        }
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

        tempData = {}
        tempData[csrf_name] = csrf_hash
        tempData['rowdata'] = selectedData
        console.log(tempData)
        $.ajax({
          url: `${baseUrl}/news/deleteNews`,
          contentType: 'application/json',
          type: 'DELETE',
          data: JSON.stringify(tempData),
          success: function(){
            //refresh the page to regenerate csrf token
            location.reload()
          },
          error: function(){
            //refresh the page to regenerate csrf token
            location.reload()
          },
        });
        
      }
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

//adds checkboxes to the beginning of the datatable
var extraDef = {
  data: null,
  title : "delete",
  multiple: true,
  render: function (data, type, row, meta) {
    return '<input type="checkbox" id="deleteCheck" name="delete"/>';
  },
}
columnDefs.unshift(extraDef)

createDataTable()