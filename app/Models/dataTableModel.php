<?php

namespace App\Models;

use CodeIgniter\Model;

class dataTableModel extends Model
{
    //tells what database table to use
    protected $table = 'column_defs_meta';
    //tells which fields of the table are safe to update
    protected $allowedFields = ['id', 'meta_table_name', 'data', 'title', 'type', 'readonly'];

    public function getTable()
    {
        return $this->findAll();
    }

}