<?php

namespace App\Models;

use CodeIgniter\Model;

class NewsModel extends Model
{
    //tells what database table to use
    protected $table = 'news';
    //tells which fields of the table are safe to update
    protected $allowedFields = ['id', 'title', 'slug', 'body'];

    public function getNews($slug = false)
    {
        if ($slug === false) {
            return $this->findAll();
        }

        return $this->where(['slug' => $slug])->first();
    }

    public function delete_row($id){
        //$this->where('id', $id);
        $this->delete($id);
    }
}