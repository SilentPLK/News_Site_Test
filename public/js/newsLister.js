//make the url to get database data
const baseUrl = `http://localhost:8080`;
const fullUrl = `${baseUrl}/news/getData`;

//collumn names
// {id, title, slug, body}
var dataSet;

//defining columns
/*var columnDefs = [
  {
    data: "title",
    title: "Title",
  },
  {
    data: "body",
    title: "Body",
  },
  {
    data: "slug",
    title: "Link",
  },
  
];*/

// datatable name
var newsTable;

// creates the datatable
function createDataTable(){

  newsTable = $('#newsList').DataTable({
    "sPaginationType": "full_numbers",
    data: dataSet,
    columns: columnDefs,
    //turns off searching for the link collumn
    columnDefs : [
      { targets: 2, searchable: false }
    ],
  });

   // view article through clicking on a listing
   $(document).on('click', "#newsList tbody tr", function () {
    // Get the data of the clicked row\
    let selectedData = []
    selectedData[0] = newsTable.row(this).data();
    createForm(columnDefs, "jsonForm", selectedData, true)
          $('#myModalLabel').text('News article');
          $('#jsonModal').modal('show');
    
  });

}





createDataTable()





