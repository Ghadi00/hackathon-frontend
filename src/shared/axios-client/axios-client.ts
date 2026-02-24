import axios from 'axios';

export const axios_ = axios.create();
export const axios_m = axios.create();

export const credentialsStore: Record<string, string> = {
	Authorization: '',
	orgId: '',
};
