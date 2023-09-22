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

    public function getRefColumn($setData, $data, $refTable, $refColumn, $refValue, $joinerTable = null){
        $this->db = \Config\Database::connect();
    
        foreach($setData as &$row){
            if ($joinerTable != "") {
                $query ="SELECT
                    n.id AS news_id,
                    n.title AS news_title,
                    GROUP_CONCAT(ncs.sub_category SEPARATOR ', ') AS concatenated_value
                FROM
                    news AS n
                LEFT JOIN
                    $joinerTable AS sj ON n.id = sj.news_id
                LEFT JOIN
                    $refTable AS ncs ON sj.news_category_sub_id = ncs.id
                WHERE
                    n.id = ?
                GROUP BY
                n.id, n.title;";

                $params = [$row['id']];

            } else {
                $query = "SELECT $refValue AS concatenated_value FROM $refTable WHERE $refTable.$refColumn = ?";
                $params = [$row[$data]];
            }
    
            
            
    
            // Execute the query with the parameters
            $result = $this->db->query($query, $params)->getResult();
    
            if ($result) {
                $refValues = [];
                foreach ($result as $item) {
                    $refValues[] = $item->concatenated_value;
                }
                
                $row[$data] = implode(', ', $refValues);
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

    //sub category joiner block
    public function saveToJoiner($newsId, $subIds){
        $this->db = \Config\Database::connect();
        $query = "INSERT INTO sub_category_joiner (news_id, news_category_sub_id)
        VALUES (?, ?);";

        foreach($subIds as $id){
            $params = [$newsId, $id];

            $this->db->query($query, $params);
        }
    }

    public function deleteJoinerEntry($id){
        $this->db = \Config\Database::connect();
        $query = "DELETE FROM sub_category_joiner WHERE news_id = ?";
        $param = $id;
        $this->db->query($query, $param);
    }
}