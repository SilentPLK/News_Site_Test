//get csrf token for validation
var hiddenInputs = document.querySelectorAll('input[type="hidden"]');
var inputToken = hiddenInputs[0];
var csrf_name = inputToken.name;
var csrf_hash = inputToken.value;

//defining structure for jsonform system
var jsonFormObject = {
    schema: {
        structure: {
            type: 'string',
            enum: [''],
        },
        id: {
            type: 'hidden',
            default: 'none'
        },
    },
    form: [
        {
            key: 'id',
            disabled: false
        },
        {
            key: 'structure',
            disabled: false,
            titleMap : {},
            onChange: function (evt) {
                onChangeForm(evt)
            }
        },
    ],
    value : {
  
    },
}

var jsonFormObject2 = {
    schema:{
        tableName : {
            type: 'string',
            title: "Table Name"
        },
        columnName : {
            type: 'string',
            title: "Column Name"
        },
        columnTitle : {
            type: 'string',
            title: "Column Title"
        },
        attributeObj : {
            type: 'object',
            title: 'Attributes',
            properties:{

            }
        }
    },
    form:[
        {
            key: 'tableName',
            disabled: false,
        },
        {
            key: 'columnName',
            disabled: false,
        },
        {
            key: 'columnTitle',
            disabled: false,
        },
        
    ],
    values:{}
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
        data: "meta_tables_id",
        title: "meta_tables Id",
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
        data: "column_name",
        title: "Column Name",
        type: "text",
    },
    {
        data: "column_title",
        title: "Column Title",
        type: "text",
    },
    {
        data: "json",
        title: "JSON",
        type: "text",
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
                    let tempJsonForm2 = JSON.parse(JSON.stringify(jsonFormObject2))
                    tempJsonForm2.form.push({type: 'submit', title: 'Save Changes'})
                    tempJsonForm2['onSubmit'] = function(errors, values) {

                        let constructUrl = `${baseUrl}/jsonform/`
                        constructUrl += "upload"
                        // Create a FormData object
                        let formData = new FormData();

                        // Append regular values
                        formData.append(csrf_name, csrf_hash);
                        formData.append('rowdata', JSON.stringify(values));
                        console.log(values)
                        /*$.ajax({
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
                        });*/

                    }
                    
                    document.getElementById("jsonForm").innerHTML = ""
                    document.getElementById('jsonForm-2').innerHTML = ""


                    $("#jsonForm").jsonForm(tempJsonForm)
                    $('#jsonForm-2').jsonForm(tempJsonForm2)

                    $('#myModalLabel').text('Create');
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
                            url: `${baseUrl}/jsonform/configure/meta/delete${queryString}`,
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

    let structure
    //gets the structure data
    for(let i = 0; i < schemaTables.length; i++){
        if(schemaTables[i].id == selectedData[0].meta_tables_id){
            structure = JSON.parse(schemaTables[i].structure)
            break;
        }
    }

    createDynamicForm(structure, selectedData[0], selectedData[0].meta_tables_id, selectedData[0].id)

    //setup the original form and show the form
    let tempJsonForm = JSON.parse(JSON.stringify(jsonFormObject))
    tempJsonForm.value = {
        structure: selectedData[0].meta_tables_id
    }
    $("#jsonForm").jsonForm(tempJsonForm)

    $('#myModalLabel').text('Edit');
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

    let structure
    //gets the structure data
    for(let i = 0; i < schemaTables.length; i++){
        if(schemaTables[i].id == selectedData[0].meta_tables_id){
            structure = JSON.parse(schemaTables[i].structure)
            break;
        }
    }

    createDynamicForm(structure, selectedData[0], selectedData[0].meta_tables_id, false)

    //setup the original form and show the form
    let tempJsonForm = JSON.parse(JSON.stringify(jsonFormObject))
    tempJsonForm.value = {
        structure: selectedData[0].meta_tables_id
    }
    $("#jsonForm").jsonForm(tempJsonForm)

    $('#myModalLabel').text('Create');
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

    extraDef.forEach((element) => {
        tempColumnDef.shift()
    })
    selectedData[0] = rowData

    let structure
    //gets the structure data
    for(let i = 0; i < schemaTables.length; i++){
        if(schemaTables[i].id == selectedData[0].meta_tables_id){
            structure = JSON.parse(schemaTables[i].structure)
            break;
        }
    }

    createDynamicForm(structure, selectedData[0], selectedData[0].meta_tables_id, false, true)

    //setup the original form and show the form
    let tempJsonForm = JSON.parse(JSON.stringify(jsonFormObject))
    tempJsonForm.value = {
        structure: selectedData[0].meta_tables_id
    }
    tempJsonForm.schema.structure['disabled'] = true
    $("#jsonForm").jsonForm(tempJsonForm)

    $('#myModalLabel').text('View');
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
            url: `${baseUrl}/jsonform/configure/meta/delete${queryString}`,
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



  //populate select field with choices for schemas
  function populateStructure(){
    schemaTables.forEach((entry)=>{
        jsonFormObject.schema.structure.enum.push(entry.id)
        jsonFormObject.form[1].titleMap[entry.id] = entry.table_name
    })
  }

  populateStructure()


  //populate a 2nd jsonform with the choice of the 1st jsonform

  function onChangeForm(evt){
    //gets the id of the chosen structure
    let value = $(evt.target).val();
    let structure
    //gets the structure data
    for(let i = 0; i < schemaTables.length; i++){
        if(schemaTables[i].id == value){
            structure = JSON.parse(schemaTables[i].structure)
            break;
        }
    }
    
    createDynamicForm(structure, false, value)
  }

  function createDynamicForm(structure, data = false, table_id, id = false, view = false){
    let tempJsonForm = JSON.parse(JSON.stringify(jsonFormObject2))
    console.log(structure)
    //check if structure exists
    if(structure == null){
        tempJsonForm.form.push({type: 'submit', title: 'Save Changes'})
        document.getElementById('jsonForm-2').innerHTML = ""
        $('#jsonForm-2').jsonForm(tempJsonForm)
        return
    }
    //dynamically add the input fields from structure
    for(let i = 0; i < structure.length; i++){
        let tempSchema = {}

        //add the input type:
        tempSchema['type'] = structure[i].inputType
        tempSchema['title'] = structure[i].attribute

        if(view){
            tempSchema['disabled'] = true
        }


        //if the inputtype is select, create enum from choice
        if(structure[i].inputType == 'select'){
            tempSchema['type'] = 'string'
            tempSchema['enum'] = structure[i].choices.split('\r\n')
        }

        //append the data to the form
        tempJsonForm.schema.attributeObj.properties[structure[i].attribute] = tempSchema
        if(view){
            tempJsonForm.form.push({key: 'attributeObj.' + structure[i].attribute, disabled: true})
        } else{
            tempJsonForm.form.push('attributeObj.' + structure[i].attribute)
        }
        
        
    }
    
    tempJsonForm.form.push({type: 'submit', title: 'Save Changes'})
    if(view){
        tempJsonForm.form[0].disabled = true
        tempJsonForm.form[1].disabled = true
        tempJsonForm.form[2].disabled = true
    }
    //add data to the form, if provided
    if(data){
        tempJsonForm.value = {
            tableName : data.table_name,
            columnName : data.column_name,
            columnTitle : data.column_title,
            attributeObj : JSON.parse(data.json)
        }
    }



    tempJsonForm['onSubmit'] = function(errors, values) {
        let tempValues = values
        tempValues['meta_tables_id'] = table_id
        tempValues['id'] = 'none'
        if(id){
            tempValues['id'] = id
        }
        let constructUrl = `${baseUrl}/jsonform/configure/`
        constructUrl += "meta/upload"
        // Create a FormData object
        let formData = new FormData();

        // Append regular values
        formData.append(csrf_name, csrf_hash);
        formData.append('rowdata', JSON.stringify(tempValues));

        console.log(tempValues)
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


    document.getElementById('jsonForm-2').innerHTML = ""
    $('#jsonForm-2').jsonForm(tempJsonForm)

  }