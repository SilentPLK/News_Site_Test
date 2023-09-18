//get csrf token for validation
var hiddenInputs = document.querySelectorAll('input[type="hidden"]');
var inputToken = hiddenInputs[0];
var csrf_name = inputToken.name;
var csrf_hash = inputToken.value;

//defining structure for jsonform system
var jsonFormObject = {
    schema: {
        id: {
            type: 'hidden',
            default: 'none'
        },
        tableName : {
            type: 'string',
            title: "Table Name"
        },
      structure: {
        type: "array",
        items: {
          type: "object",
          title: "Attributes",
          properties: {
            attribute: {
                type: "string",
                title: "Attribute Name"
            },
            inputType: {
                type: "string",
                title: "Input type",
                enum: [
                    'text',
                    'textarea',
                    'color',
                    'checkbox',
                    'select',
                ],
            },
            choices: {
                type: "textarea",
                title: "Options for select type",
                description: 'only use if the input type is "select". Each option must be seperated by a line break.'
            }
          }
        }
      }
    },
    form: [
        {
            key: 'id',
            disabled: false
        },
        {
            key: 'tableName',
            disabled: false
        },
      {
        type: "tabarray",
        draggable: false,
        items: {
            type: "section",
            legend: "{{value}}",
            items: [
              {
                key: "structure[].attribute",
                valueInLegend: true,
                disabled: false,
              },
              {
                key: 'structure[].inputType',
                disabled: false
              },
              {
                key: 'structure[].choices',
                disabled: false
                },
          ]
        }
      },
      {
        type: "submit",
        title: "Save changes"
      }
    ],
    value : {
  
    },
  }


//defining columns
var columnDefs = [{
        data: "id",
        title: "Id",
        type: "number",
        readonly: true,
        visible: false,
    },
    {
        data: "table_name",
        title: "Table Name",
        type: "text",
    },
    {
        data: "structure",
        title: "Structure",
        type: "object",
    },
]

//adds extra collumns to the datatable
var extraDef = [{
    data: null,
    title: "View",
    render: function(data, type, row, meta) {
        return '<button class="btn btn-primary fa fa-eye" id="viewbutton" title="View"></button>';
    },
},
{
    data: null,
    title: "Edit",
    render: function(data, type, row, meta) {
        return '<button class="btn btn-primary fa fa-pencil" id="editbutton" title="Edit"></button>';
    },
},
{
    data: null,
    title: "Clone",
    render: function(data, type, row, meta) {
        return '<button class="btn btn-primary fa fa-clone" id="clonebutton" title="Clone"></button>';
    },
},
{
    data: null,
    title: "Del",
    render: function(data, type, row, meta) {
        return '<a class="delbutton fa fa-minus-square btn btn-danger" id="deletebutton"></a>';
    },
},
{
    data: null,
    title: "",
    multiple: true,
    render: function(data, type, row, meta) {
        return '<input type="checkbox" id="deleteCheck" name="delete"/>';
    },
},
]


// datatable name
var formTable;

//add the extra defined datatable collumns
extraDef.forEach((element) => {
    columnDefs.unshift(element)
})

createDataTable()

