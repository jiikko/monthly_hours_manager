export function allDaysInMonth(year, month) {
  let days = [];
  
  for (let i = 1; i <= new Date(year, month + 1, 0).getDate(); i++) {
    days.push(new Date(year, month -1, i));
  }
  
  return days;
}
