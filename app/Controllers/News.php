<?php

namespace App\Controllers;

use App\Models\NewsModel;
use App\Models\dataTableModel;
use CodeIgniter\Exceptions\PageNotFoundException;

class News extends BaseController
{
  public function index()
  {
      $model = model(NewsModel::class);
      helper('form');
        $model = model(NewsModel::class);
        $configure = $this->getTableConfig('news');
        $data = $this->getData();
        $newReferences = [];
        
        //switch out reference column
        foreach($configure['references'] as &$index){
            $column = $configure['columnDefs'][$index];
            $data = $model->getRefColumn($data, $column['data'],$column['reference_table_name'],$column['reference_column_name'], $column['reference_value']);
            $newReferences[$column['data']] = $model->getRefList($column['reference_table_name'],$column['reference_column_name'], $column['reference_value']);

        }


        $data = [
            'title' => 'Edit the news',
            'configure' => json_encode($configure['columnDefs']),
            'data' => json_encode($data),
            'references' => json_encode($newReferences)
        ];

      return view('templates/header', $data)
          . view('news/index')
          . view('templates/footer');
  }

  public function show($slug = null)
  {
      $model = model(NewsModel::class);

      $data['news'] = $model->getNews($slug);

      if (empty($data['news'])) {
          throw new PageNotFoundException('Cannot find the news item: ' . $slug);
      }

      $data['title'] = $data['news']['title'];

      return view('templates/header', $data)
          . view('news/view')
          . view('templates/footer');
  }

  public function new()
    {
        helper('form');
        $model = model(NewsModel::class);
        $configure = $this->getTableConfig('news');
        $data = $this->getData();
        $newReferences = [];
        
        //switch out reference column
        foreach($configure['references'] as &$index){
            $column = $configure['columnDefs'][$index];
            $data = $model->getRefColumn($data, $column['data'],$column['reference_table_name'],$column['reference_column_name'], $column['reference_value']);
            $newReferences[$column['data']] = $model->getRefList($column['reference_table_name'],$column['reference_column_name'], $column['reference_value']);

        }


        $data = [
            'title' => 'Edit the news',
            'configure' => json_encode($configure['columnDefs']),
            'data' => json_encode($data),
            'references' => json_encode($newReferences)
        ];

        return view('templates/header', $data )
            . view('news/create')
            . view('templates/footer');
    }

    public function create()
    {
        $data = $_POST['rowdata'];
        log_message('info', 'Received AJAX data: ' . print_r($data, true));

        if(empty($data['title']) || strlen($data['title']) > 255 || strlen($data['title']) < 3 ){
            return $this->new();
        }
        if(empty($data['body']) || strlen($data['body']) > 5000 || strlen($data['body']) < 10){
            return $this->new();
        }
        /*if (! $this->validate([
            'title' => 'required|max_length[255]|min_length[3]',
            'body'  => 'required|max_length[5000]|min_length[10]',
        ])) {
            // The validation fails, so returns the form.
            return $this->new();
        }

        // Gets the validated data.
        $post = $data->validator->getValidated();*/

        $model = model(NewsModel::class);

        $model->save([
            'title' => $data['title'],
            'slug'  => url_title($data['title'], '-', true),
            'body'  => $data['body'],
            'category_id' => $data['category_id']
        ]);
    }

    //sends news data from the database encoded in json
    public function getData()
    {
        //gets the model
        $model = model(NewsModel::class);
        //gets the data from the database
        $data = $model->getNews();

        //returns the data
        return $data;
    }

    public function edit()
    {
        $data = $_POST['rowdata'];
        log_message('info', 'Received AJAX data: ' . print_r($data, true));

        if(empty($data['title']) || strlen($data['title']) > 255 || strlen($data['title']) < 3 ){
            return $this->new();
        }
        if(empty($data['body']) || strlen($data['body']) > 5000 || strlen($data['body']) < 10){
            return $this->new();
        }

        $model = model(NewsModel::class);

        $model->save([
            'id' => $data['id'],
            'title' => $data['title'],
            'slug'  => url_title($data['title'], '-', true),
            'body'  => $data['body'],
            'category_id' => $data['category_id'],
        ]);
    }

    public function remove()
    {
        
        // Get the JSON data
        $request = $this->request->getBody();

        // Decode the JSON data
        $jsonData = json_decode($request, true);
        log_message('info', 'Received data: ' . print_r($jsonData, true));

        $model = model(NewsModel::class);
        
        foreach($jsonData['rowdata'] as $entry){
            if(isset($entry['id'])){
                log_message('info', 'id: ' . $entry['id'] );
                $model->delete_row($entry['id']);
            }
        }
    }


    //datatable block
    public function getTableConfig($tableName = null){
        //gets the model
        $model = model(dataTableModel::class);
        //gets the data from the database
        $data = $model->getTable($tableName);
        $references = [];
        //remove unnecesary collums for collumnDef
        foreach($data as $index => &$collumn){
            unset($collumn['id']);
            unset($collumn['meta_table_name']);
            
            //converting to true or false
            $collumn['readonly'] = ($collumn['readonly'] === '1');
            $collumn['visible'] = ($collumn['show_in_list'] === '1');

            if(!(is_null($collumn['reference_table_name'])) && !(is_null($collumn['reference_column_name'])) && !(is_null($collumn['reference_value']))){
                array_push($references, $index);
            }
        }

        return [
            'columnDefs' => $data,
            'references' => $references,
            ];
    }

}