import React from "react";
import "../App.css";
import Search from "../search";
import { TopTrades } from "../Toptrade";
import WhatweDo from "./whatwedo";
import Review from "../revies";
import "../review.css";
import FAQ from "./faq";
import Footer from "../footer";
import "../footer.css"

function Home() {
  return (
    <div >
      <div className="home-container">
      <h1 className="link-headline" >
          LINKING YOU WITH EXPERTS THAT WORK WITH PASSION AND PRECISION
        </h1>
        <Search />
        <div></div>
      </div>
      <TopTrades />
      <hr />
      <div className="block"></div>
      <div className="container">
        <h1 className="headline">WHO WE ARE & WHAT WE STAND FOR</h1>

        <div className="content-section">
          <div className="multi-image">
            <img src="/multipic.jpg" alt="SKILLHUB services" />
          </div>

          <div class="article">
            <p>
              Finding reliable service providers in Nigeria can be a challenge,
              especially for new residents or those without established
              networks. Random online searches often lead to unverified workers,
              inconsistent service quality, and a lack of transparency.
            </p>
                    <br /><br /><br />
            <p>
              <span style={{color:"#0575E6"}}>SKILL</span>HUB is here to change that. Our platform connects you with
              skilled professionals—plumbers, electricians, artists, and
              more—based on trusted recommendations and verified profiles.
              Whether you're a homeowner, renter, or small business owner, we
              make hiring seamless, secure, and stress-free.
            </p>
          </div>
        </div>

        <div className="content-section">
          <div className="article">
            {/* <p>
              SKILLHUB is here to change that. Our platform connects you with
              skilled professionals—plumbers, electricians, artists, and
              more—based on trusted recommendations and verified profiles.
              Whether you're a homeowner, renter, or small business owner, we
              make hiring seamless, secure, and stress-free.
            </p> */}
          </div>
        </div>
      </div>
      <div className="what-we-do">
        <h2 style={{ textAlign: "center" }}>HOW DO WE HELP</h2>
        <WhatweDo />

        <div>
          <Review />
        </div>
      </div>
      <h2>Frequently Asked Questions (FAQ)</h2>
      {/* <div className="faq">
        <ol>
          <li>
            <details>
              <summary>How do I know workers are trustworthy?</summary>
              <p>
                We verify workers through background checks, certifications, and
                customer reviews. Plus, our rating system ensures only top-rated
                professionals get higher visibility. You can also check past
                work examples and community feedback before booking.
              </p>
              <p>
                <a href="">Read more into our verification process</a>
              </p>
              <hr />
            </details>
          </li>
          <li>
            <details>
              <summary>Is there a fee for using this service?</summary>
              <p>
                Yes, there is a small service fee for using our platform. This
                fee helps us maintain the quality of our services and provide
                customer support.
              </p>
              <hr />
            </details>
          </li>
          <li>
            <details>
              <summary>How does this platform work?</summary>
              <p>
                Our platform connects you with skilled professionals in your
                area. You can browse profiles, read reviews, and book services
                directly through the platform.
              </p>
              <hr />
            </details>
          </li>
          <li>
            <details>
              <summary>Can I re-schedule or cancel a booking?</summary>
              <p>
                Yes, you can re-schedule or cancel a booking up to 24 hours
                before the scheduled service. Please check the cancellation
                policy for more details.
              </p>
              <hr />
            </details>
          </li>
          <li>
            <details>
              <summary>
                What happens if I’m not satisfied with a service?
              </summary>
              <p>
                If you're not satisfied with a service, please contact our
                support team within 48 hours. We will work with you and the
                professional to resolve the issue.
              </p>
              <hr />
            </details>
          </li>
          <li>
            <details>
              <summary>How do I receive payments for my work?</summary>
              <p>
                Payments are processed through our secure platform. You will
                receive your earnings directly to your bank account or preferred
                payment method after the service is completed.
              </p>
              <hr />
            </details>
          </li>
          <li>
            <details>
              <summary>What services can I find on this platform?</summary>
              <p>
                You can find a wide range of services, including home repairs,
                cleaning, tutoring, event planning, and more. Browse our
                categories to discover all available services.
              </p>
              <hr />
            </details>
          </li>
        </ol> */}
        <FAQ/>
        
      {/* </div> */}
      <Footer/>
    </div>
  );
}
export default Home;
