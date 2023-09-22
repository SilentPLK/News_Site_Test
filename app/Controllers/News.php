<?php

namespace App\Controllers;

use App\Models\NewsModel;
use App\Models\dataTableModel;
use App\Models\imagesModel;
use CodeIgniter\Exceptions\PageNotFoundException;

class News extends BaseController
{
  public function index()
  {
      $model = model(NewsModel::class);
      helper('form');
        $model = model(NewsModel::class);
        $configure = $this->getTableConfig();
        $data = $this->getData();
        $newReferences = [];
        

        //switch out reference column
        foreach($configure['references'] as &$index){
            //add in a empty value for the images collumn, so there isnt a warning

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
        $configure = $this->getTableConfig();
        $data = $this->getData();
        $newReferences = [];
        //switch out reference column
        foreach($configure['references'] as &$index){
            $column = $configure['columnDefs'][$index];
            $data = $model->getRefColumn($data, $column['data'],$column['reference_table_name'],$column['reference_column_name'],$column['reference_value'],$column['joiner_table']);
            log_message('info', print_r($data, true));
            $newReferences[$column['data']] = $model->getRefList($column['reference_table_name'],$column['reference_column_name'],$column['reference_value']);

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
        $data = $_POST;
        $data = json_decode($data['rowdata']);
        log_message('info', 'Received AJAX data: ' . print_r($data, true));
        

        if (empty($data->title) || strlen($data->title) > 255 || strlen($data->title) < 3) {
            return $this->new();
        }
        if (empty($data->body) || strlen($data->body) > 5000 || strlen($data->body) < 10) {
            return $this->new();
        }

        
        $model = model(NewsModel::class);




        $model->save([
            'title' => $data->title,
            'slug' => url_title($data->title, '-', true),
            'body' => $data->body,
            'category_id' => $data->category_id,
        ]);
    

        $newArticleId = $model->getId()[0]->{'MAX(id)'};
        

        //sub category section
        $model->saveToJoiner($newArticleId, $data->category_sub_id);


        //file uploading section
        $model = model(imagesModel::class);
        $files = $this->request->getFiles();
        log_message('info', "got files: " . print_r($files, true));

        foreach ($files as $file) {
            foreach($file as $uploadedFile){
                if (!$uploadedFile->hasMoved()) {
                    $newName = $uploadedFile->getRandomName();
                    $filepath = base_url('/uploads//' . $newName);
                    $uploadedFile->move(ROOTPATH . 'public/uploads', $newName);

                    // gets data for the database
                    $image = [
                        'file_name' => $uploadedFile->getClientName(),
                        'file_url' => $filepath, // You may need to adjust this to the correct URL format
                        'file_type' => $uploadedFile->getClientMimeType(),
                        'news_id' => $newArticleId
                    ];

                    $model->save([
                        'name' => $image['file_name'],
                        'url'  => $image['file_url'],
                        'type'  => $image['file_type'],
                        'news_id' => $image['news_id']
                    ]);
                }
            }
        }

        

    }

    //sends news data from the database encoded in json
    public function getData()
    {
        //gets the model
        $model = model(NewsModel::class);
        //gets the data from the database
        $data = $model->getNews();

        foreach($data as &$entry){
            $entry['images'] = " ";
        }
        //returns the data
        return $data;
    }

    public function edit()
    {
        $data = $_POST;
        $data = json_decode($data['rowdata']);
        log_message('info', 'Received AJAX data: ' . print_r($data, true));

        if (empty($data->title) || strlen($data->title) > 255 || strlen($data->title) < 3) {
            return $this->new();
        }
        if (empty($data->body) || strlen($data->body) > 5000 || strlen($data->body) < 10) {
            return $this->new();
        }

        
        $model = model(NewsModel::class);
        if ($data->category_id == 'default') {
            $data->category_id = null;
        }

        $model->save([
            'id' => $data->id,
            'title' => $data->title,
            'slug' => url_title($data->title, '-', true),
            'body' => $data->body,
            'category_id' => $data->category_id,
        ]);

        //sub category section
        $model->saveToJoiner($data->id, $data->category_sub_id);


        $newArticleId = $data->id;
        $model = model(imagesModel::class);

        $files = $this->request->getFiles();
        log_message('info', "got files: " . print_r($files, true));

        foreach ($files as $file) {
            foreach($file as $uploadedFile){
                if (!$uploadedFile->hasMoved()) {
                    $newName = $uploadedFile->getRandomName();
                    $filepath = base_url('/uploads//' . $newName);
                    $uploadedFile->move(ROOTPATH . 'public/uploads', $newName);

                    // gets data for the database
                    $image = [
                        'file_name' => $uploadedFile->getClientName(),
                        'file_url' => $filepath, // You may need to adjust this to the correct URL format
                        'file_type' => $uploadedFile->getClientMimeType(),
                        'news_id' => $newArticleId
                    ];

                    $model->save([
                        'name' => $image['file_name'],
                        'url'  => $image['file_url'],
                        'type'  => $image['file_type'],
                        'news_id' => $image['news_id']
                    ]);
                }
            }
        }

        
    }

    public function remove()
    {
        // Get the CSRF token from the query string
        $csrfToken = $this->request->getGet('csrf_test_name');
        
        // Get the IDs from the query string
        $ids = $this->request->getGet('id');

        $model = model(NewsModel::class);

        foreach ($ids as $id) {
           $model->delete_row($id);
           $model->deleteJoinerEntry($id);
        }
    }


    //datatable block
    public function getTableConfig(){
        //gets the model
        $model = model(dataTableModel::class);
        //gets the data from the database
        $data = $model->getTable("news");
        $references = [];

        $transformedData = [];

        //remove unnecesary collums for collumnDef
        foreach($data as $index => &$column){
            unset($column->id);
            unset($column->meta_tables_id);
            $jsonData = json_decode($column->json);

            // Create a dynamic array to hold the properties from $jsonData
            $dynamicData = [
                'table_name' => $column->table_name,
                'data' => $column->column_name,
                'title' => $column->column_title,
            ];

            // Include all properties from $jsonData
            foreach ($jsonData as $property => $value) {
                $dynamicData[$property] = $value;
            }

            $transformedData[] = $dynamicData;




            if(!($jsonData->reference_table_name == "") && !($jsonData->reference_column_name == "") && !($jsonData->reference_value  == "")){
                array_push($references, $index);
            }
        }

        return [
            'columnDefs' => $transformedData,
            'references' => $references,
            ];
    }

    public function getSubData(){
        $model = model(NewsModel::class);
        
        $data = $model->getSubCategory();

        //returns the data
        echo json_encode($data);
    }

    public function removeSubCategory(){
        $model = model(NewsModel::class);

        $model->deleteJoinerEntry($this->request->getGet('id'));
    }

    //reads out file contents
    public function openFile($segment)
    {
        // Load the necessary model to interact with the database
        $model = model(imagesModel::class); // Replace with your actual model class

        // Retrieve the file URL from the database based on the segment (file ID)
        $fileInfo = $model->getImageData($segment, false);
        log_message('info', $segment);
        log_message('info', print_r($fileInfo, true));
        if (!$fileInfo) {
            // Handle the case where the file is not found
            return $this->response->setStatusCode(404)->setBody('File not found');
        }

        // Get the file URL from the database
        $fileUrl = $fileInfo[0]->url;

        // Construct the server-side file path using ROOTPATH and the file name from the URL
        $fileParts = pathinfo($fileUrl);
        $serverFilePath = ROOTPATH . '/public/uploads/' . $fileParts['basename'];

        // Check if the file exists on the server
        if (!file_exists($serverFilePath)) {
            // Handle the case where the file does not exist on the server
            return $this->response->setStatusCode(404)->setBody('File not found on the server');
        }

        // Get the file extension from the name column
        $fileExtension = pathinfo($fileInfo[0]->name, PATHINFO_EXTENSION);

        // Set the appropriate content type for the file based on the extension
        $contentType = mime_content_type($serverFilePath);

        // Set the response headers to specify the file name and content type
        $this->response->setHeader('Content-Type', $contentType);
        $this->response->setHeader('Content-Disposition', 'inline; filename="' . $fileInfo[0]->name . '"');

        // Read the file contents and output it directly to the browser
        $fileContents = file_get_contents($serverFilePath);

        if ($fileContents === false) {
            // Handle errors while reading the file
            return $this->response->setStatusCode(500)->setBody('Error reading file');
        }

        return $this->response->setBody($fileContents);
    }
}