var hiddenInputs = document.querySelectorAll('input[type="hidden"]');
var inputToken = hiddenInputs[0];
var csrf_name = inputToken.name;
var csrf_hash = inputToken.value;
console.log(baseUrl)
var jsonFormObject = {
  schema: {
    fields: {
      type: "array",
      items: {
        type: "object",
        title: "Fields",
        properties: {
          id : {
            type: "hidden",
            default: "none"
          },
          table: {
            type: "string",
            title: "Table Name"
          },
          column: {
            type: "string",
            title: "Column Name"
          },
          attribute: {
            type: "array",
            items: {
              type: "string",
              title: "Attribute Name"
            }
          },
          attributeValue: {
            type: "array",
            items: {
              type: "textarea",
              title: "Attribute Value"
            }
          }
        }
      }
    }
  },
  form: [
    {
      type: "tabarray",
      draggable: false,
      items: {
          type: "section",
          legend: "field {{idx}}",
          items: [
            "fields[].table",
            "fields[].column",
            "fields[].id",
          {
            type: "array",
            items: {
              type: "section",
              items: [
                "fields[].attribute[]",
                "fields[].attributeValue[]",
              ]
            },
            
          }
        ]
      }
    },
    {
      type: "submit",
      title: "Submit"
    }
  ],
  value : {

  },
  onSubmit: function (errors, values){

    //createa copy of values, so we can modify it
    let modifiedValues = { ...values };

    // Iterate through the fields and modify the entries
    modifiedValues.fields.forEach(entry => {
      let tempAttributeObject = {};
      for (let i = 0; i < entry.attribute.length; i++) {
        tempAttributeObject[entry.attribute[i]] = entry.attributeValue[i];
      }
      entry.attribute = tempAttributeObject; // Update the attribute property
      delete entry.attributeValue; // Remove the attributeValue property
    });

    //prepare the data and send it over to the server
    let formData = new FormData();
    
    // Append regular values
    formData.append(csrf_name, csrf_hash);
    formData.append('data', JSON.stringify(modifiedValues));

    
    $.ajax({
      url: `${baseUrl}jsonform/upload`,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
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

//populate the values from the database
if(tableData.length){
  jsonFormObject.value['fields'] = []
  tableData.forEach(entry =>{
    //seperate attributes and keys
    let attributes = JSON.parse(entry.attributes)
    let attribute = []
    let attributeValue = []
  
    for (let key in attributes) {
      if (attributes.hasOwnProperty(key)) {
          attribute.push(key);
          attributeValue.push(attributes[key]);
      }
    }
  
    //create object that will be inserted into jsonform value property
    let fieldObject = {}
    fieldObject['id'] = entry.id
    fieldObject['table'] = entry.table_name
    fieldObject['column'] = entry.column_name
    fieldObject['attribute'] = attribute
    fieldObject['attributeValue'] = attributeValue
    
    jsonFormObject.value['fields'].push(fieldObject)
  })
}



$("#jsonForm").jsonForm(
  jsonFormObject
)

//preview the form
let previewForm = {
  schema : {},
  form: [],
}

tableData.forEach(entry => {
  previewForm.schema[entry.column_name] = JSON.parse(entry.attributes)
  previewForm.form.push(entry.column_name)
})

$('#jsonFormPreview').jsonForm(previewForm)


//switching tabs
document.addEventListener("DOMContentLoaded", function () {
  // Get tab buttons and tab content elements
  let addTabButton = document.getElementById("add-tab");
  let previwTabButton = document.getElementById("preview-tab");
  let addTabContent = document.getElementById("add-tab-content");
  let previwTabContent = document.getElementById("preview-tab-content");

  // Add click event listeners to tab buttons
  addTabButton.addEventListener("click", function () {
      addTabButton.classList.add("active");
      previwTabButton.classList.remove("active");
      addTabContent.style.display = "block";
      previwTabContent.style.display = "none";
  });

  previwTabButton.addEventListener("click", function () {
      previwTabButton.classList.add("active");
      addTabButton.classList.remove("active");
      previwTabContent.style.display = "block";
      addTabContent.style.display = "none";
  });
});
