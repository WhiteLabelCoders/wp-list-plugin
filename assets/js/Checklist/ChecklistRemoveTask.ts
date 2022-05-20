import { callAjax } from '../helpers';

class ChecklistRemoveTask {
  RemoveButtons: NodeListOf<HTMLButtonElement>

  constructor() {
    this.RemoveButtons = document.querySelectorAll('.simple-checklist__removeTask');

    this.init();
  }

  public init() {

    this.RemoveButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        const taskId = button.dataset.id as string;

        this.removeTask(taskId, button);
      })
    })
  }
  public async removeTask(taskId: string, el: HTMLElement) {
    const formData = new FormData();
    formData.append('action', 'removeTask');
    formData.append('taskID', taskId)

    return callAjax({
      method: 'POST',
      body: formData
    }).then(res => {
      if (res.ok) {
        const task = el.closest('.task') as HTMLElement
        task.remove();
      }
    }).catch(error => {
      console.error('Error: ', error);
    })
  }
}

export default ChecklistRemoveTask;