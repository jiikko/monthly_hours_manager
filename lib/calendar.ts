export function allDaysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  let days = [];
  
  for (let i = 1; i <= new Date(year, month + 1, 0).getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  return days;
}
