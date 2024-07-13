// utils.ts
import axios from "axios";
import moment from "moment";

export const formatDate = (timestamp: any) => {
  return moment(timestamp).format("YYYY-MM-DD");
};

export const formatTime = (timestamp: any) => {
  return moment(timestamp).format("HH:mm");
};

export const isNewDay = (currentMessage: any, previousMessage: any) => {
  if (!previousMessage) return true;

  const currentDate = formatDate(currentMessage?.timestamp);
  const previousDate = formatDate(previousMessage?.timestamp);

  return currentDate !== previousDate;
};
export const formatDateNoti = (timestamp: any) => {
   const now = moment();
   const notificationTime = moment(timestamp);
   const duration = moment.duration(now.diff(notificationTime));
   const daysDifference = duration.asDays();

   if (daysDifference <= 1) {
     // إذا كان الفرق أقل من يوم واحد
     return notificationTime.format("HH:mm");
   } else if (daysDifference <= 30) {
     // إذا كان الفرق بين يوم وشهر
     return notificationTime.format("MM-DD HH:mm");
   } else {
     // إذا كان الفرق أكثر من شهر
     return notificationTime.format("DD-MM-YYYY");
   }
 };

