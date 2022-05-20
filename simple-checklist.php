<?php 
/*
*  Plugin Name: Simple Checklist
*  Description: Simple checklist / task list plugin
*  Version: 1.0
*  Author: Konrad Siczek | FunctionalCode.pl
*/

if( ! defined( 'ABSPATH' )) die;

define('PLUGIN_DIR_PATH', ABSPATH . '/wp-content/plugins/simple-checklist/');

require_once PLUGIN_DIR_PATH . 'includes/Ajax.php';


class SimpleChecklist {

   public function __construct()
   {
     add_action('init', array($this, 'create_checklist_post_type'));
     add_action('init', array($this, 'addAjaxActions'));
     add_action('wp_enqueue_scripts', array($this, 'load_assets'), 9999);
     add_shortcode('checklist_init', array($this, 'addShortCode'));
   }

   public function create_checklist_post_type()
   {
      $args = array (
        
          'public' => true,
          'has_archive' => true,
          'supports' => array('title'),
          'exclude_from_search' => false,
          'publicy_queryable' => false,
          'capability' => 'manage_options',
          'labels' => array (
              'name' => 'Checklist',
              'singluar_name' => 'Checklist Entry',
          ),
          'menu_icon' => 'dashicons-yes',

      );

      register_post_type('simple_checklist', $args);
   }

   // ajax actions
   public function addAjaxActions() 
   {
     new Ajax($this, 'getTasks');
     new Ajax($this, 'addTask');
     new Ajax($this, 'updateTaskTitle');
     new Ajax($this, 'removeTask');
     new Ajax($this, 'updateTaskStatus');
   }

   public function getTasks() 
   {
     $tasks = new WP_Query(
       array(
         'post_type' => 'simple_checklist',
         'post_status' => array('publish', 'draft'),
         'orderby' => 'date',
         'order' => 'ASC',
         'posts_per_page' => -1,
       ),
     );
     
      $response = [
        'html' => '',
      ];

      foreach($tasks->posts as $task) {
        $status = '';
        $statusClass = '';
        $disabled = '';

        if($task->post_status === 'draft') {
          $status = 'checked';
          $statusClass = 'task--done';
          $disabled = 'disabled';
        }

        $response['html'] .= '<div class="task ' . $statusClass . '" data-id="'. $task->ID .'">';
        $response['html'] .= '<div class="task__content">';
        $response['html'] .= '<input type="checkbox" class="checkbox task__status" name="task_status" '. $status .'/>';
        $response['html'] .= '<span class="task__name" contenteditable="true">' . $task->post_title . '</span>';
        $response['html'] .= '</div>';
        $response['html'] .= '<div class="task__actions">';
        $response['html'] .= '<button class="simple-checklist__button simple-checklist__updateTask '. $disabled .'" data-id="'. $task->ID .'"><span class="dashicons dashicons-update"></span></button>';
        $response['html'] .= '<button class="simple-checklist__button simple-checklist__removeTask" data-id="'. $task->ID .'"><span class="dashicons dashicons-trash"></span></button>';
        $response['html'] .= '</div></div>';
      }

      echo json_encode($response);

      die();
   }

   public function addTask() 
   {  
     $response = [
       'information' => ''
     ];

     $title = post_exists(wp_strip_all_tags( $_POST['taskTitle'] ), '', '', 'simple_checklist');
     if(!$title) {
        $my_post = array(
          'post_title'    => wp_strip_all_tags( $_POST['taskTitle'] ),
          'post_type'     => 'simple_checklist',
          'post_status'   => 'publish',
          'post_author'   => 1,
        );
 
      // Insert the post into the database
      wp_insert_post( $my_post );
     } else {
       $response = [
         'information' => 'This task exists',
       ];

       echo json_encode($response);
     }
  
   }


   public function removeTask() 
   {
     $post_id = wp_strip_all_tags( $_POST['taskID'] );
     wp_delete_post($post_id);
   }


   public function updateTaskTitle() 
   {
     $title = post_exists(wp_strip_all_tags( $_POST['task'] ), '', '', 'simple_checklist');


     if(!$title) {
        $arg = array(
          'ID' => wp_strip_all_tags( $_POST['taskId'] ),
          'post_title' => wp_strip_all_tags( $_POST['task'] ),
        );

        wp_update_post($arg);
     }
   }

   public function updateTaskStatus() 
   {
   
      if( get_post_status($_POST['taskId']) === 'draft') {
        $args = array(
          'ID' => $_POST['taskId'],
          'post_status' => 'publish'
        );

        wp_update_post($args);

      } else {
        $args = array(
          'ID' => $_POST['taskId'],
          'post_status' => 'draft'
        );
        wp_update_post($args);
      }

   }


   public function addShortCode() 
   {
    ?>
      <div class="simple-checklist">
        <header class="simple-checklist__header">
          <h2 class="simple-checklist__title"><?= __('Your list', 'simple-checklist' );?></h2>
        </header>
        <div class="simple-checklist__app">
          <div class="simple-checklist__tasks"></div>
          <div class="simple-checklist__addTask">
            <input type="text" name="taskTitle" class="simple-checklist__taskName" min-length="3" placeholder="Type title of task..." />
            <button type="submit" class="add-task"><span class="dashicons dashicons-insert"></span></button>
          </div>
        </form>
      </div>
    <?php
   }

   public function load_assets() 
   {
      wp_enqueue_style( 'dashicons' );
      wp_enqueue_style( 'wpb-google-fonts', 'https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,700italic,400,700,300', false ); 
      wp_enqueue_style('simple-checklist-style', plugin_dir_url(__FILE__) . 'dist/css/bundle.css', array(), '1.0', 'all');
      wp_enqueue_script('simple-checklist', plugin_dir_url(__FILE__) . 'dist/js/bundle.js', array(), '1.0', true );
      wp_localize_script('simple-checklist', 'checklist_ajax', array('ajaxUrl' => admin_url('admin-ajax.php')));
   }
  }

  new SimpleChecklist;


