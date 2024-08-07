//The interval is the duration of the meeting event (eg. 15, 30, 45, 60)

type Props = {
  interval: number;
  setTimeSlots: (slots: string[]) => void;
  start_time: string;
  end_time: string;
};

export default function createTimeSlots({
  interval,
  setTimeSlots,
  start_time,
  end_time,
}: Props) {
  let start_time_hours = parseInt(start_time.split(':')[0]);
  let start_time_minutes = parseInt(start_time.split(':')[1]);
  let end_time_hours = parseInt(end_time.split(':')[0]);
  let end_time_minutes = parseInt(end_time.split(':')[1]);

  if (start_time_hours === 0) {
    start_time_hours = 24;
  }

  if (end_time_hours === 0) {
    end_time_hours = 24;
  }

  if (start_time_minutes % 15 !== 0) {
    start_time_minutes = Math.ceil(start_time_minutes / 15) * 15;
  }

  if (end_time_minutes % 15 !== 0) {
    end_time_minutes = Math.floor(end_time_minutes / 15) * 15;
  }

  const startTime = start_time_hours * 60 + start_time_minutes;
  const endTime = end_time_hours * 60 + end_time_minutes;
  const totalSlots = (endTime - startTime) / interval;

  //We can set a fixed array length. Since we are not iterating anything from the beginning to create the new array, the first value of the callback is undefined, therefore we won't use it and in this case we will just access the index
  const slots = Array.from({ length: totalSlots }, (_, index) => {
    const totalMinutes = startTime + index * interval;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedHours = hours > 12 ? hours - 12 : hours; //Convert to 12-hour format
    const period = hours >= 12 && hours !== 24 ? 'PM' : 'AM';
    //padStart is a method that adds a character to the beginning of a string until it reaches the desired length
    return `${String(formattedHours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')} ${period}`;
  });

  setTimeSlots(slots);
}
