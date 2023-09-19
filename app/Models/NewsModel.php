<?php

namespace App\Models;

use CodeIgniter\Model;

class NewsModel extends Model
{
    //tells what database table to use
    protected $table = 'news';
    //tells which fields of the table are safe to update
    protected $allowedFields = ['id', 'title', 'slug', 'body', 'category_id', 'category_sub_id'];

    public function getNews($slug = false)
    {
        if ($slug === false) {
            return $this->findAll();
        }

        return $this->where(['slug' => $slug])->first();
    }

    public function delete_row($id){
        $this->db = \Config\Database::connect();
        $query = "DELETE FROM news WHERE id = ?";
        $param = $id;
        $this->db->query($query, $param);
    }

    public function getRefColumn($setData, $data, $refTable, $refColumn, $refValue){
        $this->db = \Config\Database::connect();
    
        foreach($setData as &$row){
            $query = "SELECT $refValue FROM $refTable WHERE $refColumn = ?";
            $params = [$row[$data]];
            
            // Execute the query with the parameters
            $result = $this->db->query($query, $params)->getRow();      
    
            if ($result) {
                $row[$data] = $result->$refValue;
            }
        }
    
        return $setData;
    }

    public function getRefList($refTable, $refColumn, $refValue){
        $this->db = \Config\Database::connect();

        $query = "SELECT $refColumn, $refValue FROM $refTable";

        // Execute the query and return the result
        return $this->db->query($query)->getResult();
    }

    public function getSubCategory(){
        $this->db = \Config\Database::connect();

        $query = "SELECT * FROM news_category_sub";

        return $this->db->query($query)->getResult();
    }

    public function getId(){
        $this->db = \Config\Database::connect();
        $query = "SELECT MAX(id) FROM news";
    
        return $this->db->query($query)->getResult();
    }
}