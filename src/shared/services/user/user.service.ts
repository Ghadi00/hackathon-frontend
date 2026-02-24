import { Signal, signal } from '@preact/signals';
import type { UserData } from '../../models/user/user.model';

export default class UserService {
	private userData: Signal<UserData> = signal({
		id: '',
		username: '',
		email: '',
	});

	setUserData(userData: UserData) {
		this.userData.value = userData;
	}

	getUserData() {
		return this.userData.value;
	}
}
