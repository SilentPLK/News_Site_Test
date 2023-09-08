//function generates jsonform from datatable columndefs
function createForm(datatableDefs, formId, data = null, disabled = false){
  //create the base for the jsonform JSON
  let jsonFormObject = {
    "schema": {
      
    },
    "form": [
      
    ],
    "value": {},
    onSubmit: function (errors, values){
      //check if id is inputted to determine wether to create a new entry or edit a existing one
      let constructUrl = `${baseUrl}/news/`
      constructUrl += (values.id) ? "editNews" : "createNews"
      
      let tempData = {}
      tempData[csrf_name] = csrf_hash
      tempData['rowdata'] = values
      $.ajax({
        url: constructUrl,
        type: 'POST',
        data: tempData,
        success: function(){
          //refresh the page to regenerate csrf token
          location.reload()
        },
        error: function(){
          location.reload()
        }
      });
    }
  }
  console.log(jsonFormObject.onSubmit)
  //clear out the form element
  document.getElementById(formId).innerHTML = ""

  //gets columns that use ref values
  let refColumns = []

  //parse columnDefs into jsonForm
  datatableDefs.forEach(column => {
    jsonFormObject.schema[column.data] = {}
    jsonFormObject.schema[column.data]["title"] = column.title
    jsonFormObject.schema[column.data]["type"] = column.type
    jsonFormObject.schema[column.data]["readonly"] = (column.readonly) ? true : false

    //check if disabled is true and if it is disable all collumns:
    if(disabled){
      jsonFormObject.schema[column.data]["readonly"] = true
    }
    //check for reference collumns and make select field:
    if(column.reference_value != null){
      if(disabled){
        jsonFormObject.schema[column.data]["type"] = 'text'
        jsonFormObject.form.push(column.data)
        return
      }
      //add ref column to list:
      refColumns[refColumns.length] = [column.data, column.reference_value, column.reference_column_name]
      //define enum as array
        jsonFormObject.schema[column.data]["enum"] = []
      //loop through the ref values and insert them
      for(let i = 0; i < references[column.data].length; i++){
        jsonFormObject.schema[column.data]["enum"].push(references[column.data][i][column.reference_column_name])
      }

      //showing reference names
      let formConstruct = {
        "key" : column.data,
        "titleMap" : {}
      }

      for(let i = 0; i < references[column.data].length; i++){
        formConstruct.titleMap[references[column.data][i][column.reference_column_name]] = references[column.data][i][column.reference_value]
      }
      jsonFormObject.form.push(formConstruct);
      return
    }


    jsonFormObject.form.push(column.data)
  });
  
  //add submit button
  if(!disabled){
    jsonFormObject.form.push(
      {
      "type": "submit",
      "title": "Submit"
      }
    )
  }
  

  if(data){
    //gets the data
    jsonFormObject.value = data[0]

    //switches to the correct values for reference collumns
    refColumns.forEach(column => {
      for(let i = 0; i < references[column[0]].length; i++){
        if(jsonFormObject.value[column[0]] == references[column[0]][i][column[1]]){
          jsonFormObject.value[column[0]] = references[column[0]][i][column[2]]
        }
      }
    });
  }
  console.log(jsonFormObject)
  $(`#${formId}`).jsonForm(
    jsonFormObject
  )
}

