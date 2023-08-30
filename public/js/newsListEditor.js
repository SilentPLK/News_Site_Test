//make the url to get database data
const baseUrl = `http://localhost:8080`;

//get csrf token for validation
var hiddenInputs = document.querySelectorAll('input[type="hidden"]');
var inputToken = hiddenInputs[0];
var csrf_name = inputToken.name;
var csrf_hash = inputToken.value;

//collumn names
// {id, title, slug, body}
var dataSet;

//defining columns
var columnDefs = [
  {
    data: "id",
    title: "Id",
    type: "readonly",
  },
  {
    data: "title",
    title: "Title",
  },
  {
    data: "slug",
    title: "Slug",
    type: "readonly",
  },
  {
    data: "body",
    title: "Body",
    type: "text",
  },
];

// datatable name
var newsTable;

// creates the datatable
async function createDataTable(){
  newsTable = $('#newsList').DataTable({
    "sPaginationType": "full_numbers",
    ajax: {
      url : `${baseUrl}/news/getData`,
      // our data is an array of objects, in the root node instead of /data node, so we need 'dataSrc' parameter
      dataSrc : ''
    },
    columns: columnDefs,
    dom: 'Bfrtip',  
    select: 'single',
    responsive: true,
    altEditor: true,     // Enable altEditor
    buttons: [{
      text: 'Add',
      name: 'add'        // do not change name
    },
    {
      extend: 'selected', // Bind to Selected row
      text: 'Edit',
      name: 'edit'        // do not change name
    },
    {
      extend: 'selected', // Bind to Selected row
      text: 'Delete',
      name: 'delete'      // do not change name
    }],
    onAddRow: function(datatable, rowdata, success, error) {
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
    }
  });
}

createDataTable()