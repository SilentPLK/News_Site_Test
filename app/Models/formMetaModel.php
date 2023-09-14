<?php

namespace App\Models;

use CodeIgniter\Model;

class formMetaModel extends Model
{
    //tells what database table to use
    protected $table = 'form_meta';
    //tells which fields of the table are safe to update
    protected $allowedFields = ['table_name', 'column_name', 'attributes'];

    public function getTable()
    {
        return $this->findAll();
    }

}