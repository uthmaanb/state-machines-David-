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
			<div className="form-container">
				<div className="form-header">
					<h2>State Machine Payment Form</h2>
				</div>

				<div className="form-body">
					<form>
						<div className="form-group">
							<label htmlFor="NameOnCard">Name on card</label>
							<input
								onChange={this.handleChange}
								value={current.context.name}
								id="NameOnCard"
								name="name"
								className="form-control"
								type="text"
								// maxLength="255"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="CreditCardNumber">Card number</label>
							<input
								onChange={this.handleChange}
								value={current.context.card}
								id="CreditCardNumber"
								name="card"
								className="null card-image form-control"
								type="text"
							/>
						</div>
						<button
							id="PayButton"
							className="btn btn-block btn-success submit-button"
							type="button"
							onClick={this.handleSubmit}
						>
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
