async function callAjax(options, url = checklist_ajax.ajaxUrl) {
  return await fetch(url, options);
}

function getTasks() {
  const formData = new FormData()
  formData.append('action', 'getTasks');

  return callAjax({
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(res => {

      document.querySelector('.simple-checklist__tasks').innerHTML = res.html;

      const RemoveButtons = document.querySelectorAll('.simple-checklist__removeTask');
      const UpdateButtons = document.querySelectorAll('.simple-checklist__updateTask');
      const TaskNameFields = document.querySelectorAll('.task__name');
      const TaskStatusCheckboxes = document.querySelectorAll('.task__status');

      RemoveButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();

          const taskId = e.target.dataset.id;

          removeTask(taskId, e.target);
        })
      })

      UpdateButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();

          const taskId = e.target.dataset.id;
          const task = button.closest('.task')
          const taskTitle = task.querySelector('.task-name').textContent;

          updateTaskTitle(taskId, taskTitle);
        })
      })

      TaskNameFields.forEach(field => {
        field.addEventListener('keydown', (e) => {
          if (e.keyCode === 13) {
            e.preventDefault();
            const task = e.target;
            const taskTitle = e.target.textContent;
            const taskId = task.closest('.task').dataset.id;

            updateTaskTitle(taskId, taskTitle);
          }
        })
      })


      TaskStatusCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const task = checkbox.closest('.task');
          const taskId = task.dataset.id;
          task.classList.toggle('task--done');

          updateTaskStatus(taskId);
        })
      })
    })
    .catch((error) => {
      console.error('Error:', error);
    })
}

function addTask(taskName, el) {
  const formData = new FormData()
  formData.append('action', 'addTask');
  formData.append('taskTitle', taskName);

  console.log(el)
  return callAjax({
    method: 'POST',
    body: formData
  }).then(res => {
    document.querySelector('.simple-checklist__taskName').value = '';
  }).then(() => {
    getTasks();
  })
    .catch((error) => {
      console.error('Error:', error);
    })

}

function removeTask(taskId, el) {
  const formData = new FormData();
  formData.append('action', 'removeTask');
  formData.append('taskID', taskId)

  return callAjax({
    method: 'POST',
    body: formData
  }).then(res => {
    if (res.ok) {
      const task = el.closest('.task')
      task.remove();
    }
  }).catch(error => {
    console.error('Error: ', error);
  })
}

function updateTaskTitle(taskId, title) {
  const formData = new FormData();
  formData.append('action', 'updateTaskTitle');
  formData.append('taskId', taskId);
  formData.append('task', title);

  return callAjax({
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then((res) => {
      console.log('update');
    })
    .catch(error => {
      console.error('Error: ', error);
    })
}

function updateTaskStatus(taskId, checkbox) {
  const formData = new FormData();
  formData.append('action', 'updateTaskStatus');
  formData.append('taskId', taskId);

  return callAjax({
    method: 'POST',
    body: formData
  })
    .then(res => {
      return;
    })
    .catch((error) => {
      console.error('Error:', error);
    })
}

document.addEventListener('DOMContentLoaded', function () {
  const myForm = document.querySelector('.simple-checklist__app')

  if (myForm) {
    getTasks();
  }


  document.querySelector('.add-task').addEventListener('click', function (e) {
    const taskName = document.querySelector('.simple-checklist__taskName').value;
    e.preventDefault();

    addTask(taskName, e.target);

  })

  document.querySelector('.simple-checklist__taskName').addEventListener('keydown', (e) => {

    const title = e.target.value;

    if (e.keyCode == 13) {
      addTask(title, e.target);
    }
  })

});
