export class Instance {
    constructor(id, startTime, endTime = null, businessData = {}) {
        this.id = id;
        this.startTime = this._parseUnixTimeWithNanos(startTime);
        this.endTime = isNaN(endTime) ? null : this._parseUnixTimeWithNanos(endTime);
        this.businessData = businessData;
        this.tasks = []; // Список задач этого экземпляра
    }

    get status() {
        return !isNaN(this.endTime) ? "COMPLETE" : "RUN";
    }


    getActiveTasks() {
        return this.tasks.filter((task) => !task.endTime);
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
