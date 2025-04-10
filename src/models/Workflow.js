export class Workflow {
  constructor(name, id, xml) {
    this.name = name;
    this.id = id;
    this.xml = xml;
    this.instances = []; // Список экземпляров этого workflow
  }

  addInstance(instance) {
    this.instances.push(instance);
  }

  isInstancesNotNull() {
    return this.instances.length !== 0
  }

  getState() {
    if (this.instances.length === 0) {
      return "No instances"; // Если нет экземпляров
    }

    // Проверяем, все ли экземпляры завершены
    const allCompleted = this.instances.every(instance => {
      // Предполагаем, что у Instance есть свойство endTime или completedAt
      return instance.endTime !== null || instance.completedAt !== undefined;
    });

    return allCompleted ? "Completed" : "In work";
  }
}
