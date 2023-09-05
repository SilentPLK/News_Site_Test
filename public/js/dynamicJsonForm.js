//function generates jsonform from datatable columndefs
function createForm(datatableDefs, formId, data = null){
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

  //parse columnDefs into jsonForm
  datatableDefs.forEach(column => {
    jsonFormObject.schema[column.data] = {}
    jsonFormObject.schema[column.data]["title"] = column.title
    jsonFormObject.schema[column.data]["type"] = column.type
    jsonFormObject.schema[column.data]["readonly"] = (column.readonly) ? true : false
    jsonFormObject.form.push(column.data)
  });
  
  //add submit button
  jsonFormObject.form.push(
    {
    "type": "submit",
    "title": "Submit"
    }
  )

  if(data){
    //gets the data
    jsonFormObject.value = data[0]
  }
  $(`#${formId}`).jsonForm(
    jsonFormObject
  )
}

