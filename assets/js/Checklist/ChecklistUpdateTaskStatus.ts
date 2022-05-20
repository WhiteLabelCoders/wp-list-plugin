import { callAjax } from "../helpers";

class ChecklistUpdateTaskStatus {
  taskStatusCheckboxes: NodeListOf<HTMLInputElement>

  constructor() {
    this.taskStatusCheckboxes = document.querySelectorAll('.task__status') as NodeListOf<HTMLInputElement>
    this.init();
  }

  init() {
    this.taskStatusCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const task = checkbox.closest('.task') as HTMLElement;
        const taskId = task.dataset.id as string;
        task.classList.toggle('task--done');

        this.updateTaskStatus(taskId);
      })
    })
  }

  public async updateTaskStatus(taskId: string) {
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
}

export default ChecklistUpdateTaskStatus;