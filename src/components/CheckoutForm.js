import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { BookContext } from "../context/books";
import { CartContext } from "../context/cart";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import emailjs from '@emailjs/browser';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

const CheckoutForm = () => {
  const { cart, total, clearCart } = useContext(CartContext);
  const { checkout } = useContext(BookContext);
  const [orderDetails, setOrderDetails] = useState({ cart, total, address: null, token: null });
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();
  

  useEffect(() => {
    if (orderDetails.token) {
      checkout(orderDetails);
      clearCart();
      history.push("/");
    }
  }, [orderDetails, checkout, clearCart, history]);

  // Handle real-time validation errors from the card Element.
  const handleChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };
  const [emailAddress, setEmailAddress] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  // const [message, setMessage] = useState('');

  // Handle form submission.
  const handleSubmit = async (event) => {
    event.preventDefault();
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    const emailAdd = `${emailAddress}`;
    const sendAdd = `${sendAddress}`;

    var templateParams = {
      reply_to: emailAdd,
      send_address: sendAdd
    };
   
    emailjs.send('service_23zawt4', 'template_toq7i57', templateParams, 'r6zCBUK-8UTZop1V1')
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
          console.log('FAILED...', error);
    });


    if (result.error) {
      // Inform the user if there was an error.
      setError(result.error.message);
    } else {
      setError(null);
      // Send the token to your server.
      const token = result.token;
      setOrderDetails({ ...orderDetails, token: token.id });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="checkout-form">
        <label htmlFor="checkout-address">Billing Address</label>
        <input
          id="checkout-address"
          name="checkout-address"
          type="text"
          onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
        />
        <label>Delivery Address</label>
        <input
        type="text"
        id="sendAddress"
        name="sendAddress"
        value={sendAddress}
        onChange={(event) =>
          setSendAddress(event.target.value)
        }
        />
        <label>Email Address</label>
        <input
        type="text"
        id="emailAddress"
        name="emailAddress"
        value={emailAddress}
        onChange={(event) =>
          setEmailAddress(event.target.value)
        }
        />
        <div className="stripe-section">
          <label htmlFor="stripe-element"> Credit or debit card </label>
          <CardElement id="stripe-element" options={CARD_ELEMENT_OPTIONS} onChange={handleChange} />
        </div>
        <div className="card-errors" role="alert">
          {error}
        </div>
      </div>
      <button type="submit" className="btn">
        Submit Payment
      </button>
    </form>
  );
};

export default CheckoutForm;
