<?php

namespace App\Controllers;

use CodeIgniter\Exceptions\PageNotFoundException;
use App\Models\formMetaModel;

class FormBuilder extends BaseController
{
    public function index()
    {
    }

    public function view()
    {
        $model = model(formMetaModel::class);
        $tableData = $model->getTable();

        $data = [
          'title' => "Form configuration",
          'tableData' => json_encode($tableData)
        ];

        return view('templates/header', $data)
            . view('Formbuilder/form')
            . view('templates/footer');
    }
    
    public function upload(){
      $data = $_POST;
      $data = json_decode($data['data']);
      $model = model(formMetaModel::class);

      foreach($data->fields as $field){
        if($field->id == "none"){
          $model->save([
            'table_name' => $field->table,
            'column_name' => $field->column,
            'attributes' => json_encode($field->attribute),
          ]);
        } else {
          $model->save([
            'id' => $field->id,
            'table_name' => $field->table,
            'column_name' => $field->column,
            'attributes' => json_encode($field->attribute),
          ]);
        }
        
      }
    }


}