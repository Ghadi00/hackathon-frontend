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
	performance: {
		registrations: `${_baseUrl}/performance/registrations`,
		capabilities: `${_baseUrl}/performance/capabilities`,
		growth: `${_baseUrl}/performance/growth`,
	},
	interests: {
		areas: `${_baseUrl}/interests/areas`,
		motivations: `${_baseUrl}/interests/motviations`,
		challenges: `${_baseUrl}/interests/challenges`,
	},
	geographic: {
		regional: `${_baseUrl}/geographic/regional`,
		channels: `${_baseUrl}/geographic/channels`,
	},
	profiles: {
		admins: `${_baseUrl}/profiles/admins`,
		demographics: `${_baseUrl}/profiles/demographics`,
		programs: `${_baseUrl}/profiles/programs`,
	},
};

export default api;
