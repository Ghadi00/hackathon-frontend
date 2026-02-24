const _baseUrl = import.meta.env.VITE_APP_API;


const api = {
	baseUrl: _baseUrl,
	auth: {
		register: `${_baseUrl}/users/signup`,
		login: `${_baseUrl}/users/login`,

        logout: `${_baseUrl}/auth/logout`,
		session: `${_baseUrl}/users/session`,

		verifyEmail: `${_baseUrl}/users/verify`,

		requirePasswordReset: `${_baseUrl}/auth/request-password-reset`,
		resetPassword: `${_baseUrl}/auth/reset-password`,
	},
};

export default api;