<?php

namespace App\Controllers;

use App\Models\NewsModel;
use CodeIgniter\Exceptions\PageNotFoundException;

class News extends BaseController
{
  public function index()
  {
      $model = model(NewsModel::class);
      helper('url');
      $data = [
          'news'  => $model->getNews(),
          'title' => 'News archive',
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

        return view('templates/header', ['title' => 'Edit the news'])
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
        ]);
    }

    //sends news data from the database encoded in json
    public function getData()
    {
        //gets the model
        $model = model(NewsModel::class);
        //gets the data from the database
        $data = $model->getNews();

        //returns the data in json
        return $this->response->setJSON($data);
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
        ]);
    }

    public function remove($id)
    {
        /*$data = $_POST['rowdata'];
        log_message('info', 'Received AJAX data: ' . print_r($data, true));*/

        $model = model(NewsModel::class);

        $model->delete($id);
    }
}