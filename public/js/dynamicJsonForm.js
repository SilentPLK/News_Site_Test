
JSONForm.fieldTypes['multifile'] = {
  template: `<div>
              <input type="file" name="<%= node.name %>" multiple="multiple" onchange="handleFileChange(this)" />
            </div>
            <div class="jsonform-multifile-display">
              <ul name="<%= node.name %>"></ul>
            </div>`,

  inputfield: true,
  array: false, 

  fieldtemplate: true,

  getElement: function (el) {
    return $(el).parent().get(0);
  },

  onBeforeRender: function (data, node) {
  },

  onInsert: function (evt, node) {
    let fileInput = $(node).find('input[type="file"]');
    
    fileInput.on('change', function (e) {
      // Your file handling logic here
      console.log('File selected:', e.target.files);
      
      // Call your custom onChange function
      testForm.onChange(e, node);
    });
  }
};



function handleFileChange(input) {
  const imageContainer = document.querySelector(`ul[name="${input.name}"]`);
  // Clear out the previous uploaded content
  imageContainer.innerHTML = '';

  const files = input.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const listItem = document.createElement('li');
    const icon = document.createElement('i');

    if (file.type.startsWith('image/')) {
      icon.classList.add('fa', 'fa-image');
      listItem.textContent = ' ' + file.name;
    } else {
      icon.classList.add('fa', 'fa-file');
      listItem.textContent = ' ' + file.name;
    }

    listItem.insertBefore(icon, listItem.firstChild);
    imageContainer.appendChild(listItem);

    if (file.type.startsWith('image/')) {
      const imgElement = document.createElement('img');
      imgElement.src = URL.createObjectURL(file);
      imgElement.classList.add('uploaded-image');
      imageContainer.appendChild(imgElement);
    }
  }
}

//function generates jsonform from datatable columndefs
function createForm(datatableDefs, data = null, disabled = false){
  //create the base for the jsonform JSON
  let jsonFormObject = {
    "schema": {
      
    },
    "form": [
      
    ],
    "value": {},
  }

  
  //gets columns that use ref values
  let refColumns = []

  //parse columnDefs into jsonForm
  datatableDefs.forEach(column => {
    jsonFormObject.schema[column.data] = {}
    jsonFormObject.schema[column.data]["title"] = column.title
    jsonFormObject.schema[column.data]["type"] = column.type
    jsonFormObject.schema[column.data]["readonly"] = (column.readonly) ? true : false
    
    if(column.type == "select" || column.type == "select-multi"){
      jsonFormObject.schema[column.data]["type"] = 'string'
    }

    //check if disabled is true and if it is disable all collumns:
    if(disabled){
      jsonFormObject.schema[column.data]["readonly"] = true
    }
    //check for reference collumns and make select field:
    if(column.reference_value != null && jsonFormObject.schema[column.data]["type"] == "string"){
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

      if(disabled){
        formConstruct['readonly'] = true
      }

      for(let i = 0; i < references[column.data].length; i++){
        formConstruct.titleMap[references[column.data][i][column.reference_column_name]] = references[column.data][i][column.reference_value]
      }
      jsonFormObject.form.push(formConstruct);
      return
    }

    if(column.type == "multifile" && disabled){
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
  jsonFormObject.schema['testUpload'] = {
    "type" : "string",
    "title" : "A field"
  }

  return jsonFormObject
}