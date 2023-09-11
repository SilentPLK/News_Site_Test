<?php

namespace App\Models;

use CodeIgniter\Model;

class imagesModel extends Model
{
    //tells what database table to use
    protected $table = 'images';
    //tells which fields of the table are safe to update
    protected $allowedFields = ['name', 'url', 'type'];

    public function getImageData($id = false)
    {
        if ($id === false) {
            return $this->findAll();
        }

        return $this->find($id);
    }

    public function delete_row($id){
      $this->db = \Config\Database::connect();
      $query = "DELETE FROM images WHERE id = ?";
      $param = $id;
      $this->db->query($query, $param);
  }
}