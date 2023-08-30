//make the url to get database data
const baseUrl = `http://localhost:8080`;
const fullUrl = `${baseUrl}/news/getData`;

//collumn names
// {id, title, slug, body}
var dataSet;

//defining columns
var columnDefs = [
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
  
];

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
}

//fetch the data from the database by calling the controller
fetch(fullUrl, {
  method: 'GET',
})
.then(response => response.json())
.then(data => {

  dataSet = data;
  //change the slug values to be links
  dataSet.forEach(obj => {
    obj.slug = `<a href="/news/${obj.slug}">View article</a`
  });
  createDataTable()

})
.catch(error => {
  console.error('Error fetching data:', error);
});





