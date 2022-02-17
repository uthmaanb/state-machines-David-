import React from "react";
import { assign, createMachine, interpret } from "xstate";

import fakePayment from "../utils/fakePayments";

const stateMachine = createMachine({
	initial: "idle",
	context: {
		name: "",
		card: "",
	},
	states: {
		idle: {
			on: {
				SUBMIT: "loading",
			},
		},
		loading: {
			invoke: {
				id: "doPayment",
				// src: (context, event) => fakePayment(),
				src: (context, event) => {
					console.log(context);
					fakePayment(context.name, context.card);
				},
				onDone: {
					target: "success",
				},
				onError: {
					target: "error",
				},
			},
		},
		error: {
			on: {
				SUBMIT: "loading",
			},
		},
		success: {
			type: "final",
		},
	},

	on: {
		INPUT_CHANGE: {
			actions: assign((context, event) => {
				return {
					[event.name]: event.value,
				};
			}),
		},
	},
});

class PaymentForm extends React.Component {
	state = {
		current: stateMachine.initialState,
	};

	// idle, loading, success, error
	service = interpret(stateMachine).onTransition((current) => {
		console.log(current);
		this.setState({ current });
	});

	componentDidMount() {
		this.service.start();
	}

	componentWillUnmount() {
		this.service.stop();
	}

	handleSubmit = () => {
		console.log("Submitting");
		this.service.send("SUBMIT");
	};

	handleChange = (e) => {
		this.service.send("INPUT_CHANGE", {
			name: e.target.name,
			value: e.target.value,
		});
	};

	render() {
		const { current } = this.state;
		return (
			<div className="container">
				<h2 className="header">State Machine Payment Form</h2>
				<div className="form__body">
					<form>
						<div>
							<label htmlFor="NameOnCard">Name on card</label>
							<input
								onChange={this.handleChange}
								value={current.context.name}
								id="NameOnCard"
								type="text"
								name="name"
							/>
						</div>
						<div>
							<label htmlFor="CreditCardNumber">Card number</label>
							<input
								onChange={this.handleChange}
								value={current.context.card}
								id="CreditCardNumber"
								name="card"
								type="text"
							/>
						</div>
						<button type="button" onClick={this.handleSubmit}>
							<span className="submit-button-lock" />
							<span className="align-middle">Pay Now</span>
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default PaymentForm;
