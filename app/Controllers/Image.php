<?php

namespace App\Controllers;

use CodeIgniter\Exceptions\PageNotFoundException;
use CodeIgniter\Files\File;
use App\Models\imagesModel;
class Image extends BaseController
{

    protected $helpers = ['form'];

    public function view()
    {
        

        $data = session('data');

        if ($data == null) {
          $data= [
            'title' => "Multifile upload",
            'errors' => [],
          ];
        }

        return view('templates/header', $data)
            . view('multifile/upload')
            . view('templates/footer');
    }

    public function upload()
    {
      $files = $this->request->getFiles();
      $data= [
        'title' => "Multifile upload",
        'errors' => [],
        'file_info' => [],
      ];
      foreach ($files as $file) {
        foreach ($file as $uploadedFile) {
          if (!$uploadedFile->hasMoved()) {
            $newName = $uploadedFile->getRandomName();
            $filepath = base_url('/uploads//' . $newName);
            $uploadedFile->move(ROOTPATH . 'public/uploads', $newName);
            
            //gets data for the database
            $fileInfo = [
              'file_name' => $uploadedFile->getClientName(),
              'file_url' => $filepath, // You may need to adjust this to the correct URL format
              'file_type' => $uploadedFile->getClientMimeType(),
            ];
            //saves it into fileinfo
            $data['file_info'][] = $fileInfo;

          } else {
            $errors[] = 'The file ' . $uploadedFile->getClientName() . ' has already been moved.';
          }
        }
        
      }

      if (!empty($errors)) {
        $data['errors'] = $errors;
        return view('templates/header', $data)
            . view('multifile/upload')
            . view('templates/footer');
      } else {
        $errors[] = "files succesfully uploaded";
        $data['errors'] = $errors;

        // Pass the file info array to a new function
        $this->insertImages($data['file_info']);

        return redirect()->to('/upload')->with('data', $data);
      }
    }

    public function insertImages($images){

      $model = model(imagesModel::class);

      foreach($images as $image){
        $model->save([
          'name' => $image['file_name'],
          'url'  => $image['file_url'],
          'type'  => $image['file_type']
        ]);
      }
    }

    public function getImages(){
      $id = $this->request->getVar('id');

      $model = new ImagesModel();

      if ($id !== null) {
        $data = $model->getImageData($id);
      } else {
        $data = $model->getImageData();
      }

      log_message('info', print_r($data, true));
      echo json_encode($data);
    }

    public function deleteImages(){
      // Get the IDs from the query string
      $ids = json_decode($this->request->getGet('ids'));

      $model = model(imagesModel::class);

      foreach ($ids as $id) {
        // Fetch the image data from the database
        $image = $model->find($id);

        if (!$image) {
            continue;
        }

        // Get the URL from the image data
        $imageUrl = $image['url'];

        $model->delete_row($id);

        $filename = basename(parse_url($imageUrl, PHP_URL_PATH));

        $imageFolder = ROOTPATH . 'public\\uploads\\';
        $imageFilePath = $imageFolder . $filename;
        log_message("info", $imageFilePath);
        // Check if the file exists and delete it
        if (file_exists($imageFilePath)) {
            unlink($imageFilePath);
        }
      }
    }
}