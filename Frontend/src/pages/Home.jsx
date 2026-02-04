import { Link } from "react-router-dom";
import BrowseServices from "../components/services/BrowseServices";
import bg from "./../assets/bgb.png";
import "../Style/Home.css";

const Home = () => {
    return(
        <main className="home">
            {/* <p>Hero Section</p> */}
            <Hero></Hero>
            {/* <BrowseServices from="home"/>
            <p>Get involved section</p>
            <section className="get-involved" style={{display: 'flex'}}>
                <div className="be-customer" style={{width:'250px', aspectRatio:'1.5', border:'2px solid red', display:'flex', justifyContent:'center', alignItems: 'center'}}>Become a Customer</div>
                <div className="be-provider" style={{width:'250px', aspectRatio:'1.5', border:'2px solid red', display:'flex', justifyContent:'center', alignItems: 'center'}}>Become a Provider</div>
            </section>
            <p>User comments and views</p>
            <h3>See what our users have to say</h3>
            <p>FAQs</p>
            <h3>Frequently Asked Questions</h3> */}
        </main>
    );
};

export default Home;

const Hero = () => {
    return(
        <section className="hero">
            <h1>Home Section</h1>
        </section>
    );
};