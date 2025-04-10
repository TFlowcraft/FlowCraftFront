export class Task {
  constructor(id, bpmnId, name, status, startTime, endTime = null) {
    this.id = id;
    this.bpmnId = bpmnId;
    this.name = name;
    this.status = status;
    this.startTime = this._parseUnixTimeWithNanos(startTime);
    this.endTime = endTime ? this._parseUnixTimeWithNanos(endTime) : null;
  }

  _parseUnixTimeWithNanos(unixTimeWithNanos) {
    if (unixTimeWithNanos > 1e12) {
      return new Date(unixTimeWithNanos);
    }

    const [secondsStr, nanosStr] = String(unixTimeWithNanos).split('.');
    const seconds = parseInt(secondsStr, 10);
    const nanos = nanosStr ? parseInt(nanosStr.slice(0, 6), 10) : 0; // Берём только до микросекунд (6 цифр)


    const milliseconds = seconds * 1000 + Math.floor(nanos / 1e6);
    return new Date(milliseconds);
  }
}