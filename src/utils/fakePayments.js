/* We don"t actually have a a backend service for this payment system, so instead we're rolling with
    a Math.random dice and resolving or rejecting a fake payment promise. */

export default function fakePayment() {
	return new Promise((resolve, reject) => {
		console.log("taking payment...");
		setTimeout(() => {
			const dice = Math.floor(Math.random() * Math.floor(2));

			if (dice === 0) return resolve("Payment succeeded.");

			return reject("Payment failed.");
		}, 1000);
	});
}
