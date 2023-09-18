<?php

namespace App\Models;

use CodeIgniter\Model;

class imagesModel extends Model
{
    //tells what database table to use
    protected $table = 'images';
    //tells which fields of the table are safe to update
    protected $allowedFields = ['name', 'url', 'type', 'news_id'];

    public function getImageData($id = false, $isNewsId = true)
    {
        if ($id === false) {
            return $this->findAll();
        }

        if ($isNewsId === false) {
          $this->db = \Config\Database::connect();
          $query = "SELECT id, url, name, type FROM images WHERE id = ?";
          $param = $id;
          return $this->db->query($query, $param)->getResult();
        }

    $this->db = \Config\Database::connect();
      $query = "SELECT id, url, name, type FROM images WHERE news_id = ?";
      $param = $id;
      return $this->db->query($query, $param)->getResult();
    }

    public function delete_row($id){
      $this->db = \Config\Database::connect();
      $query = "DELETE FROM images WHERE id = ?";
      $param = $id;
      $this->db->query($query, $param);
    }
}