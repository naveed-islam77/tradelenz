import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);


export const applyFilters = (query: any, filter: any) => {
  const conditions = [];

  if (filter === "today") {
    conditions.push({
      field: "date_open",
      type: "between",
      value: [
        dayjs().startOf("day").toISOString(),
        dayjs().endOf("day").toISOString(),
      ],
    });
  }

  if (filter === "wins") conditions.push({ field: "result", type: "gt", value: 0 });
  if (filter === "losses") conditions.push({ field: "result", type: "lt", value: 0 });
  if (filter === "breakeven") conditions.push({ field: "result", type: "eq", value: 0 });


   if (filter === 'week' || filter === 'weekly') {
    conditions.push({
      field: 'date_open',
      type: 'between',
      value: [
        dayjs().startOf('week').toISOString(),
        dayjs().endOf('week').toISOString(),
      ],
    });
  }


  if (typeof filter === "object" && filter.field) {
    if (filter.field === "Date") {
      conditions.push({
        field: "date_open",
        type: "between",
        value: [
          dayjs(filter.value).startOf("day").toISOString(),
          dayjs(filter.value).endOf("day").toISOString(),
        ],
      });
    } else {
      conditions.push({
        field: filter.field.toLowerCase(),
        type: "eq",
        value: filter.value,
      });
    }
  }

  conditions.forEach((f) => {
    if (f.type === "between") {
      query = query.gte(f.field, f.value[0]).lte(f.field, f.value[1]);
    } else {
      query = query[f.type](f.field, f.value);
    }
  });

  return query;
};
