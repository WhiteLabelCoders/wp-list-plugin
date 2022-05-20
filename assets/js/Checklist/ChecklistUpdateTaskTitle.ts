import { callAjax } from '../helpers';
class ChecklistUpdateTaskTitle {
  UpdateButtons: NodeListOf<HTMLButtonElement>
  TaskNameFields: NodeListOf<HTMLSpanElement>

  constructor() {
    this.UpdateButtons = document.querySelectorAll('.simple-checklist__updateTask') as NodeListOf<HTMLButtonElement>;
    this.TaskNameFields = document.querySelectorAll('.task__name') as NodeListOf<HTMLSpanElement>

    this.init();
  }

  init() {
    this.UpdateButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        const taskId = button.dataset.id as string;
        const task = button.closest('.task') as HTMLElement
        const taskTitle = task.querySelector('.task__name')?.textContent as string;

        this.updateTaskTitle(taskId, taskTitle);
      })
    })

    this.TaskNameFields.forEach(field => {
      field.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
          e.preventDefault();
          const task = field as HTMLSpanElement;
          const taskTitle = field.textContent as string;
          const taskElement = task.closest('.task') as HTMLElement;
          const taskId = taskElement.dataset.id as string;

          this.updateTaskTitle(taskId, taskTitle);
        }
      })
    })
  }
  public async updateTaskTitle(taskId: string, title: string) {
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
}


export default ChecklistUpdateTaskTitle;