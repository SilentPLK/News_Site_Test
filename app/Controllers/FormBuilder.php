<?php

namespace App\Controllers;

use CodeIgniter\Exceptions\PageNotFoundException;
use App\Models\formMetaModel;
use App\Models\metaModel;


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

    

    
    public function uploadold(){
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

    public function removeold(){
      $ids = json_decode($this->request->getGet('ids'));

      $model = model(formMetaModel::class);
      foreach($ids as $id){
        if ($id == 'none') { continue; }
        $model->delete_row($id);
      }
    }



    //new json-form system

    public function viewTable()
    {
        $model = model(metaModel::class);
        $tableData = $model->getTable();

        $data = [
          'title' => "Form configuration",
          'dataSet' => json_encode($tableData)
        ];

        return view('templates/header', $data)
            . view('Formbuilder/create')
            . view('templates/footer');
    }

    public function getData(){
        $model = model(metaModel::class);
        return $model->getTable();
    }

    public function upload(){
      $data = $_POST;
      $data = json_decode($data['rowdata']);
      $model = model(metaModel::class);
      log_message('info', print_r($data, true));

      if($data->id == "none"){
        $model->save([
          'table_name' => $data->tableName,
          'structure' => json_encode($data->structure),
        ]);
      } else {
        $model->save([
          'id' => $data->id,
          'table_name' => $data->tableName,
          'structure' => json_encode($data->structure),
        ]);
      }
        
    }

    public function remove(){
      $ids = $this->request->getGet('id');

      $model = model(metaModel::class);
      foreach($ids as $id){
        $model->delete_row($id);
      }
    }
}