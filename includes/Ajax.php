<?php 

class Ajax {
  public function __construct($object, $functionName) 
  {
    add_action("wp_ajax_{$functionName}", [$object, $functionName]);
    add_action("wp_ajax_nopriv_{$functionName}", [$object, $functionName]);
  }
}