<?php

namespace App\Models;

use CodeIgniter\Model;

class metaModel extends Model
{
    //tells what database table to use
    protected $table = 'meta_tables';
    //tells which fields of the table are safe to update
    protected $allowedFields = ['table_name', 'structure'];

    public function getTable()
    {
        return $this->findAll();
    }

    public function delete_row($id){
      $this->db = \Config\Database::connect();
      $query = "DELETE FROM meta_tables WHERE id = ?";
      $param = $id;
      $this->db->query($query, $param);
    }
}