<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

use App\Controllers\News;
use App\Controllers\Pages;

$routes->get('news', [News::class, 'index']);
//creates a route for the js file to get the database data
$routes->get('news/getTable', [News::class, 'getTableConfig']);
$routes->get('news/getData', [News::class, 'getData']);
$routes->get('news/create', [News::class, 'new']);
$routes->get('news/new', [News::class, 'new']);

$routes->get('news/getSubCategoryData', [News::class, 'getSubData']);

$routes->post('news/createNews', [News::class, 'create']);
$routes->post('news/editNews', [News::class, 'edit']);
$routes->get('news/deleteNews', [News::class, 'remove']);

$routes->get('news/(:segment)', [News::class, 'show']);


$routes->get('pages', [Pages::class, 'index']);
$routes->get('(:segment)', [Pages::class, 'view']);
