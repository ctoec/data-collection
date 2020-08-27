import moment from 'moment';

export function parseDateChange(event: React.ChangeEvent<any>) {
	return event.target.value ? moment.utc(parseInt(event.target.value, 10)).toDate() : null;
}