// creates the datatable
async function createDataTable() {
    formTable = $('#formList').DataTable({
        "sPaginationType": "full_numbers",
        data: dataSet,
        columns: columnDefs,
        columnDefs: [{
            targets: [0, 1, 2, 3],
            searchable: false
        }],
        dom: 'Bfrtip',
        responsive: true,
        buttons: [{
                text: 'Add',
                name: 'add',
                action: function() {
                    let tempColumnDef = columnDefs.slice()

                    extraDef.forEach((element) => {
                        tempColumnDef.shift()
                    })
                    let tempJsonForm = jsonFormObject

                    tempJsonForm['onSubmit'] = function(errors, values) {
                        //check if id is inputted to determine wether to create a new entry or edit a existing one

                        let constructUrl = `${baseUrl}/jsonform/`
                        constructUrl += "upload"
                        // Create a FormData object
                        let formData = new FormData();

                        // Append regular values
                        formData.append(csrf_name, csrf_hash);
                        formData.append('rowdata', JSON.stringify(values));

                        $.ajax({
                            url: constructUrl,
                            type: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function() {
                                //refresh the page to regenerate csrf token
                                location.reload()
                            },
                            error: function() {
                                location.reload()
                            }
                        });

                    }
                    
                    document.getElementById("jsonForm").innerHTML = ""
                    $("#jsonForm").jsonForm(
                        tempJsonForm
                    )

                    $('#myModalLabel').text('Create new meta_table');
                    $('#jsonModal').modal('show');
                }
            },
            {
                text: 'Delete',
                name: 'delete',
                action: function() {
                    let selectedData = [];

                    // Iterate through each checkbox
                    $('input[name="delete"]:checked').each(function() {
                        let row = $(this).closest('tr');
                        let rowData = formTable.row(row).data();
                        selectedData.push(rowData);
                    });

                    //modify the confirmation box data:
                    $('#modalTitle').text('Delete Confirmation');
                    $('#modalText').text(`Are you sure you want to delete ${selectedData.length} rows?`);

                    //change text if only 1 row is selected
                    if (selectedData.length == 1) {
                        $('#modalText').text(`Are you sure you want to delete ${selectedData.length} row?`)
                    }


                    // create a confirmation box
                    $('#confirmModal').on('click', '#confirmDeleteButton', function() {
                        let tempData = {
                            rowdata: selectedData
                        };

                        let queryString = `?${csrf_name}=${csrf_hash}`;
                        //add the id of the row for deletion
                        tempData.rowdata.forEach(entry => {
                            queryString += `&id[]=${entry.id}`;
                        })


                        $.ajax({
                            url: `${baseUrl}/jsonform/delete${queryString}`,
                            contentType: 'application/json',
                            type: 'GET',
                            data: JSON.stringify(tempData),
                            success: function() {
                                // Refresh the page to regenerate CSRF token
                                location.reload();
                            },
                            error: function() {
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


//adding functionality to inline buttons:
//edit
$(document).on('click', "[id^='formList'] #editbutton", 'tr', function(x) {
    // Gets the data from the row the button was clicked
    let tableID = $(this).closest('table').attr('id');
    let dataTable = $('#' + tableID).DataTable();
    let selectedData = []
    // Gets the clicked rows data
    let row = dataTable.row($(this).closest('tr'));
    let rowData = row.data();

    let tempColumnDef = columnDefs.slice();

    extraDef.forEach((element) => {
        tempColumnDef.shift()
    })
    selectedData[0] = rowData

    let tempJsonForm = jsonFormObject
    tempJsonForm.value = {
        id: selectedData[0].id,
        tableName : selectedData[0].table_name,
        structure : JSON.parse(selectedData[0].structure)
    }

    tempJsonForm['onSubmit'] = function(errors, values) {

        let constructUrl = `${baseUrl}/jsonform/`
        constructUrl += "upload"
        // Create a FormData object
        let formData = new FormData();

        // Append regular values
        formData.append(csrf_name, csrf_hash);
        formData.append('rowdata', JSON.stringify(values));

        $.ajax({
            url: constructUrl,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function() {
                //refresh the page to regenerate csrf token
                location.reload()
            },
            error: function() {
                location.reload()
            }
        });

    }

    document.getElementById('jsonForm').innerHTML = ""
    console.log(tempJsonForm)
    $('#jsonForm').jsonForm(tempJsonForm)
    $('#myModalLabel').text('configure meta_table');
    $('#jsonModal').modal('show');


});

//clone
$(document).on('click', "[id^='formList'] #clonebutton", 'tr', function(x) {
    // Gets the data from the row the button was clicked
    let tableID = $(this).closest('table').attr('id');
    let dataTable = $('#' + tableID).DataTable();
    let selectedData = []
    // Gets the clicked rows data
    let row = dataTable.row($(this).closest('tr'));
    let rowData = row.data();

    let tempColumnDef = columnDefs.slice();

    extraDef.forEach((element) => {
        tempColumnDef.shift()
    })
    selectedData[0] = rowData

    let tempJsonForm = jsonFormObject
    tempJsonForm.value = {
        tableName : selectedData[0].table_name,
        structure : JSON.parse(selectedData[0].structure)
    }

    tempJsonForm['onSubmit'] = function(errors, values) {

        let constructUrl = `${baseUrl}/jsonform/`
        constructUrl += "upload"
        // Create a FormData object
        let formData = new FormData();

        // Append regular values
        formData.append(csrf_name, csrf_hash);
        formData.append('rowdata', JSON.stringify(values));

        $.ajax({
            url: constructUrl,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function() {
                //refresh the page to regenerate csrf token
                location.reload()
            },
            error: function() {
                location.reload()
            }
        });

    }

    document.getElementById('jsonForm').innerHTML = ""
    console.log(tempJsonForm)
    $('#jsonForm').jsonForm(tempJsonForm)
    $('#myModalLabel').text('create meta_table');
    $('#jsonModal').modal('show');


});


//view
$(document).on('click', "[id^='formList'] #viewbutton", 'tr', function(x) {
    // Gets the data from the row the button was clicked
    let tableID = $(this).closest('table').attr('id');
    let dataTable = $('#' + tableID).DataTable();
    let selectedData = []

    // Gets the clicked rows data
    let row = dataTable.row($(this).closest('tr'));
    let rowData = row.data();

    let tempColumnDef = columnDefs.slice();
    console.log(tempColumnDef)
    extraDef.forEach((element) => {
        tempColumnDef.shift()
    })

    selectedData[0] = rowData

    let tempJsonForm = JSON.parse(JSON.stringify(jsonFormObject))

    tempJsonForm.value = {
        id: selectedData[0].id,
        tableName : selectedData[0].table_name,
        structure : JSON.parse(selectedData[0].structure)
    }

    document.getElementById('jsonForm').innerHTML = ""
    
    tempJsonForm.form.pop()
    disableAllFields(tempJsonForm.form)
    
    $('#jsonForm').jsonForm(tempJsonForm)
    $('#myModalLabel').text('Article');
    $('#jsonModal').modal('show');
});

//delete
$(document).on('click', "[id^='formList'] #deletebutton", 'tr', function(x) {
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
            url: `${baseUrl}/jsonform/delete${queryString}`,
            contentType: 'application/json',
            type: 'GET',
            data: JSON.stringify(tempData),
            success: function() {
                // Refresh the page to regenerate CSRF token
                location.reload();
            },
            error: function() {
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


//disables fields for view button
function disableAllFields(form) {
    for (let i = 0; i < form.length; i++) {
      form[i].disabled = true;
      if (form[i].type === "tabarray") {
        const sectionItems = form[i].items.items;
        for (let j = 0; j < sectionItems.length; j++) {
          sectionItems[j].disabled = true;
        }
      }
    }
  }