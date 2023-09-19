<?php

namespace App\Models;

use CodeIgniter\Model;

class dataTableModel extends Model
{
    //tells what database table to use
    protected $table = 'meta_table_def';
    //tells which fields of the table are safe to update
    protected $allowedFields = [];

    public function getTable($metaTable)
    {
        $metaTable = $this->db->escape($metaTable);
        $sql = "SELECT id FROM meta_tables WHERE table_name = $metaTable";

        $query = $this->db->query($sql);
        

        if ($query->getNumRows() > 0) {
            // Get the id from the result row
            $row = $query->getRow();
            $id = $row->id;

            // Use the id to filter records in the meta_tables_def table
            $result = $this->db->table('meta_table_def')
                ->where('meta_tables_id', $id)
                ->get()
                ->getResult();

            // Return the filtered result
            return $result;
        } else {
            // No matching record found, return an empty result
            return [];
        }
    }

}