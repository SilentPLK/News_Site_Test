<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

use App\Controllers\News;
use App\Controllers\Pages;
use App\Controllers\Image;
use App\Controllers\FormBuilder;

//-----------------json-form-configure-block---------------

$routes->get('jsonform/configure', [FormBuilder::class, 'viewTable']);
$routes->get('jsonform/delete', [FormBuilder::class, 'remove']);
$routes->post('jsonform/upload', [FormBuilder::class, 'upload']);

$routes->get('jsonform/configure/metaData', [FormBuilder::class, 'viewMetaData']);
$routes->get('jsonform/configure/meta/delete', [FormBuilder::class, 'removeMeta']);
$routes->post('jsonform/configure/meta/upload', [FormBuilder::class, 'uploadMeta']);


//-------------------old-json-form-builder-----------------
$routes->get('jsonform/deleteold', [FormBuilder::class, 'remove']);
$routes->get('jsonform/configureold', [FormBuilder::class, 'viewold']);
$routes->post('jsonform/uploadold', [FormBuilder::class, 'uploadold']);
//---------------------------------------------------------

//-----------------image-controller-block------------------

$routes->get('upload', [Image::class, 'view']);
$routes->get('upload/getImages', [Image::class, 'getImages']);
$routes->get('upload/deleteImages', [Image::class, 'deleteImages']);
$routes->post('upload/upload', [Image::class, 'upload']);

//---------------------------------------------------------

//------------------news-controller-block------------------

$routes->get('news', [News::class, 'index']);

//displaying file content:
$routes->get('news/file/(:segment)', [News::class, 'openFile']);

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

//---------------------------------------------------------



