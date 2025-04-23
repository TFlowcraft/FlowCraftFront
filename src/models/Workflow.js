export class Workflow {
  constructor(name, id, xml) {
    this.name = name;
    this.id = id;
    this.xml = xml;
    this.instances = [];
  }

  addInstance(instance) {
    this.instances.push(instance);
  }

  isInstancesNotNull() {
    return this.instances.length !== 0
  }

  getState() {
    if (this.instances.length === 0) {
      return "No instances";
    }

    // Проверяем, все ли экземпляры завершены
    const allCompleted = this.instances.every(instance => {
      return instance.endTime !== null || instance.completedAt !== undefined;
    });

    return allCompleted ? "Completed" : "In work";
  }
}
