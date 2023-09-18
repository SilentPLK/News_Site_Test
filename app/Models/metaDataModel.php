<?php

namespace App\Models;

use CodeIgniter\Model;

class metaDataModel extends Model
{
    //tells what database table to use
    protected $table = 'meta_table_def';
    //tells which fields of the table are safe to update
    protected $allowedFields = ['meta_tables_id', 'table_name', 'column_name', 'column_title', 'json'];

    public function getTable()
    {
        return $this->findAll();
    }

    public function delete_row($id){
      $this->db = \Config\Database::connect();
      $query = "DELETE FROM meta_table_def WHERE id = ?";
      $param = $id;
      $this->db->query($query, $param);
    }
}