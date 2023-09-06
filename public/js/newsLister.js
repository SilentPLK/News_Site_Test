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
  //convert slugs to links
  for (const [key, value] of Object.entries(dataSet)) {
    value.slug = `<a href="/news/${value.slug}">View article</a`
  }

  newsTable = $('#newsList').DataTable({
    "sPaginationType": "full_numbers",
    data: dataSet,
    columns: columnDefs,
    //turns off searching for the link collumn
    columnDefs : [
      { targets: 2, searchable: false }
    ],
  });
}

createDataTable()





