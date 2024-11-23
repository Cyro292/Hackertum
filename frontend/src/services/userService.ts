class UserService {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async subscribeEmail(email: string): Promise<void> {
		try {
			await new Promise((resolve) => setTimeout(resolve, 100));
		} catch (error) {
			console.error("Error subscribing email:", error);
			throw error;
		}
	}
}

export const userService = new UserService();
