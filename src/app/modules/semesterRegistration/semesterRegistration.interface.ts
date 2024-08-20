import { Types } from "mongoose";



export interface ISemesterRegistration{
    academicSemester:Types.ObjectId;
    status:'ONGOING'|'UPCOMING'|'ENDED';
    startDate:string;
    endDate:string;
    minCredit:number;
    maxCredit:number;
}