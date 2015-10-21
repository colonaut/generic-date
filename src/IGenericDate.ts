interface IGenericDate {
    year: number;
    yearDay: number;
    month: number;
    monthDay: number;
    monthDays: number;
    weekDay: number;
    hour: number;
    minute: number;
    second: number;
    ms: number;
    isLeapYear: boolean;
    toISOString(): string;
}
export = IGenericDate;