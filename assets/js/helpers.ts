export async function callAjax(options: RequestInit, url = checklist_ajax.ajaxUrl) {
  return await fetch(url, options);
}
