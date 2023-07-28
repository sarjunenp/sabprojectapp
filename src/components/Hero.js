import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="hero">
            <h2>Online Ecommerce Shop</h2>
            <h3>A home without products is like a <br />body without a soul</h3>
            <Link className="btn" to="/books">View All Products</Link>
        </section>
    )
}

export default Hero
