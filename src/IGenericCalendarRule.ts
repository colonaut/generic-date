/**
 * Created by kalle on 13.05.2015.
 */
export default interface IGenericCalendarRule {
    yearDays: number; //How many days has one year
    leapYearDays: number; //how many days has one leap year
    leapYear: Array<number>; //when does a leap year occur
    months: Array<number>; //how many months in a year and how many days in each month
    leapMonths: Array<number>;
    weekDays: number; //how many days has a week
    hours: number;
    minutes: number;
    seconds: number;
    isLeapYear(year:number) : boolean;
    getDaysSince(year:number, since?:number): number;
    getLeapYearsSince(year:number, since?:number):number
    getLeapDaysSince(day:number, since?:number):number;
}